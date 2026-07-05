# CLAUDE.md — vue-dhamma01 (Dhamma01.com frontend)

เว็บเผยแผ่ธรรมะหลวงพ่อธัมมชโย (package name `book101`): books (อ่าน + โหลด PDF), dhamma cards,
shorts (YouTube), full-text search — Vue 3.5 + Vite 5, deploy ขึ้น Firebase Hosting

**เริ่ม session**: `/wake` · **ปิด session**: `/sleep` · record หลัก: `docs/BACKLOG.md`
งานใหญ่มี task file ที่ orchestration-os repo (`~/Programming/Claude/prinze-orchestration/tasks/`)

## คำสั่ง (yarn เท่านั้น — ห้าม npm install)

```
yarn dev        # Vite dev server port 8080
yarn test       # vitest watch · yarn test:run = ครั้งเดียว (11 test files — รันก่อน commit ถ้าแตะโค้ด)
yarn build      # production build → dist/
yarn preview    # เปิดดู build จริง
yarn lint       # eslint --fix
yarn deploy     # ⚠️ build + firebase deploy จริงทันที — เป็นการตัดสินใจของ user เท่านั้น
```

## ⚠️ Vue 2→3 migration ยังไม่จบ (OS task #18)

รันบน **`@vue/compat` MODE 2**: `vite.config.js` alias `vue → @vue/compat` + compilerOptions compatConfig,
`src/main.js` เรียก `configureCompat` (หลาย flag เป็น `suppress-warning` = ยังพึ่ง behavior เก่าอยู่,
`COMPONENT_ASYNC`/`RENDER_FUNCTION`/`ATTR_FALSE_VALUE` ปิดแล้ว)
- โค้ดใหม่เขียนแบบ Vue 3 แท้เสมอ (Composition API) — อย่าเพิ่มการพึ่ง compat ใหม่
- ตัวต้องสงสัยค้าง compat: `vue-youtube-embed` (แพ็กเกจยุค Vue 2)
- branch `vue3-migration` เก่าค้างอยู่ — เช็คก่อนกู้ อาจ stale เกินใช้

## Stack

Vue 3.5 (compat) · Vite 5 · Pinia (`src/stores/`: books, cards, search) · vue-router 4 (9 views)
· **Naive UI auto-import** ผ่าน unplugin (ห้าม import มือ — ดู `src/components.d.ts`, `src/auto-imports.d.ts`)
· @unhead/vue (SEO) · vue-gtag (GA) · TypeScript ผสม JS (composables/types เป็น .ts)

## Backend API (ดู memory `2026-07-05-api3-retired` ที่ OS repo)

| endpoint | ใช้ทำอะไร | สถานะ |
|---|---|---|
| `https://api.dhamma01.com/dm01/` | axios base (`VITE_API_BASE_URL` + `apiKey` header) | ✅ production |
| `https://one.rgtcenter.com/api/dm01/...` | PDF download (`x-api-key`) | ✅ |
| `https://dm01.code-th.com/books` | full-text search (`VITE_SEARCH_API_URL`) | ✅ |
| `api3.rgtcenter.com:2053` | dev proxy `/api1` ใน vite.config.js | ❌ **retired 2026-07-05** — รอล้าง (BACKLOG) |

- `.env` (untracked): `VITE_API_BASE_URL, VITE_API_KEY, VITE_SEARCH_API_URL, VITE_API_KEY_DOWNLOAD,
  VITE_GA_ID, VITE_NODE_ENV` — ทุกตัว **inline ลง client bundle ตอน build** = public โดยธรรมชาติ
  แต่ห้าม commit `.env` อยู่ดี
- **CSP**: `firebase.json` มี `connect-src` whitelist — เพิ่ม/เปลี่ยน endpoint ต้องแก้ CSP ด้วย ไม่งั้น
  production เรียกไม่ออกทั้งที่ dev ปกติ

## Git

- ทำงานบน `dev` · remote = `idream715/book101` และ **`origin/HEAD` ชี้ `master` ไม่ใช่ dev** — ระวังตอน PR/merge
- deploy ไม่ผูกกับ git (มือ: `yarn deploy`) — push branch ไหนก็ไม่ trigger อะไร
