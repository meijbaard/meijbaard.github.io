#!/usr/bin/env python3
"""Verklein afbeeldingen voor de site.

Twee modi:

  # alles in assets/slideshow/ terugbrengen naar max 1920px breed (in-place)
  python3 scripts/optimize-images.py --slideshow

  # uit een bronfoto een header (1500x500) en teaser (640x480) maken
  python3 scripts/optimize-images.py --header ~/Desktop/foto.png woudenberg_gemeentehuis

De header-modus schrijft assets/images/<naam>.webp en assets/images/teaser_<naam>.webp,
conform de maten die de rest van de site al gebruikt.

Vereist Pillow (staat standaard op dit systeem).
"""

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SLIDESHOW_DIR = ROOT / "assets" / "slideshow"
IMAGES_DIR = ROOT / "assets" / "images"

SLIDESHOW_MAX_WIDTH = 1920
SLIDESHOW_QUALITY = 82

HEADER_SIZE = (1500, 500)
TEASER_SIZE = (640, 480)
HEADER_QUALITY = 85

SUFFIXES = {".webp", ".jpg", ".jpeg", ".png"}


def kb(path):
    return path.stat().st_size // 1024


def crop_to_ratio(img, size):
    """Center-crop naar de verhouding van size, daarna schalen."""
    target_ratio = size[0] / size[1]
    width, height = img.size
    if width / height > target_ratio:
        new_width = round(height * target_ratio)
        left = (width - new_width) // 2
        img = img.crop((left, 0, left + new_width, height))
    else:
        new_height = round(width / target_ratio)
        top = (height - new_height) // 2
        img = img.crop((0, top, width, top + new_height))
    return img.resize(size, Image.LANCZOS)


def optimize_slideshow():
    files = sorted(p for p in SLIDESHOW_DIR.iterdir() if p.suffix.lower() in SUFFIXES)
    if not files:
        sys.exit(f"Geen afbeeldingen gevonden in {SLIDESHOW_DIR}")

    before = after = 0
    for path in files:
        before += path.stat().st_size
        with Image.open(path) as img:
            img = img.convert("RGB")
            if img.width > SLIDESHOW_MAX_WIDTH:
                height = round(img.height * SLIDESHOW_MAX_WIDTH / img.width)
                img = img.resize((SLIDESHOW_MAX_WIDTH, height), Image.LANCZOS)
            target = path.with_suffix(".webp")
            img.save(target, "WEBP", quality=SLIDESHOW_QUALITY, method=6)
        if target != path:
            path.unlink()
        after += target.stat().st_size
        print(f"  {target.name}  {img.width}x{img.height}  {kb(target)} KB")

    print(f"\nTotaal: {before // 1024} KB -> {after // 1024} KB")


def make_header(source, name):
    source = Path(source).expanduser()
    if not source.exists():
        sys.exit(f"Bronbestand bestaat niet: {source}")

    with Image.open(source) as img:
        img = img.convert("RGB")
        header = IMAGES_DIR / f"{name}.webp"
        teaser = IMAGES_DIR / f"teaser_{name}.webp"
        crop_to_ratio(img, HEADER_SIZE).save(
            header, "WEBP", quality=HEADER_QUALITY, method=6
        )
        crop_to_ratio(img, TEASER_SIZE).save(
            teaser, "WEBP", quality=HEADER_QUALITY, method=6
        )

    print(f"  {header.name}  {HEADER_SIZE[0]}x{HEADER_SIZE[1]}  {kb(header)} KB")
    print(f"  {teaser.name}  {TEASER_SIZE[0]}x{TEASER_SIZE[1]}  {kb(teaser)} KB")


def main():
    args = sys.argv[1:]
    if args[:1] == ["--slideshow"]:
        optimize_slideshow()
    elif args[:1] == ["--header"] and len(args) == 3:
        make_header(args[1], args[2])
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
