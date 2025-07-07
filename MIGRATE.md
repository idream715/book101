# MIGRATE.md

This file provides comprehensive guidance for migrating the Vue.js 2 Buddhist content platform to modern Vue 3 + Vuetify 3 + Vite stack.

## Migration Overview

**Current Stack:** Vue 2.6.11 + Vuetify 2.7.2 + Vue CLI 4.3.0 + Vuex 3.1.3
**Target Stack:** Vue 3.5.x + Vuetify 3.8.x + Vite 5.x + Pinia

**Critical Context:** This is a Buddhist content platform with 3-author search system, complex infinite scroll, and Thai language support.

## 🚨 URGENT: Security & EOL Issues
- Vue 2 reached EOL December 2023 (no security patches)
- Vuetify 2 is EOL (no maintenance)
- Axios 0.21.4 has known security vulnerabilities
- Node-sass is deprecated

## Migration Personas

### 👨‍💻 Persona 1: Code Architecture Specialist
**Assigned Tasks:** Core functionality, API integrity, performance optimization

**Phase 1: Foundation Setup**
- [ ] **TASK-CODE-001:** Create migration branch from master
- [ ] **TASK-CODE-002:** Install Vue 3 migration build (`@vue/compat`)
- [ ] **TASK-CODE-003:** Update package.json dependencies (Phase 1)
  ```json
  {
    "vue": "^3.5.0",
    "@vue/compat": "^3.5.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^5.0.0"
  }
  ```
- [ ] **TASK-CODE-004:** Create vite.config.js with compatibility mode
- [ ] **TASK-CODE-005:** Update main.js to use createApp API
- [ ] **TASK-CODE-006:** Fix immediate Vue 3 breaking changes

**Phase 2: Router & State Management**
- [ ] **TASK-CODE-007:** Upgrade Vue Router 3→4
  - Update router/index.js syntax
  - Fix route parameter handling for multi-author system
  - Test creator-based routing (?t=creator_id)
- [ ] **TASK-CODE-008:** Migrate Vuex to Pinia
  - Convert store/index.js to Pinia stores
  - Maintain infinite scroll flag-based loading
  - Preserve search state management
  - Keep multi-author content separation

**Phase 3: Build System Migration**
- [ ] **TASK-CODE-009:** Migrate Vue CLI to Vite
  - Remove @vue/cli-* dependencies
  - Update import paths (.vue extensions required)
  - Configure proxy settings in vite.config.js
  - Update environment variables
- [ ] **TASK-CODE-010:** Fix Vite-specific issues
  - Update dynamic imports
  - Fix asset references
  - Configure alias paths

**Phase 4: Core Functionality Testing**
- [ ] **TASK-CODE-011:** Test search functionality
  - Verify keyword highlighting with `<mark>` tags
  - Test search result ranking by match count
  - Validate infinite scroll pagination
- [ ] **TASK-CODE-012:** Test multi-author system
  - Verify creator ID routing (1, 2, 4)
  - Test content filtering by author
  - Validate API calls with creator parameters
- [ ] **TASK-CODE-013:** Test API integrations
  - Axios HTTP client functionality
  - Firebase deployment pipeline
  - YouTube embed functionality

### 🎨 Persona 2: UI/UX Modernization Specialist
**Assigned Tasks:** Design system, user experience, visual consistency

**Phase 1: Vuetify 3 Foundation**
- [ ] **TASK-UI-001:** Install Vuetify 3 with Vite plugin
  ```bash
  yarn add vuetify@^3.8.0
  yarn add @mdi/font@^7.4.0
  ```
- [ ] **TASK-UI-002:** Update Vuetify configuration
  - Migrate from plugins/vuetify.js to Vuetify 3 syntax
  - Configure Material Design 3 theme
  - Set up Thai language support
- [ ] **TASK-UI-003:** Fix layout system breaking changes
  - Update `<v-app>` usage (layout positioning removed)
  - Restructure `<v-main>` automatic viewport handling
  - Remove deprecated app, clipped-left, fixed props

**Phase 2: Component Migration**
- [ ] **TASK-UI-004:** Migrate Home.vue (3-author sections)
  - Update `<v-parallax>` component changes
  - Fix `<v-card>` prop modifications
  - Preserve gold gradient background (Creator 4)
  - Maintain responsive layout for mobile
