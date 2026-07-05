# BACKLOG — vue-dhamma01 (Dhamma01.com)

**อัปเดตล่าสุด**: 2026-07-05 (task #19 ปิดแล้ว — records ครบ)

Record หลักของ repo นี้ — `/wake` อ่านไฟล์นี้, `/sleep` อัปเดต header + ย้ายงานเสร็จลง §Recently Completed
งานทุกชิ้นมี task file เต็มที่ orchestration-os `tasks/`

## 🟡 Medium

### ล้าง api3.rgtcenter.com ที่ retired ออกจากโค้ด

user เคาะ 2026-07-05 (ระหว่าง OS task #15): domain api3.rgtcenter.com เลิกใช้แล้ว (origin ตอบ 522)
→ ลบ dev proxy `/api1 → api3.rgtcenter.com:2053` ใน vite.config.js + เอา `api3.rgtcenter.com`
ออกจาก CSP connect-src ใน firebase.json — production จริงใช้ api.dhamma01.com

### ถอด @vue/compat — ปิด Vue 3 migration (OS task #18)

ยังรัน MODE 2 ผ่าน compat layer ทั้งที่ Vue 3.5 + tests ครบแล้ว — ไล่ปิด compat flags ทีละตัว,
เช็ค vue-youtube-embed (ยุค Vue 2), ลบ dep `add` junk, ห้าม deploy เองหลังเสร็จ

## ✅ Recently Completed

### Records ครบชุด (2026-07-05, OS task #19)

CLAUDE.md ใหม่ (track แล้ว — เอาออกจาก .gitignore ตามแนว api-rgt #16), README เขียนใหม่ตรง Vite/yarn,
BACKLOG นี้เข้า git — session ใหม่ `/wake` เห็นภาพครบโดยไม่ต้องขุด survey

### Onboard เข้า orchestration-os (2026-07-05, OS task #14)

register ใน OS registry + wake/sleep commands + BACKLOG นี้ — สำรวจเต็มอยู่ที่
orchestration-os `memory/reference/legacy-repos-survey.md`
