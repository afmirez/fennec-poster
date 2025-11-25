import sys
from pathlib import Path
from typing import Any, Optional
import markdown
from dataclasses import asdict, dataclass
import json

from scripts.shared.models import (
    Frontmatter,
    ValidationResult,
)

from scripts.shared.errors import FrontmatterValidationError

from scripts.shared.frontmatter_utils import (
    is_frontmatter_present,
    check_frontmatter_validity,
    get_content_after_frontmatter,
    validate_unique_fields_per_category
)

@dataclass
class GHARequestPayload:
    frontmatter: Frontmatter
    html: Optional[str] = None

def _get_payload(path: Path, frontmatter_dict : dict[str, Any], markdown_content : str) -> str:
    """
    Build a GHA request payload by combining validated frontmatter data 
    and Markdown converted to HTML.
    """
    try:
        html = markdown.markdown(
            get_content_after_frontmatter(markdown_content),
            extensions=[
                "fenced_code",   
                "codehilite",   
                "tables",        
                "toc",         
            ]
        )

        return GHARequestPayload(
            frontmatter=Frontmatter(**frontmatter_dict),
            html=html,
        )
    except Exception as e:
        raise FrontmatterValidationError([f"Error converting Markdown in '{path}': {e}"])

    
def validate_process_data(file_paths: list[Path]) -> None:
    """
    Validate Markdown files, ensure frontmatter correctness, 
    convert content to HTML,  and print the resulting JSON payload to stdout 
    for GitHub Actions to consume.
    """
    try:
        payloads = []
        existing_frontmatters : list[ dict[str, Any]] = []

        for path in file_paths:
             # Phase 1: Validate all files before creating objects
            file_content = path.read_text(encoding="utf-8")
            frontmatter_dict = is_frontmatter_present(file_content)
            if frontmatter_dict:
                validation_result: ValidationResult = check_frontmatter_validity(frontmatter_dict)
                if not validation_result.ok:
                    msg = "Invalid frontmatter:\n- " + "\n- ".join(f"{path}: {e}" for e in validation_result.errors)
                    raise FrontmatterValidationError([msg])
                existing_frontmatters.append(frontmatter_dict)
            else:
                raise FrontmatterValidationError([f"File '{path}': missing frontmatter section."])
            
            # Phase 2: Get frontmatter data and convert from markdown to HTML
            payload = _get_payload(path, frontmatter_dict, file_content)
            payloads.append(asdict(payload))

        # Phase 3: Ensure each category has unique 'title' and 'order' values across its notes.     
        duplicate_errors: ValidationResult = validate_unique_fields_per_category(existing_frontmatters)
        if not duplicate_errors.ok:
            msg = "Duplicate values found:\n- " + "\n- ".join(f"{e}" for e in duplicate_errors.errors)
            raise FrontmatterValidationError([msg])

        # Phase 4: If no errors, print json data
        print(json.dumps(payloads))

    except FileNotFoundError as e:
        raise FileNotFoundError(f"Could not open file: {path}") from e

def main():
    raw_file_paths = sys.argv[1:]
    absolute_paths = [Path(path).resolve() for path in raw_file_paths]
    validate_process_data(absolute_paths)

if __name__ == "__main__":
    main()