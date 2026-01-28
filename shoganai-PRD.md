# Product Requirements Document (PRD)

## Product Name
**Shoganai** (しょうがない - "It can't be helped")

---

## Product Overview

Shoganai is a high-skill-level Shogi (Japanese chess) web application designed for serious players and learners seeking an exceptionally strong AI opponent, clear move guidance, and structured training resources. The app combines competitive play, advanced analysis, and progressive tutorials in a clean, modern web interface.

**Core Differentiator**: Deep CPU analysis (15+ ply search depth) with accessible visual move previews, AI recommendations, and multilingual support—delivering professional-grade Shogi training in a web browser.

---

## Goals & Objectives

### Primary Goals
1. Deliver one of the strongest Shogi AI opponents available in a web application
2. Provide clear visual assistance without automating decision-making
3. Enable structured learning and measurable improvement

### Success Criteria
- Users complete full games without rule confusion or illegal move attempts
- AI consistently plays at 1800+ ELO equivalent strength (configurable down to beginner levels)
- Tutorials enable zero-knowledge users to understand basic gameplay within 30 minutes
- Application maintains 60 FPS UI responsiveness during AI calculation
- Page load time < 2 seconds on 4G connection
- Mobile-responsive design functions correctly on devices ≥375px width

---

## Target Users

### Primary Personas

**Persona 1: Competitive Practitioner**
- Intermediate to advanced Shogi player (1200-2000 ELO equivalent)
- Seeks consistent, strong AI opponent for solo practice
- Values analysis depth over flashy features
- Desktop-primary usage

**Persona 2: Cross-Game Learner**
- Experienced chess player (1500+ ELO) transitioning to Shogi
- Understands board game strategy but needs Shogi-specific rule guidance
- Wants clear explanations of drop mechanics, promotion zones
- Desktop and tablet usage

### Secondary Personas

**Persona 3: Shogi Beginner**
- No prior Shogi experience
- Interested in Japanese culture or board games generally
- Needs step-by-step tutorials from zero knowledge
- Mobile and desktop usage

---

## Key Features

### 1. Gameplay Modes

#### 1.1 User vs CPU (Core Mode)
**Requirements**:
- AI engine with configurable search depth (5-20 ply)
- Difficulty presets:
  - **Beginner**: 5 ply, simplified evaluation
  - **Intermediate**: 10 ply, standard evaluation
  - **Advanced**: 15 ply, optimized evaluation
  - **Master**: 20 ply, full evaluation with time extensions
- Real-time legal move validation
- Complete game state tracking:
  - Captured pieces (sorted by type in hand)
  - Move history with notation
  - Promotion status
  - Check/checkmate detection
- Move timer (optional, configurable per side)
- Resignation and draw offer functionality

**Acceptance Criteria**:
- AI responds within 3 seconds on Advanced difficulty (desktop, modern CPU)
- All Shogi rules enforced: perpetual check (sennichite), impasse (jishogi), illegal drops
- Game declares winner/draw with correct condition message

#### 1.2 Training Mode
**Requirements**:
- Progressive tutorial system with 8 core modules:
  1. **Board Setup & Notation**: Ranks, files, piece identification
  2. **Piece Movement I**: King, Gold, Silver
  3. **Piece Movement II**: Knight, Lance, Pawn, Bishop, Rook
  4. **Promotion Rules**: Promotion zone, mandatory vs optional promotions
  5. **Captures & Drops**: Hand management, drop restrictions (nifu, uchifuzume)
  6. **Check & Checkmate**: Defending the king, basic mating patterns
  7. **Opening Principles**: Static Rook vs Ranging Rook concepts
  8. **Basic Tactics**: Forks, pins, sacrifices

- Each module includes:
  - Text explanation (max 200 words per screen)
  - Interactive board demonstrations
  - 3-5 practice exercises with validation
  - Progress indicator

**Acceptance Criteria**:
- User can navigate between modules non-linearly
- Progress persists in browser localStorage
- Exercises validate move correctness and provide hints after 2 failed attempts
- Tutorial content fully localized in all supported languages

