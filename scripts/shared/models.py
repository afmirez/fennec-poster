from enum import Enum
from typing import Iterable, Optional
from dataclasses import dataclass, field

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
    TITLE = "Title"
    DESCRIPTION = "Description"
    ORDER = "Order"
    TAGS = "Tags"
    CATEGORY = "Category" # Field auto-filled by the script
class ValidTags(Enum):
    JS = "JavaScript"
    PYTHON = "Python"

# Derived constants (valid lists)
VALID_FRONTMATTER_FIELDS: tuple[str, ...] = tuple(f.value for f in FrontmatterField)
VALID_TAGS: tuple[str, ...] = tuple(t.value for t in ValidTags)

# Dataclasses
@dataclass(slots=True)
class Frontmatter:
    Title: str = ""
    Description: str = ""
    Category: str = ""
    Tags: list[ValidTags] = field(default_factory=list)
    Order: Optional[int] = None

@dataclass(slots=True)
class ValidationResult:
    ok: bool
    errors: list[str]

# Custom Errors
class FrontmatterValidationError(ValueError):
    def __init__(self, errors: Iterable[str]):
        self.errors = list(errors)
        msg = "Invalid frontmatter:\n- " + "\n- ".join(self.errors)
        super().__init__(msg)