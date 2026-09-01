#!/usr/bin/env python3
"""Generate OG social card and portfolio preview thumbnail."""

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (11, 17, 32)
ACCENT = (56, 139, 212)
TEXT = (226, 232, 240)
MUTED = (148, 163, 184)


def load_font(size, bold=False):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for path in paths:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_og_image(path):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # Accent bar
    draw.rectangle([0, 0, W, 6], fill=ACCENT)

    # Soft glow
    for i in range(120, 0, -4):
        alpha = int(18 * (i / 120))
        draw.ellipse([820 - i, 80 - i // 2, 1120 + i, 380 + i // 2], fill=(56, 139, 212, alpha) if hasattr(ImageDraw, "ellipse") else None)
    draw.ellipse([900, 120, 1150, 340], outline=(56, 139, 212, 40))

    title_font = load_font(54, bold=True)
    sub_font = load_font(28)
    tag_font = load_font(22)
    mono_font = load_font(18)

    draw.text((72, 180), "Phidel Emmanuel Ochieng", font=title_font, fill=TEXT)
    draw.text((72, 260), "Frontend Developer", font=sub_font, fill=ACCENT)
    draw.text((72, 320), "Accessible, performance-focused web apps", font=tag_font, fill=MUTED)
    draw.text((72, 370), "Security-aware development · Responsive UI · Embu, Kenya", font=mono_font, fill=MUTED)
    draw.rectangle([72, 430, 340, 478], outline=ACCENT, width=2)
    draw.text((92, 442), "Open to junior frontend roles", font=mono_font, fill=TEXT)

    img.save(path, "PNG", optimize=True)
    print(f"Wrote {path}")


def draw_portfolio_preview(path):
    img = Image.new("RGB", (960, 600), (15, 23, 42))
    draw = ImageDraw.Draw(img)

    # Browser chrome
    draw.rectangle([0, 0, 960, 44], fill=(30, 41, 59))
    for x, c in [(20, (239, 68, 68)), (44, (250, 204, 21)), (68, (52, 211, 153))]:
        draw.ellipse([x, 14, x + 16, 30], fill=c)
    draw.rectangle([120, 12, 840, 32], fill=(51, 65, 85))
    draw.text((130, 16), "tariq926.github.io/my-portfolio", fill=MUTED, font=load_font(14))

    # Hero block
    draw.rectangle([0, 44, 960, 280], fill=(11, 17, 32))
    draw.text((48, 90), "Phidel Emmanuel Ochieng", fill=TEXT, font=load_font(34, bold=True))
    draw.text((48, 140), "Frontend Developer & Cybersecurity Enthusiast", fill=ACCENT, font=load_font(18))
    draw.rectangle([48, 190, 210, 228], fill=ACCENT)
    draw.rectangle([230, 190, 390, 228], outline=ACCENT, width=2)

    # Cards row
    for i, x in enumerate([48, 340, 632]):
        draw.rounded_rectangle([x, 300, x + 280, 520], radius=14, fill=(17, 26, 46), outline=(56, 139, 212, 80))
        draw.rectangle([x + 20, 330, x + 120, 350], fill=ACCENT)
        draw.rectangle([x + 20, 370, x + 240, 390], fill=(51, 65, 85))
        draw.rectangle([x + 20, 410, x + 200, 430], fill=(51, 65, 85))

    img.save(path, "PNG", optimize=True)
    print(f"Wrote {path}")


if __name__ == "__main__":
    draw_og_image("/workspace/og-image.png")
    draw_portfolio_preview("/workspace/portfolio-preview.png")