---

### 2. Move Assistance

#### 2.1 Legal Move Preview
**Requirements**:
- Click/tap piece → highlight all legal destination squares
- Visual treatment:
  - Valid move squares: subtle glow (green, opacity 0.3)
  - Capture squares: distinct indicator (red outline)
  - Drop zones: different shade (blue, opacity 0.2)
- Deselect on background click or same-piece click
- No move executed until destination clicked

**Acceptance Criteria**:
- Highlights update in <50ms after piece selection
- Mobile touch targets ≥44x44px
- No false positives (illegal moves never shown as legal)

#### 2.2 Recommended Move (AI Hint)
**Requirements**:
- Toggle button in game UI (default: OFF)
- When enabled, displays AI's recommended move for user:
  - Animated arrow from origin to destination square
  - Pulsing effect on destination square
  - Move notation text (e.g., "☗7六歩" or "P-7f")
- Re-calculates after user's move
- Configurable depth (default: same as CPU difficulty)

**Acceptance Criteria**:
- Recommendation updates within 2 seconds
- Toggle state persists across sessions
- Visual indicator clearly distinguishable from legal move preview
- Performance: no UI lag during calculation (use Web Worker)

---

### 3. Language & Localization

#### 3.1 Supported Languages
- **English** (default)
- **French**
- **Japanese**

#### 3.2 Localized Content
**In Scope**:
- All UI labels and buttons
- Tutorial text and instructions
- Game status messages (check, checkmate, etc.)
- Piece names in notation
- Settings and menu items

**Out of Scope**:
- Traditional vs Simplified Japanese piece characters (use traditional kanji)
- Regional dialect variations

**Technical Requirements**:
- Language files in JSON format (i18n structure)
- Language selection in Settings menu
- Choice persists in localStorage
- Dynamic content switching without page reload

**Acceptance Criteria**:
- No untranslated strings visible in any supported language
- Shogi terminology accurate (verified by native speakers or Shogi organizations)
- Text doesn't overflow containers in any language

---

### 4. User Interface & Experience

#### 4.1 Board Interaction
**Requirements**:
- **Piece Selection**: Click/tap to select
- **Movement**: Click/tap highlighted square to move
- **Promotion Prompt**: Modal dialog on reaching promotion zone (if optional)
- **Captured Pieces**: Displayed in "hand" area, clickable for drops
- **Move Animations**: 200-300ms smooth transitions
- **Sound Effects** (optional toggle):
  - Piece movement
  - Capture
  - Check warning
  - Game end

**Acceptance Criteria**:
- All interactions work with mouse, touch, and keyboard (WASD + Enter for accessibility)
- No double-tap delay on mobile
- Animations can be disabled in Settings

