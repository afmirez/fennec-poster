import sys
from pathlib import Path
from typing import Any

from scripts.shared.models import (
    ValidationResult,
)

from scripts.shared.errors import FrontmatterValidationError

from scripts.shared.frontmatter_utils import (
    is_frontmatter_present,
    check_frontmatter_validity,
    insert_frontmatter,
    validate_unique_fields_per_category
)

def check_and_insert_frontmatter(file_paths: list[Path]) -> None:
    """
        Validates existing frontmatter and inserts new ones if missing.
        Stops on first invalid file; only inserts after all pass validation.
        Exits with code 1 so pre-commit prompts the user to complete them.
    """
    try:
        pending_insertion = set()
        existing_frontmatters : list[ dict[str, Any]] = []

        # Phase 1: Validate frontmatter structure and required fields in all files.
        for path in file_paths:
            file_content = path.read_text(encoding="utf-8")
            frontmatter_dict = is_frontmatter_present(file_content)

            if frontmatter_dict:
                is_frontmatter_valid: ValidationResult = check_frontmatter_validity(frontmatter_dict)
                if not is_frontmatter_valid.ok:
                    msg = "Invalid frontmatter:\n- " + "\n- ".join(f"{path}: {e}" for e in is_frontmatter_valid.errors)
                    raise FrontmatterValidationError([msg])
                existing_frontmatters.append(frontmatter_dict)
            else:
                pending_insertion.add(path)

         # Phase 2: Ensure each category has unique 'title' and 'order' values across its notes.
        duplicate_errors: ValidationResult = validate_unique_fields_per_category(existing_frontmatters)
        if not duplicate_errors.ok:
            msg = "Duplicate values found:\n- " + "\n- ".join(f"{e}" for e in duplicate_errors.errors)
            raise FrontmatterValidationError([msg])

         # Phase 3: Insert missing frontmatters and prompt the user to complete them.
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