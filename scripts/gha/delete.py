import json
import sys
import subprocess
from dataclasses import asdict
from pathlib import Path
from typing import Any

from scripts.shared.models import ValidationResult, DeleteNoteRequest
from scripts.shared.errors import FrontmatterValidationError
from scripts.shared.frontmatter_utils import (
    is_frontmatter_present,
    check_frontmatter_validity,
    get_delete_request,
)

def read_file_at_commit(commit_sha: str, path: Path) -> str:
    """Read file contents at a given commit."""
    res = subprocess.run(
        ["git", "show", f"{commit_sha}:{path.as_posix()}"],
        check=False, capture_output=True, text=True
    )
    if res.returncode != 0:
        raise FileNotFoundError(f"Not found at {commit_sha}: {path}")
    return res.stdout

def validate_process_data(before_sha: str, file_paths: list[Path]) -> None:
    """
    Validates frontmatters (from BEFORE commit) and extracts category/note_id for deletion.
    """
    notes_to_remove: list[DeleteNoteRequest] = []

    for path in file_paths:
        file_content = read_file_at_commit(before_sha, path)

        fm = is_frontmatter_present(file_content)
        if fm:
            valiation_result: ValidationResult = check_frontmatter_validity(fm)
            if not valiation_result.ok:
                msg = "Invalid frontmatter:\n- " + "\n- ".join(f"{path}: {e}" for e in valiation_result.errors)
                raise FrontmatterValidationError([msg])

            req = get_delete_request(fm)
            notes_to_remove.append(req)
        else:
            raise FrontmatterValidationError([f"File '{path}': missing frontmatter section."])

    print(json.dumps([asdict(n) for n in notes_to_remove]))

def main():
    before = sys.argv[1]
    raw_file_paths = sys.argv[2:]
    absolute_paths = [Path(p).resolve() for p in raw_file_paths]
    validate_process_data(before, absolute_paths)

if __name__ == "__main__":
    main()