#### 4.2 Visual Design
**Requirements**:
- **Color Palette**:
  - Board: Warm wood tones (#D4A373, #8B6F47)
  - Pieces: Traditional black/white with kanji
  - Promoted pieces: Red accent on kanji
  - Background: Neutral (#F5F5F5)
- **Typography**:
  - Japanese: Noto Sans JP
  - Latin: Inter or similar modern sans-serif
  - Piece kanji: Mincho style for authenticity
- **Layout**:
  - Board centered on desktop
  - Hand areas left/right on desktop, top/bottom on mobile
  - Side panel for move history and controls (collapsible on mobile)

**Accessibility**:
- WCAG 2.1 AA contrast ratios
- Screen reader labels for all interactive elements
- Focus indicators on keyboard navigation

**Acceptance Criteria**:
- Design passes WebAIM contrast checker
- UI renders correctly on Chrome, Firefox, Safari (last 2 versions)
- No horizontal scroll on 375px width (iPhone SE)

---

## Technical Requirements

### Architecture

#### Frontend Stack
- **HTML5**: Semantic structure
- **Tailwind CSS 3.x**: Utility-first styling
- **TypeScript**: Type-safe JavaScript (preferred) or vanilla JS
- **Build Tool**: Vite or Parcel for fast dev experience
- **State Management**: Zustand or Context API (for game state)

#### Game Engine
**Shogi Rules Engine**:
- Full rule implementation:
  - Piece movement (including promoted pieces)
  - Promotion zones and logic (forced vs optional)
  - Drop restrictions (nifu, double pawn; uchifuzume, checkmate by drop)
  - Perpetual check (sennichite)
  - Impasse (jishogi) with point counting
- Recommended library: **shogi.js** or custom implementation
- FEN-like notation support for game state serialization

**AI Engine**:
- **Algorithm**: Alpha-beta pruning with iterative deepening
- **Evaluation Function**:
  - Material value (adjusted for Shogi piece values)
  - King safety
  - Piece mobility
  - Center control
  - Hand value (captured pieces)
- **Search Depth**: 5-20 ply (configurable)
- **Optimization**: Transposition tables, move ordering, quiescence search
- Recommended library: **Lishogi engine** (open-source) or custom

#### Performance Requirements
- **AI Calculation**: 
  - Must not block main thread (use Web Worker)
  - Target response time: <2 seconds on Advanced (15 ply) on median desktop CPU (2020+)
  - Graceful degradation on slower devices (reduce depth automatically)
- **UI Rendering**:
  - 60 FPS during animations
  - Initial page load: <2s on 4G
  - Time to Interactive (TTI): <3s

#### Browser Compatibility
- **Desktop**: Chrome 100+, Firefox 100+, Safari 15+, Edge 100+
- **Mobile**: iOS Safari 15+, Chrome Android 100+

#### Data Persistence
- **localStorage** for:
  - Language preference
  - Tutorial progress
  - Settings (sound, animations, recommended move toggle)
  - Last game state (resume after refresh)
- No backend required for MVP

---

## Non-Goals (Out of Scope for MVP)

### Explicitly Excluded
- ❌ Online multiplayer (PvP)
- ❌ User accounts, authentication, or cloud saves
- ❌ Leaderboards or ELO tracking
- ❌ Game review/analysis with variation trees
- ❌ Professional game databases or opening books
- ❌ Custom board skins or piece sets
- ❌ Puzzle mode (tsume-shogi)
- ❌ Time controls beyond basic move timers
- ❌ Social features (sharing, commenting)

---

## MVP Scope Definition

### ✅ Included in MVP
1. **Core Gameplay**:
   - User vs CPU with 4 difficulty levels
   - Full Shogi rule enforcement
   - Move timer (optional)

2. **Assistance Features**:
   - Legal move preview
   - AI recommended move (toggle)

3. **Training**:
   - 8 tutorial modules with interactive exercises

4. **Localization**:
   - English, French, Japanese

5. **UI/UX**:
   - Responsive design (375px - 1920px)
   - Accessibility baseline (WCAG AA)
   - Dark mode toggle (bonus)

6. **Settings**:
   - Language selection
   - Sound toggle
   - Animation toggle
   - AI difficulty preset

### 📋 Acceptance Criteria for MVP Launch
- [ ] All 8 tutorial modules complete and translated
- [ ] AI plays legal moves at all difficulty levels without crashes
- [ ] User can complete a full game from start to checkmate/resignation
- [ ] No console errors on supported browsers
- [ ] Page load time <2s on fast 3G (Lighthouse test)
- [ ] Mobile layout functional on iPhone SE (375px) and iPad (768px)
- [ ] All text localized in 3 languages with no placeholders

---

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| AI too slow on mobile devices | High | Medium | Implement depth auto-scaling based on device performance benchmarking |
| Tutorial clarity for non-Japanese users | Medium | Medium | User testing with target personas; iterate based on feedback |
| Localization errors (Shogi terminology) | Medium | High | Hire native-speaking Shogi players for translation review |
| Rules engine bugs (edge cases) | High | Medium | Unit test all rule scenarios; use test positions from professional games |
| Web Worker browser compatibility | Low | Low | Feature detection with fallback to setTimeout-based chunking |

---

## Success Metrics (Post-Launch)

### Quantitative
- **Engagement**: Average session duration >15 minutes
- **Completion**: 60%+ of users complete at least 1 tutorial module
- **Retention**: 30% of users return within 7 days
- **Performance**: 95th percentile AI response time <5 seconds

### Qualitative
- User feedback sentiment (post-game survey)
- Bug reports vs feature requests ratio
- Community reputation on Shogi forums/subreddits

---

## Future Enhancements (Post-MVP Roadmap)

### Phase 2 (Q2 2026)
- Online PvP matchmaking with ELO ratings
- Game save/load to cloud (requires user accounts)
- Analysis mode with move review and AI annotations

### Phase 3 (Q3 2026)
- Puzzle mode: Tsume-shogi (mating problems)
- Opening library with common sequences (Static Rook, Ranging Rook)
- Mobile app (React Native or PWA installable)

### Phase 4 (Q4 2026)
- Tournament mode (Swiss system)
- Spectator mode for online games
- Integration with professional game databases (Kifu format)

---

## Glossary

- **Ply**: A single move by one player (depth measurement in AI search)
- **Nifu**: Illegal double pawn rule
- **Uchifuzume**: Illegal checkmate by pawn drop
- **Sennichite**: Draw by repetition (perpetual check)
- **Jishogi**: Impasse when both kings reach promotion zone with sufficient material
- **Kifu**: Standard Shogi game notation format

---

## Appendix

### Design Mockups
*(To be added: Figma links or embedded images)*

### API Specifications
*(Not applicable for MVP—no backend)*

### UML Diagrams

#### Component Diagram (High-Level)
```
┌─────────────────────────────────────────────┐
│            Shoganai Web App                 │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   Game   │  │ Tutorial │  │ Settings │ │
│  │   Mode   │  │   Mode   │  │   Menu   │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │             │               │       │
│  ┌────┴─────────────┴───────────────┴────┐ │
│  │         Game State Manager            │ │
│  │    (board, captures, history, turn)   │ │
│  └────┬───────────────────────────┬──────┘ │
│       │                           │         │
│  ┌────┴──────┐              ┌─────┴──────┐ │
│  │  Shogi    │              │  AI Engine │ │
│  │  Rules    │◄─────────────┤ (Web Worker)│ │
│  │  Engine   │              └────────────┘ │
│  └───────────┘                             │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │       UI Layer (React/Vanilla)       │  │
│  │  - Board Renderer                    │  │
│  │  - Move Input Handler                │  │
│  │  - Animation Controller              │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │      Localization (i18n)             │  │
│  │  - EN / FR / JP JSON files           │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

#### State Machine: Game Flow
```
      ┌─────────────┐
      │  App Start  │
      └──────┬──────┘
             │
      ┌──────▼──────┐
      │ Main Menu   │
      └─┬─────────┬─┘
        │         │
   ┌────▼──┐  ┌──▼────────┐
   │ Game  │  │ Tutorial  │
   │ Mode  │  │   Mode    │
   └───┬───┘  └───────────┘
       │
   ┌───▼─────────┐
   │ User Turn   │◄──┐
   └───┬─────────┘   │
       │             │
   ┌───▼─────────┐   │
   │ Move Legal? │   │
   └───┬─────────┘   │
    Yes│      No│    │
       │         └───┘
   ┌───▼─────────┐
   │ Apply Move  │
   └───┬─────────┘
       │
   ┌───▼─────────┐
   │ Check End?  │
   └───┬─────────┘
    No │      Yes│
       │         └──► Game Over
   ┌───▼─────────┐
   │  CPU Turn   │
   └───┬─────────┘
       │
   ┌───▼─────────┐
   │ AI Compute  │
   └───┬─────────┘
       │
   ┌───▼─────────┐
   │ Apply Move  │
   └───┬─────────┘
       │
       └─────────────┘
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-17 | Product Team | Initial PRD |
| 1.1 | 2025-01-17 | Engineering Review | Added technical specifications, UML diagrams |

---

**Approval**

This PRD requires sign-off from:
- [ ] Product Manager
- [ ] Engineering Lead
- [ ] Design Lead

---

**End of Document**