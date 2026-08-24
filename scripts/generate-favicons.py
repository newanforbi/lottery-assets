#!/usr/bin/env python3
"""Regenerate Lottery Assets favicons from public/icon-512.png (or --src).

Improves small-size visibility: tighter crop, gold-ring thicken, dual rim
(pale gold for dark chrome + near-black for light tabs), mild contrast boost.
"""

from __future__ import annotations

import argparse
import struct
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
from scipy import ndimage


def dual_rim(im: Image.Image, dark_r: int, light_r: int) -> Image.Image:
    a = np.array(im.split()[-1])
    opaque = a > 20
    light = ndimage.binary_dilation(opaque, iterations=light_r) & ~opaque
    dark = ndimage.binary_dilation(opaque | light, iterations=dark_r) & ~(opaque | light)
    out = np.array(im)
    out[light] = (252, 228, 168, 255)
    out[dark] = (8, 8, 10, 255)
    return Image.fromarray(out)


def thicken_gold(im: Image.Image, iterations: int) -> Image.Image:
    arr = np.array(im)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    gold = (a > 180) & (r > 135) & (g > 90) & (b < 145) & (r >= g - 5)
    dil = ndimage.binary_dilation(gold, iterations=iterations)
    lum = r.astype(np.float32) * 0.2126 + g.astype(np.float32) * 0.7152 + b.astype(np.float32) * 0.0722
    target = dil & (a > 160) & ~gold & (lum < 100)
    if gold.any():
        color = arr[gold].mean(axis=0).astype(np.float32)
        color[:3] = np.clip(color[:3] * 1.08 + 8, 0, 255)
        arr[target] = color.astype(np.uint8)
    return Image.fromarray(arr)


def boost_small(im: Image.Image) -> Image.Image:
    r, g, b, a = im.split()
    rgb = Image.merge("RGB", (r, g, b))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.22)
    rgb = ImageEnhance.Color(rgb).enhance(1.28)
    rgb = ImageEnhance.Brightness(rgb).enhance(1.10)
    out = rgb.convert("RGBA")
    out.putalpha(a)
    return out


def prepare_canvas(src: Image.Image, scale_up: float = 1.06, pad: int = 28) -> Image.Image:
    arr = np.array(src)
    ys, xs = np.where(arr[:, :, 3] > 8)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    crop = src.crop((x0, y0, x1 + 1, y1 + 1))
    cw, ch = crop.size
    crop = crop.resize((int(cw * scale_up), int(ch * scale_up)), Image.LANCZOS)
    cw, ch = crop.size
    side = max(cw, ch) + pad * 2
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(crop, ((side - cw) // 2, (side - ch) // 2), crop)
    return canvas


def render(canvas: Image.Image, size: int) -> Image.Image:
    side = canvas.size[0]
    im = thicken_gold(canvas.copy(), 4 if size <= 64 else 2)
    px = side / size
    light_r = max(2, int(round(1.15 * px)))
    dark_r = max(2, int(round(0.95 * px)))
    im = dual_rim(im, dark_r=dark_r, light_r=light_r)
    out = im.resize((size, size), Image.LANCZOS)
    if size <= 64:
        out = boost_small(out)
        out = out.filter(ImageFilter.UnsharpMask(radius=0.55, percent=140, threshold=1))
    return out


def write_ico(path: Path, frames: dict[int, Image.Image]) -> None:
    order = sorted(frames)
    entries, blobs = [], []
    for sz in order:
        im = frames[sz]
        w, h = im.size
        r, g, b, a = [list(ch.get_flattened_data()) for ch in im.split()]
        xor = bytearray()
        for y in range(h - 1, -1, -1):
            for x in range(w):
                i = y * w + x
                xor += bytes([b[i], g[i], r[i], a[i]])
        row_and = ((w + 31) // 32) * 4
        and_mask = bytearray()
        for y in range(h - 1, -1, -1):
            bits, byte, bitcount = [], 0, 0
            for x in range(w):
                i = y * w + x
                byte = (byte << 1) | (1 if a[i] < 128 else 0)
                bitcount += 1
                if bitcount == 8:
                    bits.append(byte)
                    byte, bitcount = 0, 0
            if bitcount:
                bits.append(byte << (8 - bitcount))
            row = bytearray(bits)
            row.extend(b"\x00" * (row_and - len(row)))
            and_mask += row
        header = struct.pack(
            "<IIIHHIIIIII",
            40, w, h * 2, 1, 32, 0, len(xor) + len(and_mask), 0, 0, 0, 0,
        )
        data = header + xor + and_mask
        wb = 0 if w >= 256 else w
        hb = 0 if h >= 256 else h
        entries.append(struct.pack("<BBBBHHII", wb, hb, 0, 0, 1, 32, len(data), 0))
        blobs.append(data)

    count = len(entries)
    offset = 6 + 16 * count
    out = bytearray(struct.pack("<HHH", 0, 1, count))
    for entry, blob in zip(entries, blobs):
        out += entry[:-4] + struct.pack("<I", offset)
        offset += len(blob)
    for blob in blobs:
        out += blob
    path.write_bytes(out)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", type=Path, default=Path("public/icon-512.png"))
    ap.add_argument("--out-dir", type=Path, default=Path("public"))
    args = ap.parse_args()

    # Prefer regenerating from a pre-rim master if present; otherwise use current 512.
    src = Image.open(args.src).convert("RGBA")
    canvas = prepare_canvas(src)

    favicon32 = render(canvas, 32)
    frames = {
        16: render(canvas, 16),
        32: favicon32,
        48: render(canvas, 48),
        64: render(canvas, 64),
    }
    apple = render(canvas, 180)
    icon192 = render(canvas, 192)
    icon512 = render(canvas, 512)

    out = args.out_dir
    favicon32.save(out / "favicon-32.png", optimize=True)
    apple.save(out / "apple-touch-icon.png", optimize=True)
    icon192.save(out / "icon-192.png", optimize=True)
    icon512.save(out / "icon-512.png", optimize=True)
    write_ico(out / "favicon.ico", frames)
    print(f"wrote favicons to {out}")


if __name__ == "__main__":
    main()
