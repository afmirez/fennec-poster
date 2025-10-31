from enum import Enum

"""
Core definitions for frontmatter validation and structure.
Includes constants, enums, dataclasses, and custom errors.
"""

# Constants
FRONTMATTER_BANNER = """\
# FRONTMATTER INSTRUCTIONS:
#  • Fill in all fields.
#  • DO NOT modify 'Category'.
#  • All values are strings, except 'Order' (integer).
#  • 'Tags' must be a list of valid string tags.

"""
FRONTMATTER_DELIMITER = "---\n"

# Enums
class FrontmatterField(Enum):
    TITLE = "title"
    DESCRIPTION = "description"
    ORDER = "order"
    TAGS = "tags"
    CATEGORY = "category" # Field auto-filled by the script
    
class ValidTags(Enum):
    JS = "JavaScript"
    PYTHON = "Python"

# Derived constants (valid lists)
VALID_FRONTMATTER_FIELDS: tuple[str, ...] = tuple(f.value for f in FrontmatterField)
VALID_TAGS: tuple[str, ...] = tuple(t.value for t in ValidTags)