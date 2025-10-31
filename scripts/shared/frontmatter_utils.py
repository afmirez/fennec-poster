from dataclasses import asdict
from pathlib import Path
import yaml
import re
from typing import Any

from scripts.shared.constants import FRONTMATTER_BANNER, FRONTMATTER_DELIMITER, VALID_FRONTMATTER_FIELDS, VALID_TAGS, FrontmatterField
from scripts.shared.models import Frontmatter, ValidationResult


def is_frontmatter_present(file_data: str) -> dict[str, Any] | None:
    """Parse and return the YAML frontmatter if present; return None otherwise."""
    frontmatter_match = re.search(r"^---\s*\n(.*?)\n---", file_data, re.DOTALL)
    if not frontmatter_match:
        return None
    return yaml.safe_load(frontmatter_match.group(1))

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

def insert_frontmatter(path: Path) -> None:
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

def check_frontmatter_validity(frontmatter : dict[str, Any]) -> ValidationResult:
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