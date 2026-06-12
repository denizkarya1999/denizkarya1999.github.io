from html import escape
from pathlib import Path
import re
import shutil

ROOT = Path("/home/denizkaryaacikbas/Projects/Deniz.Personal.Website")
OUT = Path("/home/denizkaryaacikbas/Projects/Personal Website")

PAGES = {
    "index.html": ROOT / "Pages/Index.razor",
    "education.html": ROOT / "Pages/Courses.razor",
    "courses.html": ROOT / "Pages/Courses.razor",
    "experience.html": ROOT / "Pages/Experience.razor",
    "academic.html": ROOT / "Pages/Projects/Academic.razor",
    "studio.html": ROOT / "Pages/Projects/Studio.razor",
    "hackathons.html": ROOT / "Pages/Projects/Hackathons.razor",
    "personal.html": ROOT / "Pages/Projects/Personal.razor",
    "awards.html": ROOT / "Pages/Awards.razor",
    "certificates.html": ROOT / "Pages/Certificates.razor",
    "extras.html": ROOT / "Pages/Extras.razor",
    "contact.html": ROOT / "Pages/Contact.razor",
}

NAV = [
    ("Home", "index.html"),
    ("Education", "education.html"),
    ("Experience", "experience.html"),
    ("Academic", "academic.html"),
    ("Studio", "studio.html"),
    ("Hackathon", "hackathons.html"),
    ("Personal", "personal.html"),
    ("Awards", "awards.html"),
    ("Certificates", "certificates.html"),
    ("Extras", "extras.html"),
    ("Resume", "assets/Deniz%20K.%20Acikbas.pdf"),
    ("Contact", "contact.html"),
]

ROUTES = {
    "": "index.html",
    "/": "index.html",
    "/education": "education.html",
    "Education": "education.html",
    "/experience": "experience.html",
    "Experience": "experience.html",
    "/academic": "academic.html",
    "Academic": "academic.html",
    "/studio": "studio.html",
    "Studio": "studio.html",
    "/hackathons": "hackathons.html",
    "Hackathons": "hackathons.html",
    "/personal": "personal.html",
    "Personal": "personal.html",
    "/awards": "awards.html",
    "Awards": "awards.html",
    "/certificates": "certificates.html",
    "Certificates": "certificates.html",
    "/extras": "extras.html",
    "Extras": "extras.html",
    "/resume": "assets/Deniz%20K.%20Acikbas.pdf",
    "Resume": "assets/Deniz%20K.%20Acikbas.pdf",
    "/contact": "contact.html",
    "Contact": "contact.html",
}


def attr(tag: str, name: str) -> str:
    match = re.search(rf'{name}="([^"]*)"', tag, re.I)
    return match.group(1) if match else ""


def map_href(href: str) -> str:
    if href in ROUTES:
        return ROUTES[href]
    if href.startswith("/"):
        return ROUTES.get(href, href.lstrip("/") + ".html")
    return href


def map_asset(src: str) -> str:
    asset_dirs = ("certificates/", "drawings/", "experience/", "index-slides/", "languages/", "projects/", "visits/")
    if src.startswith(asset_dirs):
        return f"assets/{src}"
    return src


def title_from(raw: str, fallback: str) -> str:
    match = re.search(r"<PageTitle>(.*?)</PageTitle>", raw, re.S)
    return re.sub(r"\s+", " ", match.group(1)).strip() if match else fallback


def remove_code_blocks(raw: str) -> str:
    raw = re.sub(r"^\ufeff", "", raw)
    raw = re.sub(r"@page\s+\"[^\"]+\"\s*", "", raw)
    raw = re.sub(r"@inject[^\n]*\n", "", raw)
    raw = re.sub(r"<PageTitle>.*?</PageTitle>", "", raw, flags=re.S)
    raw = re.sub(r"@code\s*\{[\s\S]*?\}\s*$", "", raw)
    return raw


