#!/usr/bin/env python3
"""
Brother's Bites — Standalone Python QR Code Vector SVG & Print Generator
Generates clean vector SVG and print assets without external dependencies using standard SVG specifications.
"""

import os
import urllib.parse
import urllib.request
import json

TARGETS = [
    {
        "id": "connect",
        "name": "Brother's Bites Connect & Social Hub",
        "url": "https://bbites.salahuddin.codes/connect",
    },
    {
        "id": "menu",
        "name": "Brother's Bites Digital Food Menu",
        "url": "https://bbites.salahuddin.codes/menu",
    },
    {
        "id": "review",
        "name": "Brother's Bites Google Maps 5-Star Review",
        "url": "https://g.page/r/CZY9cCNvq2_GEAE/review",
    },
    {
        "id": "location",
        "name": "Brother's Bites Marine Drive GPS Map",
        "url": "https://maps.app.goo.gl/Xni3a5YXNXsCe5zz5",
    },
    {
        "id": "website",
        "name": "Brother's Bites Official Website",
        "url": "https://bbites.salahuddin.codes",
    },
]

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "client", "public", "qr-codes")

def generate_qr_assets():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"📁 Target Output Directory: {OUTPUT_DIR}\n")

    for item in TARGETS:
        item_id = item["id"]
        encoded_url = urllib.parse.quote(item["url"])

        # 1. Dark Luxury SVG (Gold on Dark)
        dark_svg_api = f"https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=svg&data={encoded_url}&color=fbbf24&bgcolor=0a0a0c&margin=2&qzone=1"
        dark_svg_path = os.path.join(OUTPUT_DIR, f"{item_id}-qr-dark.svg")
        try:
            req = urllib.request.Request(dark_svg_api, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(dark_svg_path, 'wb') as f:
                f.write(response.read())
            print(f"  [+] Saved Vector SVG (Dark Gold): {item_id}-qr-dark.svg")
        except Exception as e:
            print(f"  [!] SVG Dark failed for {item_id}: {e}")

        # 2. Print Black & White SVG (Pure Vector for Printing Banners & Table Stands)
        print_svg_api = f"https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=svg&data={encoded_url}&color=000000&bgcolor=ffffff&margin=2&qzone=1"
        print_svg_path = os.path.join(OUTPUT_DIR, f"{item_id}-qr-print.svg")
        try:
            req = urllib.request.Request(print_svg_api, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(print_svg_path, 'wb') as f:
                f.write(response.read())
            print(f"  [+] Saved Vector SVG (Print Black/White): {item_id}-qr-print.svg")
        except Exception as e:
            print(f"  [!] SVG Print failed for {item_id}: {e}")

        # 3. High-Res PNG (2000x2000px, 300+ DPI for Print)
        print_png_api = f"https://api.qrserver.com/v1/create-qr-code/?size=2000x2000&format=png&data={encoded_url}&color=000000&bgcolor=ffffff&margin=2&qzone=1"
        print_png_path = os.path.join(OUTPUT_DIR, f"{item_id}-qr-print.png")
        try:
            req = urllib.request.Request(print_png_api, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(print_png_path, 'wb') as f:
                f.write(response.read())
            print(f"  [+] Saved High-Res Print PNG (2000x2000): {item_id}-qr-print.png")
        except Exception as e:
            print(f"  [!] PNG Print failed for {item_id}: {e}")

        # 4. Dark Luxury PNG (2000x2000px)
        dark_png_api = f"https://api.qrserver.com/v1/create-qr-code/?size=2000x2000&format=png&data={encoded_url}&color=fbbf24&bgcolor=0a0a0c&margin=2&qzone=1"
        dark_png_path = os.path.join(OUTPUT_DIR, f"{item_id}-qr-dark.png")
        try:
            req = urllib.request.Request(dark_png_api, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(dark_png_path, 'wb') as f:
                f.write(response.read())
            print(f"  [+] Saved Dark High-Res PNG (2000x2000): {item_id}-qr-dark.png")
        except Exception as e:
            print(f"  [!] PNG Dark failed for {item_id}: {e}")

        print(f"✅ Finished: {item['name']}\n")

    print(f"🎉 Complete! All raw vector SVGs and 2K PNGs are ready in: {OUTPUT_DIR}")

if __name__ == "__main__":
    generate_qr_assets()
