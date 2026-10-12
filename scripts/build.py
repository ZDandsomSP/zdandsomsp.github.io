#!/usr/bin/env python3
"""Generate the static homepage with Python's standard library; no installs needed."""
import argparse
import html
import json
from pathlib import Path
from string import Template

ROOT = Path(__file__).resolve().parents[1]


def escape(value):
    return html.escape(str(value), quote=True)


def bibtex(paper):
    published = paper["badge"] != "arXiv"
    kind = "inproceedings" if published else "article"
    fields = {
        "title": paper["title"],
        "author": " and ".join(paper["authors"]),
        "booktitle" if published else "journal": paper["venue"],
        "year": str(paper["year"]),
        "eprint": paper["arxiv"],
        "archivePrefix": "arXiv",
        "url": f'https://arxiv.org/abs/{paper["arxiv"]}',
    }
    return "@" + kind + "{" + paper["id"].replace("-", "") + str(paper["year"]) + ",\n" + ",\n".join(
        f"  {key} = {{{value}}}" for key, value in fields.items()
    ) + "\n}"


def publication(paper, name):
    authors = []
    for author in paper["authors"]:
        text = escape(author)
        if author == name:
            text = f"<strong>{text}</strong>"
        if author in paper.get("equal_contribution", []):
            text += "*"
        authors.append(text)
    links = {"arXiv": f'https://arxiv.org/abs/{paper["arxiv"]}',
             "PDF": f'https://arxiv.org/pdf/{paper["arxiv"]}', **paper["links"]}
    link_html = "\n".join(f'<a class="paper-link" href="{escape(url)}">{escape(label)}</a>' for label, url in links.items())
    note = f'<span class="paper-note">{escape(paper["note"])}</span>' if paper.get("note") else ""
    badge_class = " preprint" if paper["badge"] == "arXiv" else ""
    image_class = escape(paper.get("image_class", ""))
    image_alt = escape(paper.get("image_alt", paper["title"].split(":")[0] + " overview figure"))
    return f'''<li class="publication" id="{escape(paper['id'])}">
  <a class="paper-visual" href="{escape(links['arXiv'])}" aria-label="Read {escape(paper['title'])}">
    <img class="{image_class}" src="{escape(paper['image'])}" alt="{image_alt}" loading="lazy">
    <span class="venue-badge{badge_class}">{escape(paper['badge'])} {paper['year']}</span>
  </a>
  <div class="paper-info">
    <h4 class="paper-title"><a href="{escape(links['arXiv'])}">{escape(paper['title'])}</a></h4>
    <p class="paper-authors">{', '.join(authors)}</p>
    <p class="paper-venue">{escape(paper['venue'])}, {paper['year']}.{note}</p>
    <p class="paper-summary">{escape(paper['summary'])}</p>
    <div class="paper-links">{link_html}</div>
    <details class="bibtex"><summary aria-label="BibTeX citation for {escape(paper['title'].split(':')[0])}">BibTeX</summary><pre>{escape(bibtex(paper))}</pre></details>
  </div>
</li>'''


def piano_keys():
    octaves = []
    white_notes = [("C", 0), ("D", 2), ("E", 4), ("F", 5), ("G", 7), ("A", 9), ("B", 11)]
    black_notes = [("C♯", 1, 1), ("D♯", 3, 2), ("F♯", 6, 4), ("G♯", 8, 5), ("A♯", 10, 6)]
    for octave in range(2, 7):
        keys = []
        for name, offset in white_notes:
            note = f"{name}{octave}"
            keys.append(f'<button type="button" class="piano-key piano-key-white" data-midi="{12 * (octave + 1) + offset}" data-note="{note}" aria-label="Play {note}" disabled></button>')
        for name, offset, boundary in black_notes:
            note = f"{name}{octave}"
            keys.append(f'<button type="button" class="piano-key piano-key-black" style="--boundary: {boundary}" data-midi="{12 * (octave + 1) + offset}" data-note="{note}" aria-label="Play {note}" disabled></button>')
        octaves.append(f'<div class="piano-octave" data-octave="{octave}">' + "\n".join(keys) + '</div>')
    return "\n".join(octaves)


def build(selected=True):
    profile = json.loads((ROOT / "data/profile.json").read_text())
    papers = json.loads((ROOT / "data/publications.json").read_text())
    if len({p["id"] for p in papers}) != len(papers):
        raise ValueError("Publication IDs must be unique")
    for asset in [profile["portrait"], profile["portrait_hover"], *(p["image"] for p in papers),
                  "assets/audio/piano/salamander-samples.js", "assets/audio/piano/CREDITS.txt"]:
        if not (ROOT / asset).is_file():
            raise FileNotFoundError(asset)
    if selected:
        papers = sorted((p for p in papers if p.get("selected")), key=lambda p: p["selected_order"])
    groups = []
    if selected:
        items = "\n".join(publication(p, profile["name"]) for p in papers)
        groups.append(f'<ol class="bibliography">{items}</ol>')
    else:
        for year in sorted({p["year"] for p in papers}, reverse=True):
            items = "\n".join(publication(p, profile["name"]) for p in papers if p["year"] == year)
            groups.append(f'<h3 class="year-heading">{year}</h3><ol class="bibliography">{items}</ol>')
    values = {key: escape(value) for key, value in profile.items()}
    values["display_email"] = escape(profile["email"].replace("@", " (at) "))
    values["piano_keys"] = piano_keys()
    values["publications"] = "\n".join(groups)
    values["publication_heading"] = "Selected Publications &amp; Preprints" if selected else "All Publications &amp; Preprints"
    values["publication_toggle_url"] = "publications.html#publications" if selected else "index.html#publications"
    values["publication_toggle_label"] = "All" if selected else "Selected"
    return Template((ROOT / "templates/index.html").read_text()).substitute(values)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify index.html is current without writing")
    args = parser.parse_args()
    for filename, selected in [("index.html", True), ("publications.html", False)]:
        output = build(selected=selected)
        target = ROOT / filename
        if args.check:
            if not target.exists() or target.read_text() != output:
                raise SystemExit(f"{filename} is out of date; run python3 scripts/build.py")
        else:
            target.write_text(output)
            print(f"Built {target}")
    if args.check:
        print("Selected and all-publications pages are current; publication IDs and images are valid.")


if __name__ == "__main__":
    main()