def tag_to_img(tag: str, avatar: bool = False) -> str:
    src = map_asset(attr(tag, "Src") or attr(tag, "Image"))
    alt = attr(tag, "Alt") or "Portfolio image"
    width = attr(tag, "Width")
    height = attr(tag, "Height")
    classes = "avatar" if avatar else "content-image"
    style = []
    if width:
        style.append(f"max-width:{escape(width)}px")
    if height:
        style.append(f"max-height:{escape(height)}px")
    style_attr = f' style="{";".join(style)}"' if style else ""
    return f'<img class="{classes}" src="{escape(src)}" alt="{escape(alt)}"{style_attr}>'


def replace_buttons(text: str) -> str:
    def self_repl(match: re.Match) -> str:
        tag = match.group(1)
        href = map_href(attr(tag, "Href") or "#")
        label = "Open"
        if "Contact" in href or href == "contact.html":
            label = "Contact"
        elif href.startswith("mailto:") and "Rejection" in href:
            label = "Rejection Email"
        elif href.startswith("mailto:"):
            label = "Interview Email"
        return f'<a class="action" href="{escape(href)}">{escape(label)}</a>'

    def repl(match: re.Match) -> str:
        tag = match.group(1)
        body = match.group(2).strip()
        href = map_href(attr(tag, "Href") or "#")
        return f'<a class="action" href="{escape(href)}">{body}</a>'

    text = re.sub(r"<Mud(?:Button|Fab)\b([^>]*)/>", self_repl, text, flags=re.S)
    return re.sub(r"<Mud(?:Button|Fab)\b([^>]*)>(.*?)</Mud(?:Button|Fab)>", repl, text, flags=re.S)


def replace_navlinks(text: str) -> str:
    def repl(match: re.Match) -> str:
        tag = match.group(1)
        body = match.group(2).strip()
        href = map_href(attr(tag, "Href") or "#")
        return f'<a class="nav-card-link" href="{escape(href)}">{body}</a>'

    return re.sub(r"<MudNavLink\b([^>]*)>(.*?)</MudNavLink>", repl, text, flags=re.S)


def replace_chips(text: str) -> str:
    def repl(match: re.Match) -> str:
        tag = match.group(1)
        body = match.group(2).strip()
        href = attr(tag, "Href")
        if href:
            return f'<a class="chip" href="{escape(map_href(href))}">{body}</a>'
        return f'<span class="chip">{body}</span>'

    return re.sub(r"<MudChip\b([^>]*)>(.*?)</MudChip>", repl, text, flags=re.S)


def replace_panels(text: str) -> str:
    def repl(match: re.Match) -> str:
        label = attr(match.group(1), "Text") or "Details"
        return f'<details class="expansion" open><summary>{escape(label)}</summary>'

    text = re.sub(r"<MudExpansionPanel\b([^>]*)>", repl, text)
    return text.replace("</MudExpansionPanel>", "</details>")


def replace_menu_items(text: str) -> str:
    def repl(match: re.Match) -> str:
        href = map_href(attr(match.group(1), "Href") or "#")
        return f'<a class="menu-item" href="{escape(href)}">'

    text = re.sub(r"<MudMenuItem\b([^>]*)>", repl, text)
    return text.replace("</MudMenuItem>", "</a>")


def replace_images(text: str) -> str:
    text = re.sub(r"<MudImage\b([^>]*)/>", lambda m: tag_to_img(m.group(0)), text, flags=re.S)
    text = re.sub(r"<MudAvatar\b([^>]*)/>", lambda m: tag_to_img(m.group(0), True), text, flags=re.S)
    return text


