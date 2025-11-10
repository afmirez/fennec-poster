import json
import sys
from pathlib import Path

def main():
    raw_file_paths = sys.argv[1:]
    categories = sorted({Path(p).resolve().parent.name for p in raw_file_paths})
    output = {"categories": categories}
    print(json.dumps(output, indent=4))


if __name__ == "__main__":
    main()