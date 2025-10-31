import sys
from pathlib import Path
import yaml
from typing import Any
import re
import markdown
from dataclasses import asdict
import json

from scripts.shared.models import (
    FRONTMATTER_BANNER,
    FRONTMATTER_DELIMITER,
    Frontmatter,
    FrontmatterField,
    FrontmatterValidationError,
    ValidationResult,
    VALID_FRONTMATTER_FIELDS,
    VALID_TAGS,
)

def _is_frontmatter_present(file_data: str) -> dict[str, Any] | None:
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

def validate_process_data(file_paths: list[Path]) -> None:
    """
    """
    try:
        # Phase 1: Validate all files before creating objects
        ft_title_object : dict[str, Frontmatter] = {}
        ft_title_content : dict[str, str] = {}

        for path in file_paths:
            file_content = path.read_text(encoding="utf-8")
            frontmatter_dict = _is_frontmatter_present(file_content)

            if frontmatter_dict:
                validation_result: ValidationResult = _check_frontmatter_validity(frontmatter_dict)
                if not validation_result.ok:
                    msg = "Invalid frontmatter:\n- " + "\n- ".join(f"{path}: {e}" for e in validation_result.errors)
                    raise FrontmatterValidationError([msg])
            else:
                raise FrontmatterValidationError([f"File {path} Frontmatter not present. You will need to check what happened"])
            
            frontmatter = Frontmatter(**frontmatter_dict)
            ft_title_object[frontmatter.Title] = frontmatter


            # Phase 2 get parsed html:
            parts = re.split(r"^---\s*\n.*?\n---\s*\n?", file_content, maxsplit=1, flags=re.DOTALL)
            content_after = parts[1] if len(parts) > 1 else file_content

            html = markdown.markdown(content_after)


            ft_title_content[frontmatter.Title] = html




        
        # Phase 3: return the data we need for the gha actionm which is json data

        dataToReturn = []

        for el, fmt in ft_title_object.items():
            new_dic = {
                "frontmatter" : asdict(fmt)
            }
            new_dic["html"] = ft_title_content[el]
            dataToReturn.append(new_dic)

        json_str = json.dumps(dataToReturn, indent=4)

        print(json_str)

        


            


    except FileNotFoundError as e:
        raise FileNotFoundError(f"Could not open file: {path}") from e

def main():
    raw_file_paths = sys.argv[1:]
    absolute_paths = [Path(path).resolve() for path in raw_file_paths]
    validate_process_data(absolute_paths)

if __name__ == "__main__":
    main()

# A este punto el script VALIDA y imprimw JSON data
# Pendiente de refactor de shared y mejora general total
# Pendiente "REGRESAR REALMENTE" Json
