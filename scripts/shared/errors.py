from typing import Iterable

class FrontmatterValidationError(ValueError):
    def __init__(self, errors: Iterable[str]):
        self.errors = list(errors)
        msg = "Invalid frontmatter:\n- " + "\n- ".join(self.errors)
        super().__init__(msg)