def convert_components(text: str) -> str:
    replacements = [
        (r"<MudPaper\b[^>]*>", '<section class="paper">'),
        (r"</MudPaper>", "</section>"),
        (r"<MudCard\b[^>]*>", '<article class="card">'),
        (r"</MudCard>", "</article>"),
        (r"<MudCardHeader\b[^>]*>", '<div class="card-header">'),
        (r"</MudCardHeader>", "</div>"),
        (r"<CardHeaderContent\b[^>]*>", '<div class="card-header-content">'),
        (r"</CardHeaderContent>", "</div>"),
        (r"<MudStack\b[^>]*>", '<div class="stack">'),
        (r"</MudStack>", "</div>"),
        (r"<MudText\b[^>]*>", '<div class="text">'),
        (r"</MudText>", "</div>"),
        (r"<MudCarousel\b[^>]*>", '<div class="carousel">'),
        (r"</MudCarousel>", "</div>"),
        (r"<MudCarouselItem\b[^>]*>", '<div class="carousel-slide">'),
        (r"</MudCarouselItem>", "</div>"),
        (r"<MudExpansionPanels\b[^>]*>", '<div class="expansion-list">'),
        (r"</MudExpansionPanels>", "</div>"),
        (r"<MudTimeline\b[^>]*>", '<div class="timeline">'),
        (r"</MudTimeline>", "</div>"),
        (r"<MudTimelineItem\b[^>]*>", '<div class="timeline-item">'),
        (r"</MudTimelineItem>", "</div>"),
        (r"<ItemOpposite\b[^>]*>", '<div class="timeline-date">'),
        (r"</ItemOpposite>", "</div>"),
        (r"<ItemContent\b[^>]*>", '<div class="timeline-content">'),
        (r"</ItemContent>", "</div>"),
        (r"<MudMenu\b[^>]*>", '<div class="menu-block">'),
        (r"</MudMenu>", "</div>"),
        (r"<MudNavMenu\b[^>]*>", '<nav class="link-list">'),
        (r"</MudNavMenu>", "</nav>"),
        (r"<MudDivider\s*/>", "<hr>"),
        (r"<MudIcon\b[^>]*/>", '<span class="icon-dot"></span>'),
    ]
    for pattern, replacement in replacements:
        text = re.sub(pattern, replacement, text)
    text = re.sub(r"<MudNavGroup\b[^>]*>", '<div class="nav-group">', text)
    text = text.replace("</MudNavGroup>", "</div>")
    return text


def clean_razor(text: str) -> str:
    text = re.sub(r'@\(\$"[^"]*"\)', "", text)
    text = re.sub(r"\s(?:Class|Typo|Color|Icon|IconColor|Variant|StartIcon|Elevation|Size|Spacing|Justify|GutterBottom|Label|Match|Expanded|AutoCycle|ShowArrows|ShowBullets|TData|Transition|MaxHeight|Row|Style)=\"[^\"]*\"", "", text)
    text = re.sub(r"\s(?:Class|Typo|Color|Icon|IconColor|Variant|StartIcon|Elevation|Size|Spacing|Justify|GutterBottom|Label|Match|Expanded|AutoCycle|ShowArrows|ShowBullets|TData|Transition|MaxHeight|Row|Style)=\S+", "", text)
    text = re.sub(r"<MudButton\b([^>]*)>", lambda m: f'<a class="action" href="{escape(map_href(attr(m.group(0), "Href") or "#"))}">', text, flags=re.S)
    text = text.replace("</MudButton>", "</a>")
    return text


