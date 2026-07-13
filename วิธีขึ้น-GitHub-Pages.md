# วิธีนำเว็บขึ้น GitHub Pages (ทีละขั้น)

## เตรียมตัว
1. สมัคร/ล็อกอิน GitHub ที่ https://github.com
2. ติดตั้ง Git ในเครื่อง (ถ้ายังไม่มี): https://git-scm.com/download/win

---

## ขั้นตอนที่ 1 — สร้าง Repository
1. ไปที่ https://github.com/new
2. ตั้งชื่อ repo เช่น `teacher-report` (ตั้งชื่อเป็นภาษาอังกฤษเท่านั้น)
3. เลือก **Public**
4. กด **Create repository**

---

## ขั้นตอนที่ 2 — อัปโหลดไฟล์

### วิธี A: ลากไฟล์ผ่านเว็บ (ง่ายสุด ไม่ต้องใช้คำสั่ง)
1. ในหน้า repo ที่เพิ่งสร้าง กด **"uploading an existing file"**
2. เปิดโฟลเดอร์ `web` ในเครื่อง แล้ว **เลือกไฟล์ทั้งหมดข้างใน** (รวมโฟลเดอร์ `assets`) ลากไปวาง
3. กด **Commit changes**

> ⚠️ ต้องอัปเนื้อหา *ข้างใน* โฟลเดอร์ `web` (ให้ `index.html` อยู่ที่ราก repo)
> ไม่ใช่อัปโฟลเดอร์ `web` ทั้งอัน

### วิธี B: ใช้ Git (สำหรับคนถนัดคำสั่ง)
เปิด Terminal ที่โฟลเดอร์ `web` แล้วพิมพ์ (แทน `USERNAME` และชื่อ repo ให้ตรงของคุณ):
```
git init
git add .
git commit -m "เว็บรายงานครูผู้ช่วย"
git branch -M main
git remote add origin https://github.com/USERNAME/teacher-report.git
git push -u origin main
```

---

## ขั้นตอนที่ 3 — เปิด GitHub Pages
1. ในหน้า repo กด **Settings**
2. เมนูซ้าย เลือก **Pages**
3. หัวข้อ **Source** เลือก **Deploy from a branch**
4. **Branch** เลือก `main` โฟลเดอร์ `/ (root)` แล้วกด **Save**
5. รอ 1–2 นาที เว็บจะพร้อมใช้งานที่:
   ```
   https://USERNAME.github.io/teacher-report/
   ```

---

## อัปเดตเว็บภายหลัง (เพิ่มรูป/แก้ข้อความ)
1. เพิ่มรูปในโฟลเดอร์ที่ถูกต้อง
2. ดับเบิลคลิก **`build.bat`** เพื่อสร้างรายการรูปใหม่
3. อัปโหลดไฟล์ที่เปลี่ยนขึ้น GitHub อีกครั้ง (ลากวางทับ หรือ `git add . && git commit -m "update" && git push`)

---

## 💡 ข้อควรรู้
- **อย่าลืมกด `build.bat` ทุกครั้งหลังเพิ่ม/ลบรูป** ไม่งั้นรูปใหม่จะไม่ขึ้น
- ไฟล์วิดีโอ `.mp4` ขนาดใหญ่ **ไม่ควรอัปขึ้น GitHub** (จำกัด 100MB/ไฟล์) — ใช้ YouTube แทน
- ถ้าเว็บขึ้นแต่รูปไม่โชว์ ให้เช็คว่าอัปโฟลเดอร์ `assets` ครบและกด build แล้ว
