from typing import Optional
from dataclasses import dataclass, field
from scripts.shared.constants import ValidTags

@dataclass(slots=True)
class Frontmatter:
    title: str = ""
    description: str = ""
    category: str = ""
    tags: list[ValidTags] = field(default_factory=list)
    order: Optional[int] = None

@dataclass(slots=True)
class ValidationResult:
    ok: bool
    errors: list[str]