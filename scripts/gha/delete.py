import json
import sys
from pathlib import Path
from typing import Any

from scripts.shared.models import (
    ValidationResult,
    DeleteNoteRequest
)

from scripts.shared.errors import FrontmatterValidationError

from scripts.shared.frontmatter_utils import (
    is_frontmatter_present,
    check_frontmatter_validity,
    get_delete_request
)

def validate_process_data(file_paths: list[Path]) -> None:
    """
    Validates frontmatters and extracts category and note_id for deletion.
    """
    try:
        existing_frontmatters : list[ dict[str, Any]] = []
        notes_to_remove : list[DeleteNoteRequest] = []

        for path in file_paths:
             # Phase 1: Validate frontmatters
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
            
            # Phase 2: Build deletion requests
            notes_to_remove.append(get_delete_request(frontmatter_dict))
        
         # Phase 3: Output deletion data
        print(json.dumps(notes_to_remove))

    except FileNotFoundError as e:
        raise FileNotFoundError(f"Could not open file: {path}") from e

def main():
    raw_file_paths = sys.argv[1:]
    absolute_paths = [Path(path).resolve() for path in raw_file_paths]
    validate_process_data(absolute_paths)

if __name__ == "__main__":
    main()