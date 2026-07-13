#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-manifest.py
สแกนโฟลเดอร์รูปภาพทั้งหมดใน assets/images/ แล้วสร้างไฟล์ assets/js/manifest.js
เว็บจะอ่านไฟล์นี้เพื่อแสดงรูปในแต่ละแกลเลอรีโดยอัตโนมัติ

วิธีใช้ (ทำทุกครั้งหลังเพิ่ม/ลบรูป):
    ดับเบิลคลิกไฟล์  build.bat
    หรือรันในเทอร์มินัล:  python build-manifest.py
"""
import os, json, sys

# ให้พิมพ์ภาษาไทยบน console ของ Windows ได้โดยไม่ crash
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
IMG_ROOT = os.path.join(HERE, "assets", "images")
OUT = os.path.join(HERE, "assets", "js", "manifest.js")

IMG_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif")

def natural_key(s):
    import re
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]

def scan(root):
    """คืน dict: { 'relative/key': [file1, file2, ...] }  (เรียงชื่อแบบธรรมชาติ)"""
    manifest = {}
    for dirpath, dirnames, filenames in os.walk(root):
        rel = os.path.relpath(dirpath, root).replace("\\", "/")
        if rel == ".":
            continue
        imgs = [f for f in filenames if f.lower().endswith(IMG_EXT)]
        if imgs:
            imgs.sort(key=natural_key)
            manifest[rel] = imgs
    return manifest

def main():
    if not os.path.isdir(IMG_ROOT):
        print("ไม่พบโฟลเดอร์ assets/images/"); sys.exit(1)
    manifest = scan(IMG_ROOT)
    body = json.dumps(manifest, ensure_ascii=False, indent=2)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("/* สร้างอัตโนมัติโดย build-manifest.py — ห้ามแก้ด้วยมือ */\n")
        f.write("window.SITE_MANIFEST = " + body + ";\n")

    total = sum(len(v) for v in manifest.values())
    print("=" * 56)
    print("  สร้าง manifest.js สำเร็จ")
    print("=" * 56)
    if not manifest:
        print("  (ยังไม่มีรูปภาพ — ลองวางรูปในโฟลเดอร์ assets/images/... )")
    for k in sorted(manifest, key=natural_key):
        print(f"  {k:<32} {len(manifest[k]):>3} รูป")
    print("-" * 56)
    print(f"  รวมทั้งหมด {total} รูป ใน {len(manifest)} โฟลเดอร์")
    print("=" * 56)

if __name__ == "__main__":
    main()
