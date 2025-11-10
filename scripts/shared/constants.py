from enum import Enum

"""
Core definitions for frontmatter validation and structure.
Includes constants, enums, dataclasses, and custom errors.
"""

# Enums
class FrontmatterField(Enum):
    TITLE = "title"
    DESCRIPTION = "description"
    ORDER = "order"
    TAGS = "tags"
    CATEGORY = "category" # Field auto-filled by the script
    ID = "id" # Field auto-filled by the script
    
class ValidTags(Enum):
    JS = "JavaScript"
    PYTHON = "Python"

# Derived constants (valid lists)
VALID_FRONTMATTER_FIELDS: tuple[str, ...] = tuple(f.value for f in FrontmatterField)
VALID_TAGS: tuple[str, ...] = tuple(t.value for t in ValidTags)

# Constants
FRONTMATTER_BANNER = f"""\
# 🧩 FRONTMATTER
# • Fill in all fields.
# • Use strings (except 'order' = integer).
# • 'tags' must be a list of valid strings: {', '.join(sorted(VALID_TAGS))}.
# • ⚠️ Do NOT edit 'category' or 'id'.

"""

FRONTMATTER_DELIMITER = "---\n"
