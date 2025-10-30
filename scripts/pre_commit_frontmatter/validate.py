import re
import sys
from dataclasses import asdict
from pathlib import Path
from typing import Any

import yaml

from models import (
    FRONTMATTER_BANNER,
    FRONTMATTER_DELIMITER,
    Frontmatter,
    FrontmatterField,
    FrontmatterValidationError,
    ValidationResult,
    VALID_FRONTMATTER_FIELDS,
    VALID_TAGS,
)

def _insert_frontmatter(path: Path) -> None:
    """Prepend delimiter + banner + frontmatter if missing. """
    existing_content = path.read_text(encoding="utf-8")
    frontmatter_dicc = asdict(Frontmatter(Category=path.parent.name))
    frontmatter_yaml = yaml.safe_dump(frontmatter_dicc, sort_keys=False, default_flow_style=False)
    frontmatter_block = (
        f"{FRONTMATTER_DELIMITER}"
        f"{FRONTMATTER_BANNER}"
        f"{frontmatter_yaml}"
        f"{FRONTMATTER_DELIMITER}\n"
    )
    path.write_text(frontmatter_block + existing_content, encoding="utf-8", newline="\n")

def _check_frontmatter_validity(frontmatter : dict[str, Any]) -> ValidationResult:
    errors : list[str] = []

    invalid_keys = set(frontmatter) - set(VALID_FRONTMATTER_FIELDS)
    missing_keys = set(VALID_FRONTMATTER_FIELDS) - set(frontmatter)
    for key in sorted(invalid_keys):
        errors.append(f"Unexpected key: {key}")
    for key in sorted(missing_keys):
        errors.append(f"Missing required key: {key}")
    
    for key, value in frontmatter.items():
        match key:
            case ( FrontmatterField.TITLE.value | FrontmatterField.DESCRIPTION.value | FrontmatterField.CATEGORY.value):
                if not(isinstance(value, str) and value):
                    errors.append(f"'{key}' must be a non-empty string")
            case FrontmatterField.TAGS.value:
                if not (isinstance(value, list) 
                        and len(value) > 0 
                        and all(isinstance(e, str) and e in VALID_TAGS for e in value)):
                    errors.append(f"'{key}' must be a list of valid tags ({', '.join(sorted(VALID_TAGS))})")
            case FrontmatterField.ORDER.value:
                if not (isinstance(value, int) and value > 0):
                    errors.append(f"'{key}' must be a positive integer")

    return ValidationResult(ok = not errors, errors = errors)

def _is_frontmatter_present(file_data: str) -> dict[str, Any] | None:
    """Parse and return the YAML frontmatter if present; return None otherwise."""
    frontmatter_match = re.search(r"^---\s*\n(.*?)\n---", file_data, re.DOTALL)
    if not frontmatter_match:
        return None
    return yaml.safe_load(frontmatter_match.group(1))

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
            frontmatter_dict = _is_frontmatter_present(file_content)

            if frontmatter_dict:
                validation_result: ValidationResult = _check_frontmatter_validity(frontmatter_dict)
                if not validation_result.ok:
                    msg = "Invalid frontmatter:\n- " + "\n- ".join(f"{path}: {e}" for e in validation_result.errors)
                    raise FrontmatterValidationError([msg])
            else:
                pending_insertion.add(path)

        # Phase 2: Only reached if all files passed validation
        if pending_insertion:
            for file in pending_insertion:
                _insert_frontmatter(file)
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