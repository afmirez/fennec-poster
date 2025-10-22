import sys
import re
from pathlib import Path
import yaml
from typing import Any, Optional
from .constants import Frontmatter


# def _is_frontmatter_present(file_path: str, file_data: str) -> Optional[dict[str, Any]]:
def _is_frontmatter_present(file_data: str) -> dict[str, Any] | None:
    """Parse and return the YAML frontmatter if present; return None otherwise."""
    frontmatter_match = re.search(r"^---\s*\n(.*?)\n---", file_data, re.DOTALL)
    if not frontmatter_match:
        return None
    return yaml.safe_load(frontmatter_match.group(1))

def _create_files(file_path):


    category = ""

    frontmatter = Frontmatter(
        Title="",
        Description="",
        Category=""
    )



    print("file_path", file_path)

def file_handler(file_path):
    try:
        with open(file_path, "r") as file:
            file_data = file.read()
        
        if _is_frontmatter_present(file_data):
            # Check frontmatter
            print("IS PRESENT")
            pass
        else:
            # Add Frontmatter
            # Aca se anade el category automaticamente
            pass


        print("THE ENDDDDD OF FILE HANLDER")
    
    except FileNotFoundError as e:
        raise FileNotFoundError(f"Could not open file: {file_path}") from e
    
    pass 


def handler():
    raw_file_paths = sys.argv[1:]

    for file_path in raw_file_paths:
        abs_path = Path(file_path).resolve()
        file_handler(abs_path)

    print("Hello")

if __name__ == "__main__":
    handler()

# 1. pre-commit -> ANADE EL FRONTMATTER, COMPLETA CATEGORY Y PIDE QUE SE ESCRIBA LA DATA REQUERIDA EN TODOS LOS FILES
# 2. pre-commit -> confirma que TODOS los campos esten y sean validos


# Si es nueva, se anade y punto