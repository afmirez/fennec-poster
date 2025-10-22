
from enum import Enum
from typing import List, Optional
from dataclasses import dataclass

class FrontmatterField(Enum):
    # Fields that the note creator is expected to complete
    TITLE = "Title"
    DESCRIPTION = "Description"
    ORDER = "Order"
    TAGS = "Tags"
    # Fields that will be automatically filled in by this script
    CATEGORY = "Category"

@dataclass
class Frontmatter:
    Title : str
    Description : str
    Order : Optional[int] = None
    Tags : Optional[List[int]] = None
    Category : str

VALID_FRONTMATTER_FIELDS = [field.value for field in FrontmatterField]