"""Pull the ```json block under section B of notes/06-rulebook/rulebook.md into rules.json.

Run after every rulebook edit: python -m ref_pipeline.extract_rules
The rulebook is the source of truth; rules.json is the loadable copy the app ships.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RULEBOOK = os.path.normpath(os.path.join(HERE, "..", "..", "notes", "06-rulebook", "rulebook.md"))
OUT = os.path.join(HERE, "rules.json")


def extract(src=RULEBOOK, out=OUT):
    text = open(src, encoding="utf-8").read()
    m = re.search(r"## B\. rules\.json.*?```json\n(.*?)\n```", text, re.S)
    if not m:
        sys.exit("rules.json block not found in " + src)
    rules = json.loads(m.group(1))
    with open(out, "w", encoding="utf-8") as f:
        json.dump(rules, f, indent=1, ensure_ascii=False)
    return rules


if __name__ == "__main__":
    r = extract()
    print(f"rules.json v{r['rulebook_version']} ({r['date']}): {len(r['rules'])} rules -> {OUT}")
