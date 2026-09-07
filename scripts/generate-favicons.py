#!/usr/bin/env python3
"""Regenerate Lottery Assets favicons from public/emblem-source.png (or --src).

The current mark is a finished navy-tile icon (gold lottery drum + rising
arrow). Generation tight-crops the artwork, recenters it on a square of the
source background, and LANCZOS-downsamples so 16–64px tabs still read.
"""

from __future__ import annotations

import argparse
import struct
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter


NAVY = (1, 11, 31, 255)


def content_mask(arr: np.ndarray) -> np.ndarray:
    """Pixels that belong to the mark, not the designed background."""
    alpha = arr[:, :, 3]
    if (alpha < 8).mean() > 0.05:
        return alpha > 8
    corners = np.concatenate(
        [
            arr[:16, :16, :3].reshape(-1, 3),
            arr[:16, -16:, :3].reshape(-1, 3),
            arr[-16:, :16, :3].reshape(-1, 3),
            arr[-16:, -16:, :3].reshape(-1, 3),
        ]
    )
    bg = np.median(corners, axis=0).astype(np.float32)
    dist = np.linalg.norm(arr[:, :, :3].astype(np.float32) - bg, axis=2)
    return dist > 16


def background_rgba(arr: np.ndarray) -> tuple[int, int, int, int]:
    alpha = arr[:, :, 3]
    if (alpha < 8).mean() > 0.05:
        return (0, 0, 0, 0)
    corners = np.concatenate(
        [
            arr[:16, :16, :3].reshape(-1, 3),
            arr[:16, -16:, :3].reshape(-1, 3),
            arr[-16:, :16, :3].reshape(-1, 3),
            arr[-16:, -16:, :3].reshape(-1, 3),
        ]
    )
    bg = np.median(corners, axis=0)
    return (int(bg[0]), int(bg[1]), int(bg[2]), 255)


def prepare_canvas(src: Image.Image, scale_up: float = 1.04, pad_ratio: float = 0.10) -> Image.Image:
    arr = np.array(src.convert("RGBA"))
    mask = content_mask(arr)
    ys, xs = np.where(mask)
    if len(ys) == 0:
        return src.convert("RGBA")
    y0, y1, x0, x1 = int(ys.min()), int(ys.max()), int(xs.min()), int(xs.max())
    crop = src.convert("RGBA").crop((x0, y0, x1 + 1, y1 + 1))
    cw, ch = crop.size
    crop = crop.resize((max(1, int(cw * scale_up)), max(1, int(ch * scale_up))), Image.LANCZOS)
    cw, ch = crop.size
    pad = max(12, int(round(max(cw, ch) * pad_ratio)))
    side = max(cw, ch) + pad * 2
    canvas = Image.new("RGBA", (side, side), background_rgba(arr))
    canvas.paste(crop, ((side - cw) // 2, (side - ch) // 2), crop)
    return canvas


def render(canvas: Image.Image, size: int) -> Image.Image:
    out = canvas.resize((size, size), Image.LANCZOS)
    if size <= 64:
        r, g, b, a = out.split()
        rgb = Image.merge("RGB", (r, g, b))
        rgb = ImageEnhance.Contrast(rgb).enhance(1.12)
        rgb = ImageEnhance.Color(rgb).enhance(1.10)
        rgb = ImageEnhance.Brightness(rgb).enhance(1.04)
        out = rgb.convert("RGBA")
        out.putalpha(a)
        out = out.filter(ImageFilter.UnsharpMask(radius=0.55, percent=130, threshold=1))
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
    ap.add_argument("--src", type=Path, default=Path("public/emblem-source.png"))
    ap.add_argument("--out-dir", type=Path, default=Path("public"))
    args = ap.parse_args()

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