- [ ] **TASK-UI-005:** Migrate search components
  - Update SearchPage.vue backgrounds per creator
  - Fix Search.vue infinite scroll layout
  - Migrate `<v-combobox>` API changes
  - Update search result display components
- [ ] **TASK-UI-006:** Migrate content display components
  - Update Books.vue, Cards.vue, CardsList.vue
  - Fix Sarabun.vue chapter display
  - Migrate ShortsList.vue layout
  - Update Gallery.vue if needed

**Phase 3: Component API Updates**
- [ ] **TASK-UI-007:** Fix deprecated component props
  - Remove `mask` prop (use third-party library)
  - Update icon callback props to events:
    - `prepend-icon-cb` → `@click:prepend`
    - `append-icon-cb` → `@click:append`
  - Fix v-model breaking changes
- [ ] **TASK-UI-008:** Update navigation components
  - Migrate Navbar.vue to Vuetify 3
  - Fix mobile menu functionality
  - Update routing buttons and icons

**Phase 4: Styling & Theming**
- [ ] **TASK-UI-009:** Migrate SCSS/CSS
  - Update node-sass to Dart Sass
  - Fix Vuetify 3 CSS class changes
  - Preserve Thai font integration (Sarabun)
  - Update Material Design Icons
- [ ] **TASK-UI-010:** Theme consistency validation
  - Test responsive design on all devices
  - Validate color schemes per creator
  - Check accessibility compliance
  - Test Thai language rendering

## Critical Migration Dependencies

**Sequential Order (MUST follow):**
1. Code Persona: Foundation Setup → Router/State → Build System
2. UI Persona: Vuetify 3 Foundation → Component Migration → Styling
3. **Joint Testing:** Both personas validate functionality together

## Testing Checklist

### ✅ Core Functionality Testing
- [ ] Search with Thai keywords works correctly
- [ ] Infinite scroll loads more content
- [ ] Creator-based routing (/?t=1, /?t=2, /?t=4) functions
- [ ] YouTube embed plays videos
- [ ] PDF links open correctly
- [ ] Firebase deployment succeeds

### ✅ UI/UX Testing  
- [ ] All 3 author sections display properly
- [ ] Mobile responsiveness maintained
- [ ] Thai fonts render correctly
- [ ] Material Design 3 theme applied
- [ ] Search interface usability preserved

## Node.js Version Requirements

**Current:** Node.js v22.14.0 (LTS) ✅ **COMPATIBLE**

**Requirements for Migration:**
- **Vite 5.x:** Requires Node.js 20.19+ or 22.12+
- **Vue 3.5.x:** Requires Node.js 18+ (but 20+ recommended)
- **Current Status:** v22.14.0 LTS meets all requirements

**Available Node.js versions (nvm list):**
- v20.13.1 (minimum for Vite)
- **v22.14.0** (current, LTS - RECOMMENDED)
- v23.10.0 (latest stable)

**Action:** No Node.js upgrade needed - current version is optimal.

## When Starting from New Thread

### Context Setup Commands
```bash
# 1. Read current project state
cat CLAUDE.md
cat MIGRATE.md
git status
git log --oneline -10

# 2. Check migration progress
grep -r "TASK-.*: \[x\]" MIGRATE.md  # Completed tasks
grep -r "TASK-.*: \[ \]" MIGRATE.md  # Pending tasks

# 3. Verify current dependencies
cat package.json | grep -A 20 "dependencies"
```

### Persona Assignment
**When continuing work, explicitly state your persona:**
- "I am working as **Code Architecture Specialist** on TASK-CODE-XXX"
- "I am working as **UI/UX Modernization Specialist** on TASK-UI-XXX"

### Critical Context to Remember
1. **Multi-Author System:** 3 creators (ID: 1, 2, 4) with separate content
2. **Search Complexity:** Keyword highlighting, infinite scroll, ranking
3. **Thai Language:** Must preserve font rendering and language support
4. **Mobile-First:** Responsive design is critical
5. **Firebase Deployment:** Build process must remain compatible

## Emergency Rollback Plan
```bash
# If migration fails critically:
git checkout master
yarn install
yarn dev  # Should restore working state
```

## Success Criteria
- [ ] All existing functionality preserved
- [ ] Performance improved (Vite build times)
- [ ] Security vulnerabilities resolved
- [ ] Modern development experience
- [ ] Future-proof tech stack

---

**⚠️ IMPORTANT:** This migration affects a production Buddhist content platform. Test thoroughly before deploying. Preserve all existing functionality while modernizing the codebase.