def convert(raw: str) -> str:
    text = remove_code_blocks(raw)
    text = replace_images(text)
    text = replace_buttons(text)
    text = replace_navlinks(text)
    text = replace_chips(text)
    text = replace_panels(text)
    text = replace_menu_items(text)
    text = convert_components(text)
    text = clean_razor(text)
    text = text.replace(
        "Submitted four papers to sensing and AI conferences.",
        "Published four peer-reviewed papers in sensing and AI venues.",
    )
    text = text.replace(
        "Served as a reviewer for a paper submitted to the ICNC conference.",
        "Served as a reviewer for an ICNC conference paper.",
    )
    text = text.replace(
        "Served as a reviewer for an ICNC conference paper.",
        "Served as a reviewer for an ICNC conference paper.</li><li>Reviewed one journal paper for TMC.",
    )
    text = text.replace(
        "Submitted one journal article and one survey, both of which received revisions.",
        "Published one peer-reviewed journal article and one published survey.",
    )
    text = text.replace(
        "Received acceptance for RoFin Journal Paper.",
        "Published the RoFin journal paper.",
    )
    text = text.replace(
        "Master of Science in Software Engineering",
        "PhD in Computer Science",
    )
    text = text.replace(
        "Expected to graduate in April 2027",
        "Expected to graduate in April 2030",
    )
    text = text.replace(
        "<strong>Expected Graduation:</strong> April 2027",
        "<strong>Expected Graduation:</strong> April 2030",
    )
    text = text.replace(
        '<span class="ml-1">April 2027</span>',
        '<span class="ml-1">April 2030</span>',
    )
    text = text.replace(
        '<span class="ml-1">15 / 30 Credits</span>',
        '<span class="ml-1">21 Credits</span>',
    )
    text = text.replace(
        "CIS 5570 – Introduction to Big Data (3 Credits)",
        "CIS 541 - Immersive Computing and Digital Twins (3 Credit Hours)</a><a class=\"chip\" href=\"http://catalog.umd.umich.edu/graduate/coursesaz/cis/\">CIS 579 - Introduction to Artificial Intelligence (3 Credits)</a><a class=\"chip\" href=\"http://catalog.umd.umich.edu/graduate/coursesaz/ece/\">ECE 574 - Advanced Software Technique in Engineering Application (3 Credits)",
    )
    text = text.replace(
        "CIS 5570 – Introduction to Big Data",
        "CIS 541 - Immersive Computing and Digital Twins</a><a class=\"chip\" href=\"http://catalog.umd.umich.edu/graduate/coursesaz/cis/\">CIS 579 - Introduction to Artificial Intelligence</a><a class=\"chip\" href=\"http://catalog.umd.umich.edu/graduate/coursesaz/ece/\">ECE 574 - Advanced Software Technique in Engineering Application",
    )
    text = text.replace("Counted - 15 Credits", "Counted - 21 Credits")
    text = re.sub(r"\n\s*\n\s*\n+", "\n\n", text)
    return text.strip()


def shell(title: str, body_class: str, content: str) -> str:
    nav = "\n".join(f'<a href="{escape(href)}">{escape(label)}</a>' for label, href in NAV)
    return f"""<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{escape(title)}</title>
    <link rel="stylesheet" href="styles.css">
    <script src="script.js" defer></script>
  </head>
  <body data-page="{escape(body_class)}">
    <canvas id="signal-canvas" aria-hidden="true"></canvas>
    <div class="scanline" aria-hidden="true"></div>
    <header class="site-header">
      <a class="brand" href="index.html"><span class="brand-mark">X27</span><span class="brand-text">Deniz Acikbas</span></a>
      <button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="site-nav" aria-label="Main navigation">
        {nav}
      </nav>
    </header>
    <main class="reference-main">
      {content}
    </main>
  </body>
</html>
"""


def copy_assets() -> None:
    (OUT / "assets").mkdir(exist_ok=True)
    for name in ["index-slides", "visits", "drawings", "certificates", "projects", "experience", "languages"]:
        src = ROOT / "wwwroot" / name
        dst = OUT / "assets" / name
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        for file in dst.iterdir():
            if file.is_file() and any(ch.isupper() for ch in file.suffix):
                lower = file.with_suffix(file.suffix.lower())
                if lower != file and not lower.exists():
                    shutil.copy2(file, lower)
    for name in ["favicon.ico"]:
        src = ROOT / "wwwroot" / name
        if src.exists():
            shutil.copy2(src, OUT / name)


def main() -> None:
    copy_assets()
    for file_name, source in PAGES.items():
        raw = source.read_text(encoding="utf-8-sig")
        title = title_from(raw, "X27")
        content = convert(raw)
        (OUT / file_name).write_text(shell(title, file_name.replace(".html", ""), content), encoding="utf-8")


if __name__ == "__main__":
    main()
