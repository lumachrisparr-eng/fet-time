# FET Timetable App — Developer Build Plan

> **Prototype reference:** `FET_Timetable_App_v2.html`  
> **Target:** Mobile-first timetable PWA for FET students (UBa)  
> **Stack:** Vanilla HTML/CSS/JS (single-file or modular) — upgradeable to React Native

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Decision](#2-tech-stack-decision)
3. [File Structure](#3-file-structure)
4. [Phase 1 — Data Layer](#4-phase-1--data-layer)
5. [Phase 2 — App State & Persistence](#5-phase-2--app-state--persistence)
6. [Phase 3 — Views / Screens](#6-phase-3--views--screens)
7. [Phase 4 — Notifications](#7-phase-4--notifications)
8. [Phase 5 — AI File Upload](#8-phase-5--ai-file-upload)
9. [Phase 6 — PWA & Deployment](#9-phase-6--pwa--deployment)
10. [Security Checklist](#10-security-checklist)
11. [Testing Checklist](#11-testing-checklist)
12. [Timeline](#12-timeline)

---

## 1. Project Overview

A mobile-first timetable app for students of the Faculty of Engineering & Technology (FET), University of Buea. Core features:

- **Onboarding:** Student selects department and level once on first launch
- **Home:** Weekly day-strip + course cards filtered by dept/level/day
- **Settings:** Change dept/level, dark/light mode, 12h/24h time, notification preferences
- **AI Upload:** Upload a PDF/Excel timetable; Claude parses it and merges courses into the app

---

## 2. Tech Stack Decision

### Option A — Vanilla (Recommended for v1)

| Pros | Cons |
|---|---|
| No build step | No native push notifications |
| Deployable as a single file | No app store distribution |
| Works offline with Service Worker | |
| Installable via Web App Manifest | |

### Option B — React Native / Expo (Recommended for v2+)

Use if you need true background push notifications or App Store distribution.

**For this plan, Option A is assumed.**

---

## 3. File Structure

```
fet-timetable/
├── index.html          # App shell + all views
├── style.css           # All styles (extracted from prototype)
├── app.js              # App logic, state, routing
├── data/
│   └── courses.js      # COURSES array — all real timetable data
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker (offline + caching)
└── assets/
    ├── icon-192.png
    └── icon-512.png
```

---

## 4. Phase 1 — Data Layer

This is the most critical phase. Everything else depends on it.

### 4.1 Course Schema

Each course object must conform to this shape:

```js
{
  code:     "CEN301",           // string   — course code
  name:     "Operating Systems",// string   — full course name
  dept:     "CEN",              // string   — department code (see below)
  level:    300,                // number   — 200 | 300 | 400 | 500
  day:      "WED",              // string   — MON | TUE | WED | THU | FRI | SAT
  time:     "07:00-09:00",      // string   — 24h, HH:MM-HH:MM
  hall:     "FET-TECH2",        // string   — venue
  lecturer: "Dr. Nkemdirim"     // string   — lecturer name
}
```

### 4.2 Department Codes

| Code | Full Name |
|---|---|
| `CEF` | Computer Engineering |
| `EEF` | Electrical Engineering |
| `CIV` | Civil Engineering |
| `MEF` | Mechanical Engineering |
| `CPE` | Chemical & Petroleum Engineering |

### 4.3 Data File

```js
// data/courses.js
const COURSES = [
  // --- CEN 200 ---
  { code: "CEN201", name: "...", dept: "CEF", level: 200, day: "MON", time: "08:00-10:00", hall: "FET-A1", lecturer: "..." },
  // ... all other courses
];

// Export for use in app.js
// (If not using modules, just include this file before app.js via <script> tags)
```

### 4.4 Filter Utility

```js
function getCoursesFor(dept, level, day) {
  return COURSES.filter(c =>
    c.dept === dept &&
    c.level === Number(level) &&
    c.day === day
  );
}

function getDaysWithCourses(dept, level) {
  const days = ["MON","TUE","WED","THU","FRI","SAT"];
  return days.filter(day => getCoursesFor(dept, level, day).length > 0);
}
```

> ⚠️ **Action required:** Manually transcribe all real timetable data into `courses.js` before development begins. This cannot be automated without the actual timetable documents.

---

## 5. Phase 2 — App State & Persistence

### 5.1 State Object

Maintain a single global state object in `app.js`:

```js
const DEFAULT_STATE = {
  dept:      null,        // "CEN" | "EEN" | "CIV" | "MEF" | "CPE"
  level:     null,        // 200 | 300 | 400 | 500
  theme:     "dark",      // "dark" | "light"
  tf:        "24",        // "24" | "12"
  notifOn:   true,
  reminder:  10,          // minutes before class: 5 | 10 | 15 | 30 | 60
  notifSet:  [],          // array of course codes with reminders enabled
  imported:  [],          // array of AI-imported course objects
};

let S = { ...DEFAULT_STATE };
```

### 5.2 Persistence with localStorage

```js
const LS_KEY = "fet_timetable_v2";

function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify({
    ...S,
    notifSet: [...S.notifSet] // ensure array, not Set
  }));
}

function loadState() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return;
  const saved = JSON.parse(raw);
  S = { ...DEFAULT_STATE, ...saved };
}
```

### 5.3 Initialization Flow

```js
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  applyTheme();

  if (S.dept && S.level) {
    showView("vHM");   // skip onboarding
    initHome();
  } else {
    showView("vOB");   // show onboarding
  }
});
```

---

## 6. Phase 3 — Views / Screens

The app uses absolute-positioned views with CSS transitions. Only one view is visible at a time.

### 6.1 View IDs (from prototype)

| ID | Screen |
|---|---|
| `vOB` | Onboarding |
| `vHM` | Home / Timetable |
| `vST` | Settings |

```js
function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("on"));
  document.getElementById(id).classList.add("on");
}
```

### 6.2 Screen 1 — Onboarding (`vOB`)

**Behaviour:**
- User taps a department card → toggles selection state
- User taps a level button → toggles selection state
- Tapping "Open my timetable" validates both fields are selected
- On success: save to state, call `saveState()`, show `vHM`

```js
function obFinish() {
  if (!S.dept || !S.level) {
    document.getElementById("ob-err").classList.add("on");
    return;
  }
  saveState();
  initHome();
  showView("vHM");
}
```

### 6.3 Screen 2 — Home (`vHM`)

**Greeting logic:**
```js
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
```

**Day strip:** Render MON–SAT chips. Pre-select today (or MON if weekend).

```js
const DAY_NAMES = ["MON","TUE","WED","THU","FRI","SAT"];
const TODAY_INDEX = new Date().getDay(); // 0=Sun, 1=Mon...
const DEFAULT_DAY = (TODAY_INDEX === 0 || TODAY_INDEX === 6) ? "MON" : DAY_NAMES[TODAY_INDEX - 1];
```

**Course cards:** Group by time slot. For each course, show a bell icon that toggles its notification state.

**Time formatting:**
```js
function formatTime(timeStr) {
  // timeStr = "07:00-09:00"
  if (S.tf === "24") return timeStr;
  return timeStr.split("-").map(t => {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2,"0")} ${period}`;
  }).join(" – ");
}
```

### 6.4 Screen 3 — Settings (`vST`)

Settings changes that require `saveState()`:
- Department / level change → also calls `initHome()`
- Theme toggle → also calls `applyTheme()`
- Time format change → also calls `renderCourses()` to reformat times
- Notification toggle + reminder time → update state, reschedule notifications

```js
function applyTheme() {
  document.body.className = S.theme;
}
```

---

## 7. Phase 4 — Notifications

### 7.1 Browser Permission

```js
async function requestNotifPermission() {
  if (!("Notification" in window)) {
    alert("Your browser doesn't support notifications.");
    return false;
  }
  const perm = await Notification.requestPermission();
  return perm === "granted";
}
```

### 7.2 Time Until Next Occurrence

```js
function msUntilNextOccurrence(dayStr, timeStr) {
  const DAY_MAP = { MON:1, TUE:2, WED:3, THU:4, FRI:5, SAT:6 };
  const [startTime] = timeStr.split("-");
  const [h, m] = startTime.split(":").map(Number);

  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);

  let daysUntil = (DAY_MAP[dayStr] - now.getDay() + 7) % 7;
  if (daysUntil === 0 && target <= now) daysUntil = 7; // already passed today
  target.setDate(now.getDate() + daysUntil);

  return target.getTime() - now.getTime();
}
```

### 7.3 Schedule a Reminder

```js
const notifTimers = {}; // { courseCode: timeoutId }

function scheduleReminder(course) {
  if (!S.notifOn) return;
  const ms = msUntilNextOccurrence(course.day, course.time) - (S.reminder * 60 * 1000);
  if (ms <= 0) return;

  notifTimers[course.code] = setTimeout(() => {
    new Notification(`⏰ ${course.code} in ${S.reminder} min`, {
      body: `${course.name} — ${course.hall}`,
      icon: "/assets/icon-192.png"
    });
  }, ms);
}

function cancelReminder(courseCode) {
  clearTimeout(notifTimers[courseCode]);
  delete notifTimers[courseCode];
}
```

### 7.4 Toggle Reminder on Bell Icon Click

```js
async function toggleBell(courseCode) {
  const course = COURSES.find(c => c.code === courseCode);
  if (!course) return;

  const isOn = S.notifSet.includes(courseCode);

  if (!isOn) {
    const granted = await requestNotifPermission();
    if (!granted) return;
    S.notifSet.push(courseCode);
    scheduleReminder(course);
  } else {
    S.notifSet = S.notifSet.filter(c => c !== courseCode);
    cancelReminder(courseCode);
  }

  saveState();
  renderCourses(); // refresh bell icon states
}
```

> ⚠️ **Limitation:** `setTimeout`-based notifications only fire while the browser tab is open. For true background notifications, implement a **Service Worker** with the Push API (requires a backend for VAPID keys).

---

## 8. Phase 5 — AI File Upload

### 8.1 Flow Overview

```
User selects file
       │
       ▼
Read as base64 (FileReader API)
       │
       ▼
POST to Anthropic API  (/v1/messages)
  - Attach file as document block
  - Prompt: "Extract courses, return JSON only"
       │
       ▼
Parse JSON response
       │
       ▼
Preview parsed courses
       │
       ▼
User confirms → merge into COURSES array
```

### 8.2 Read File as Base64

```js
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}
```

### 8.3 Anthropic API Call

```js
async function callClaude(base64Data, mediaType) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,               // see Security section
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: mediaType, data: base64Data }
          },
          {
            type: "text",
            text: `Extract all courses from this timetable file.
Return ONLY a valid JSON array. No preamble, no markdown, no explanation.
Each object must have exactly these fields:
  code    (string)  — course code e.g. "CEN301"
  name    (string)  — full course name
  dept    (string)  — one of: CEN, EEN, CIV, MEF, CPE
  level   (number)  — one of: 200, 300, 400, 500
  day     (string)  — one of: MON, TUE, WED, THU, FRI, SAT
  time    (string)  — format "HH:MM-HH:MM" in 24h
  hall    (string)  — venue/room
  lecturer (string) — lecturer name`
          }
        ]
      }]
    })
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.content.find(b => b.type === "text")?.text ?? "[]";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}
```

### 8.4 Supported File Types

| Extension | MIME Type |
|---|---|
| `.pdf` | `application/pdf` |
| `.xlsx` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| `.xls` | `application/vnd.ms-excel` |
| `.csv` | `text/csv` |

### 8.5 Merge Imported Courses

```js
function applyImport(parsedCourses) {
  // Avoid duplicates by course code
  const existingCodes = new Set(COURSES.map(c => c.code));
  const newCourses = parsedCourses.filter(c => !existingCodes.has(c.code));
  COURSES.push(...newCourses);

  // Persist imported courses separately so they survive refresh
  S.imported = [...S.imported, ...newCourses];
  saveState();
  initHome();
}
```

On app init, re-merge saved imports:
```js
function loadState() {
  // ... load S from localStorage ...
  if (S.imported?.length) COURSES.push(...S.imported);
}
```

---

## 9. Phase 6 — PWA & Deployment

### 9.1 Web App Manifest (`manifest.json`)

```json
{
  "name": "FET Timetable",
  "short_name": "FET",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0e0c",
  "theme_color": "#f5c842",
  "icons": [
    { "src": "/assets/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Link in `<head>`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#f5c842">
```

### 9.2 Service Worker (`sw.js`) — Basic Offline Cache

```js
const CACHE = "fet-v1";
const ASSETS = ["/", "/index.html", "/style.css", "/app.js", "/data/courses.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
```

Register in `app.js`:
```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
```

### 9.3 Deployment Options

| Platform | Steps | Cost |
|---|---|---|
| GitHub Pages | Push to repo → Settings → Pages | Free |
| Netlify | Drag folder to netlify.com/drop | Free |
| Vercel | `npx vercel` in project folder | Free |

---

## 10. Security Checklist

- **Never commit the Anthropic API key to a public repo.** Use an environment variable or a proxy.
- **Recommended proxy setup (Vercel Serverless Function):**
  1. Create `/api/claude.js` on Vercel
  2. It receives `{ base64, mediaType }` from the client
  3. It attaches the key server-side and forwards to Anthropic
  4. The client never sees the key
- For a closed school project with no public repo, storing the key in a config file is acceptable but not recommended.

---

## 11. Testing Checklist

### Functional
- [ ] Onboarding only shows on first load; skipped on return
- [ ] Dept/level selection filters courses correctly
- [ ] Day strip highlights today; dots appear on days with classes
- [ ] Empty state shown when no classes on a day
- [ ] Time format switches between 12h and 24h correctly
- [ ] Dark/light theme persists after refresh
- [ ] Bell toggles per-course notification state
- [ ] Notification fires at correct time (test with a 1-minute lead time)
- [ ] AI upload parses a real timetable PDF and previews results
- [ ] Imported courses persist after refresh
- [ ] Settings dept/level change updates home immediately

### Device / Browser
- [ ] Chrome on Android — layout, touch targets, install prompt
- [ ] Safari on iOS — layout, "Add to Home Screen" works
- [ ] Chrome on desktop — responsive phone shell renders correctly
- [ ] Offline mode — app loads without network after first visit

### Edge Cases
- [ ] File upload with an unsupported format shows an error
- [ ] File upload where Claude returns malformed JSON is handled gracefully
- [ ] Notification toggled on a course that has already passed today → schedules for next week
- [ ] User denies notification permission → UI reflects this, no crash

---

## 12. Timeline

| Week | Milestone |
|---|---|
| 1 | Transcribe all real timetable data into `courses.js` |
| 2 | Onboarding + Home view wired to real data |
| 3 | Settings view + full localStorage persistence |
| 4 | Notifications (permission, scheduling, bell toggle) |
| 5 | AI file upload + Claude API integration |
| 6 | PWA manifest + service worker + deployment |
| 7 | Device testing, bug fixes, final polish |

---

*Last updated: March 2026*
