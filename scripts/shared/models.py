from typing import Optional
from dataclasses import dataclass, field
from scripts.shared.constants import ValidTags

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