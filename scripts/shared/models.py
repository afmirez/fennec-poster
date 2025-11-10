from typing import Optional
from dataclasses import dataclass, field
from scripts.shared.constants import ValidTags

@dataclass(slots=True)
class Frontmatter:
    title: str = ""
    description: str = ""
    order: Optional[int] = None
    tags: list[ValidTags] = field(default_factory=list)
    category: str = ""
    id : str = ""

@dataclass(slots=True)
class ValidationResult:
    ok: bool
    errors: list[str]