# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn lint` - Run ESLint to check code quality
- `yarn deploy` - Build and deploy to Firebase hosting

### Package Management
- `yarn install` - Install dependencies
- Use `yarn` instead of `npm` for package management

## Architecture Overview

This is a Vue.js 2 application for a Buddhist content platform (Dhamma01.com) that provides access to books, cards, and short content with search functionality.

### Technology Stack
- **Frontend**: Vue.js 2 with Vuetify Material Design
- **State Management**: Vuex store with centralized API calls
- **Routing**: Vue Router with lazy-loaded components
- **HTTP Client**: Axios with custom instance configuration
- **Analytics**: Google Analytics via vue-gtag
- **Media**: YouTube embedding via vue-youtube-embed
- **Deployment**: Firebase hosting

### Key Architecture Patterns

**API Layer**: Centralized in `src/plugins/axios.js` with two instances:
- Primary API: `https://api3.rgtcenter.com:2053/dm01` for content
- Search API: `https://dm01.code-th.com/books` for search operations
- Development proxies configured in `vue.config.js`

**State Management**: Comprehensive Vuex store (`src/store/index.js`) managing:
- Books, cards, and shorts content
- Search functionality with keyword highlighting
- Infinite scroll pagination with flag-based loading
- Loading states and error handling

**Search Implementation**: Advanced search with:
- Keyword highlighting using `<mark>` tags
- Result ranking by match count
- Infinite scroll with offset-based pagination
- Separate search flows for different content types

**Content Types**:
- **Books**: Main content with chapters (sarabun)
- **Cards**: Tagged content with filter/search capabilities
- **Shorts**: Short-form content with similar search patterns

**Multi-Author System**: The application supports 3 distinct authors/creators:
- **Creator ID 1**: หลวงพ่อธัมมชโย (คุณครูไม่ใหญ่) - Primary content with books, cards, search, and shorts
- **Creator ID 2**: คุณยายอาจารย์ มหารัตนอุบาสิกาจันทร์ ขนนกยูง - Books, cards, and search
- **Creator ID 4**: พระมงคลเทพมุนี (หลวงพ่อวัดปากน้ำ) - Books and search functionality
- Each creator has separate content sections in Home.vue with distinct styling and backgrounds
- Navigation uses creator query parameter (`?t=creator_id`) to filter content by author

### Component Structure
- `src/views/` - Page components (Books, Cards, Search, etc.)
- `src/components/` - Reusable components (currently minimal)
- `src/router/index.js` - Route definitions with lazy loading

### Development Patterns
- Use Vuex actions for all API calls
- Implement infinite scroll with flag-based loading prevention
- Search results include marked text for highlighting
- YouTube integration for media content
- Material Design components via Vuetify

### Search Pages Architecture
The application has **2 search pages** with different purposes:
- **Search.vue**: Direct search with URL parameters - accepts query parameters (word1, word2, etc.) and automatically performs search on page load
- **SearchPage.vue**: Interactive search interface - provides search form with background images specific to each creator, redirects to `/indexs` route after search
- Both pages share similar search functionality but serve different user flows (direct links vs interactive search)

### API Endpoints
- Books: `/books/all`, `/books/{id}`, `/books/{id}/index`
- Cards: `/cards/all`, `/cards/tags`
- Shorts: `/shorts/all`
- Search: `/search` (POST with keywords, type, creator, tags)
- Random: `/indexs-rand`

### Build Configuration
- Vue CLI 4 with Babel and ESLint
- Sass/SCSS support
- Vuetify integration
- Firebase deployment pipeline

## Memorized Information
- to memorize