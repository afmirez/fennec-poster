import sys
from pathlib import Path
import re
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
)

@dataclass
class GHABody:
    frontmatter : Frontmatter
    



def validate_process_data(file_paths: list[Path]) -> None:
    """
    """
    try:
        # Phase 1: Validate all files before creating objects
        ft_title_object : dict[str, Frontmatter] = {}
        ft_title_content : dict[str, str] = {}

        for path in file_paths:
            file_content = path.read_text(encoding="utf-8")
            frontmatter_dict = is_frontmatter_present(file_content)

            if frontmatter_dict:
                validation_result: ValidationResult = check_frontmatter_validity(frontmatter_dict)
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