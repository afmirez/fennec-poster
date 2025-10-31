import sys
from pathlib import Path

from scripts.shared.models import (
    ValidationResult,
)

from scripts.shared.errors import FrontmatterValidationError

from scripts.shared.frontmatter_utils import (
    is_frontmatter_present,
    check_frontmatter_validity,
    insert_frontmatter
)

def check_and_insert_frontmatter(file_paths: list[Path]) -> None:
    """
        Validates existing frontmatter and inserts new ones if missing.
        Stops on first invalid file; only inserts after all pass validation.
        Exits with code 1 so pre-commit prompts the user to complete them.
    """
    try:
        pending_insertion = set() 

        # Phase 1: Validate all files before making any changes
        for path in file_paths:
            file_content = path.read_text(encoding="utf-8")
            frontmatter_dict = is_frontmatter_present(file_content)

            if frontmatter_dict:
                validation_result: ValidationResult = check_frontmatter_validity(frontmatter_dict)
                if not validation_result.ok:
                    msg = "Invalid frontmatter:\n- " + "\n- ".join(f"{path}: {e}" for e in validation_result.errors)
                    raise FrontmatterValidationError([msg])
            else:
                pending_insertion.add(path)

        # Phase 2: Only reached if all files passed validation
        if pending_insertion:
            for file in pending_insertion:
                insert_frontmatter(file)
                print(f"[frontmatter] Please fill the new frontmatter for: {file}")
            sys.exit(1)

    except FileNotFoundError as e:
        raise FileNotFoundError(f"Could not open file: {path}") from e

def main():
    raw_file_paths = sys.argv[1:]
    absolute_paths = [Path(path).resolve() for path in raw_file_paths]
    check_and_insert_frontmatter(absolute_paths)

if __name__ == "__main__":
    main()