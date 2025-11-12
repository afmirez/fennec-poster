import json
import sys
import subprocess
from dataclasses import asdict
from pathlib import Path


from scripts.shared.models import ValidationResult, DeleteNoteRequest
from scripts.shared.errors import FrontmatterValidationError
from scripts.shared.frontmatter_utils import (
    is_frontmatter_present,
    check_frontmatter_validity,
    get_delete_request,
)

def read_file_at_commit(commit_sha: str, rel_path: Path) -> str:
    """Read file contents at a given commit using a path relative to repo root."""
    rel = rel_path.as_posix()
    res = subprocess.run(
        ["git", "show", f"{commit_sha}:{rel}"],
        check=False, capture_output=True, text=True
    )
    if res.returncode != 0:
        raise FileNotFoundError(f"Not found at {commit_sha}: {rel}")
    return res.stdout

def validate_process_data(before_sha: str, file_paths: list[Path]) -> None:
    """
    Validates frontmatters (from BEFORE commit) and extracts category/note_id for deletion.
    """
    notes_to_remove: list[DeleteNoteRequest] = []

    for rel_path in file_paths:
        file_content = read_file_at_commit(before_sha, rel_path)

        fm = is_frontmatter_present(file_content)
        if fm:
            validation_result: ValidationResult = check_frontmatter_validity(fm)
            if not validation_result.ok:
                msg = "Invalid frontmatter:\n- " + "\n- ".join(f"{rel_path}: {e}" for e in validation_result.errors)
                raise FrontmatterValidationError([msg])

            req = get_delete_request(fm) 
            notes_to_remove.append(req)
        else:
            raise FrontmatterValidationError([f"File '{rel_path}': missing frontmatter section."])

    print(json.dumps([asdict(n) for n in notes_to_remove]))

def main():

    if len(sys.argv) < 3:
        print("Usage: python -m scripts.gha.delete <BEFORE_SHA> <file1> [file2...]", file=sys.stderr)
        sys.exit(1)

    before = sys.argv[1]
    raw_file_paths = sys.argv[2:]


    repo_root = Path(
        subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True, check=True).stdout.strip()
    )

    rel_paths: list[Path] = []
    for p in raw_file_paths:
        pth = Path(p)

        if pth.is_absolute():
            try:
                p_rel = pth.relative_to(repo_root)
            except ValueError:
                p_str = str(pth)
                root_str = str(repo_root)
                if p_str.startswith(root_str):
                    p_rel = Path(p_str[len(root_str):].lstrip("/"))
                else:
                    p_rel = pth  
        else:
            p_rel = pth
        rel_paths.append(p_rel)

    validate_process_data(before, rel_paths)

if __name__ == "__main__":
    main()