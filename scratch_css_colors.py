import re

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Clean comments
clean_css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)

# Parse rules
rules = []
for block in re.finditer(r'([^{]+)\{([^}]+)\}', clean_css):
    sel = block.group(1).strip()
    body = block.group(2).strip()
    rules.append((sel, body))

print(f"Total CSS rules: {len(rules)}")

# Let's inspect rules that set color:
color_rules = []
for sel, body in rules:
    color_m = re.findall(r'(?:^|;)\s*color\s*:\s*([^;]+)', body)
    bg_m = re.findall(r'(?:^|;)\s*(?:background|background-color)\s*:\s*([^;]+)', body)
    if color_m:
        for c in color_m:
            c_str = c.strip()
            bg_str = bg_m[0].strip() if bg_m else ""
            color_rules.append((sel, c_str, bg_str))

print(f"Rules with color: {len(color_rules)}")

# Group by color value
by_color = {}
for sel, c, bg in color_rules:
    by_color.setdefault(c, []).append((sel, bg))

for c, items in sorted(by_color.items(), key=lambda x: len(x[1]), reverse=True):
    print(f"\nColor: {c} ({len(items)} occurrences)")
    for sel, bg in items[:5]:
        print(f"   {sel[:60]}  [bg: {bg[:40]}]")
    if len(items) > 5:
        print(f"   ... and {len(items)-5} more")
