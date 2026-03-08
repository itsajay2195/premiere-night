# Première Night 🎬

A cinematic film discovery app built for Mytheresa's private screening curation. Curators can browse now-playing and popular films, filter by genre, search the full TMDb catalogue, and maintain a persistent watchlist — all wrapped in a dark, editorial aesthetic.

---

## Prerequisites

| Tool             | Version                           |
| ---------------- | --------------------------------- |
| Node.js          | 20+                               |
| JDK              | 17+                               |
| Android Studio   | Latest (for emulator / SDK)       |
| Xcode            | 15+ (macOS only, for iOS)         |
| React Native CLI | via `@react-native-community/cli` |

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/ajaycnv/premiere-night.git
cd premiere-night
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your TMDb API key

Create a `config.ts` file in `src/`:

```ts
// src/config.ts
export const TMDB_API_KEY = 'your_api_key_here';
```

Get a free key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

### 4. Install iOS pods (macOS only)

```bash
cd ios && pod install && cd ..
```

---

## Running the App

### Android

```bash
npm run android
```

### iOS (macOS only)

```bash
npm run ios
```

### Start Metro bundler only

```bash
npm run start
```

---

## Live Build

> [View on Appetize.io](#) ← link to be added after build upload

---

## Scripts

```bash
npm run android       # run on Android
npm run ios           # run on iOS
npm run start         # start Metro bundler
npm test              # run Jest tests
npm run lint          # lint src/
npm run lint:fix      # lint and auto-fix
```

---

## Stack

| Concern        | Library                                       | Version |
| -------------- | --------------------------------------------- | ------- |
| Framework      | React Native CLI                              | 0.81.5  |
| Navigation     | React Navigation (Native Stack + Bottom Tabs) | 7.x     |
| State          | Zustand                                       | 5.x     |
| Storage        | react-native-mmkv                             | 4.x     |
| Network status | @react-native-community/netinfo               | 12.x    |
| Icons          | react-native-vector-icons                     | 10.x    |
| Toast          | react-native-toast-message                    | 2.x     |
| API            | TMDb REST API                                 | v3      |

---

## Architecture Decisions

### Bare React Native CLI over Expo

Expo managed workflow introduced native module incompatibilities during the build process (`@react-native-async-storage` failing on Gradle 9, EAS build failures). Bare CLI gives full control over native config and avoids managed workflow constraints — more representative of a production codebase.

### Config-driven sections with a single FlatList over SectionList

The home screen uses a `buildSections()` pure function that returns a typed `Section[]` array, rendered by a single outer `FlatList`. Each section is itself a horizontal `AppFlatList`.

`SectionList` was considered but ruled out because:

- Our sections are fundamentally different data sources (`nowPlaying`, `popular`, `genre`) — not grouped data of the same type
- Each section needs independent `isLoading`, `isError`, `orientation`, and `size` config — `SectionList` doesn't support per-section loading states natively
- Composing horizontal lists inside `SectionList` adds constraints with no benefit
- Adding a new section is one object in the `buildSections` array — no new JSX required

### `useReducer` over multiple `useState`s

HomeScreen originally had 9 separate `useState` calls. Consolidated into a single `useReducer` with explicit named actions (`LOAD_SUCCESS`, `LOAD_ERROR` etc.) to:

- Prevent inconsistent intermediate states (e.g. `loading: false` while data is still empty)
- Make every state transition traceable and testable in isolation
- Keep all data-fetching logic out of the component in a custom `useHomeScreen` hook

### MMKV over AsyncStorage

`@react-native-async-storage/async-storage` failed to resolve its native dependency (`org.asyncstorage.shared_storage`) on Gradle 9 during the EAS build. MMKV was chosen as the replacement because:

- ~30x faster than AsyncStorage (C++ JSI, synchronous reads)
- No size limits (AsyncStorage has per-item limits, SecureStore has a 2KB limit)
- First-class Zustand `persist` middleware support via a simple adapter
- Battle-tested in production React Native apps

### Zustand over Redux

For a project of this scope, Redux introduces unnecessary boilerplate. Zustand provides:

- Zero boilerplate store setup
- Built-in `persist` middleware for MMKV integration
- Minimal re-renders via selector subscriptions
- Simple API that's easy to follow in a code review

### Request cancellation with AbortController

`DetailScreen` creates an `AbortController` on mount and cancels the in-flight TMDb detail request on unmount. This prevents state updates on unmounted components when the user navigates away quickly — a common source of React warnings and subtle memory leaks.

### Centralised error handling

- A custom `httpClient.ts` wraps `fetch` with a typed `ApiError` class and centralised response handling
- `react-native-toast-message` surfaces API failures as non-blocking toasts
- `ErrorBoundary` (class component — required, as hooks cannot catch render errors) wraps the navigator for unexpected crashes
- `NetworkBanner` listens to `@react-native-community/netinfo` and renders an animated overlay when the device goes offline — one place, covers the whole app

### Typography system

A single `<Typography variant="..." />` component replaces all raw `<Text>` usage. Variants (`heading`, `title`, `body`, `caption`) are defined once with consistent sizing, weight, and letter-spacing. `StyleSheet.create<Record<TypographyVariant, TextStyle>>` ensures TypeScript errors if a variant is declared but not styled.

### Shared component library

Reusable components extracted to `src/components/`:

- `AppFlatList` — wraps FlatList with loading, error, empty, and pull-to-refresh states
- `AppTextInput` — label, left/right icons, focused/error/disabled visual states
- `Pill` — shared between `GenreFilter` (interactive, active state) and `DetailScreen` (decorative metadata chips)
- `ScreenContainer` — `SafeAreaView` + `StatusBar` in one place
- `NetworkBanner` — global offline indicator

---

## Deep Linking

The app supports deep linking via the `premierenight://` scheme.

| URL                         | Destination                |
| --------------------------- | -------------------------- |
| `premierenight://home`      | Home tab                   |
| `premierenight://watchlist` | Watchlist tab              |
| `premierenight://movie/:id` | Detail screen for movie ID |

**Test on Android:**

```bash
adb shell am start -W -a android.intent.action.VIEW -d "premierenight://movie/550" com.premierenight
```

**Test on iOS:**

```bash
xcrun simctl openurl booted "premierenight://movie/550"
```

---

## Testing

```bash
npm test
```

Tests cover pure functions with no UI dependencies:

- `buildSections.test.ts` — all section combinations (default, searching, genre filter, loading, error states)
- `homeReducer.test.ts` — every reducer action

---

## Known Trade-offs & Future Improvements

- **No pagination** — carousels are capped at 15 items. Full pagination via `onEndReached` + page state would be straightforward to add.
- **No offline cache** — React Query would add request caching, background refetch, and automatic `AbortSignal` injection with minimal code changes.
- **Backdrop image size** — fetched at `w1280` regardless of screen size. Could be optimised with responsive size selection.
- **Search scope** — searches the full TMDb catalogue, not just the loaded carousels. This is intentional and a better UX.

---

## AI Tool Usage

Claude (Anthropic) assisted with:

- Initial project scaffolding and navigation boilerplate
- Zustand persist middleware adapter setup
- Unit test generation for `buildSections` and `homeReducer`
- README structure and wording

All architectural decisions were made independently — the config-driven section approach, `useReducer` consolidation, MMKV selection, `AbortController` usage, component extraction strategy, and folder structure.

Note on testing: Our current team operates with a dedicated QA function, so day-to-day test writing is not part of my recent workflow. AI was used to generate the test suite; each test case was reviewed and validated manually against the actual function behaviour.
