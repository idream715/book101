# Dhamma01.com — book101

เว็บเผยแผ่ธรรมะ: หนังสือ (อ่านออนไลน์ + ดาวน์โหลด PDF), การ์ดธรรมะ, shorts, และค้นหาคำสอน

**Stack**: Vue 3 (Vite 5) · Pinia · Naive UI · Firebase Hosting

## Quick start

```bash
yarn install
# สร้าง .env — รายชื่อ VITE_* ที่ต้องมีดูใน CLAUDE.md
yarn dev               # http://localhost:8080
```

## คำสั่งหลัก

| คำสั่ง | ทำอะไร |
|---|---|
| `yarn dev` | dev server (Vite, port 8080) |
| `yarn test` / `yarn test:run` | Vitest (watch / ครั้งเดียว) |
| `yarn lint` | ESLint + fix |
| `yarn build` | production build → `dist/` |
| `yarn preview` | ดู build จริงก่อน deploy |
| `yarn deploy` | build + deploy ขึ้น Firebase Hosting (production จริง) |

ใช้ **yarn** เท่านั้น (มี `yarn.lock`) — รายละเอียดสถาปัตยกรรม, API endpoints, และสถานะ
Vue 2→3 migration อยู่ใน `CLAUDE.md` · งานค้างดู `docs/BACKLOG.md`
