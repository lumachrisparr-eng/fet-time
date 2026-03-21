/**
 * lib/parseTimetable.ts
 *
 * Parses any timetable file using the Google Gemini API.
 *
 * WHY GEMINI:
 *   - Genuinely free tier: 1,500 requests/day, 15 requests/min
 *   - No credit card required — just a Google account
 *   - Get your key at: https://aistudio.google.com/app/apikey
 *   - Handles PDF, XLSX, CSV, DOCX natively
 *   - gemini-1.5-flash is fast and very capable at structured extraction
 *
 * Drop this at:  src/lib/parseTimetable.ts
 * Then in settings.tsx:
 *   import { parseTimetable, getGeminiKey } from '@/lib/parseTimetable';
 */

import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

// ─── Types (unchanged from before — your app code doesn't need to change) ─────

export type InstitutionType =
  | 'university' | 'secondary' | 'primary'
  | 'corporate'  | 'gym'       | 'conference' | 'other';

export interface ParsedDimension {
  label: string;
  values: (string | number | { code: string; name: string })[];
}

export interface ParsedMeta {
  institution:     string;
  faculty:         string | null;
  abbreviation:    string | null;
  institutionType: InstitutionType;
  grouping: {
    d1: ParsedDimension | null;
    d2: ParsedDimension | null;
  } | null;
}

export interface ParsedCourse {
  code:     string;
  name:     string;
  day:      string;   // "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"
  time:     string;   // "09:00-11:00"
  hall:     string | null;
  lecturer: string | null;
  g1:       string | number | null;
  g2:       string | number | null;
}

export interface ParseResult {
  meta:    ParsedMeta;
  courses: ParsedCourse[];
}

// ─── MIME map ─────────────────────────────────────────────────────────────────

const MIME_MAP: Record<string, string> = {
  pdf:  'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls:  'application/vnd.ms-excel',
  csv:  'text/plain',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc:  'application/msword',
};

// ─── Prompt ───────────────────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `
You are a timetable extraction specialist. 
Analyse the attached schedule document from ANY institution 
(university, secondary school, primary school, gym, corporate, conference, etc.).

Extract every single session and return ONLY a raw JSON object.
No markdown fences. No explanation. No extra text. Just the JSON.

Rules:
- Normalise day names to 3-letter uppercase: MON TUE WED THU FRI SAT SUN
- Normalise times to 24-hour HH:MM-HH:MM (e.g. "09:00-11:00")
- Missing fields → null, never omit the key
- institutionType must be one of: university | secondary | primary | corporate | gym | conference | other
- grouping is null if there are no meaningful filter groups (e.g. a shared gym schedule)
- d2 is null when there is only one filter dimension
- Universities:  d1 = department/faculty,  d2 = year/level
- Schools:       d1 = class/form/grade,    d2 = null
- Conferences:   d1 = track/room,          d2 = null
- "code" = official code if one exists, otherwise a short 2-6 char abbreviation

Required JSON shape:
{
  "meta": {
    "institution":     "string",
    "faculty":         "string or null",
    "abbreviation":    "string or null",
    "institutionType": "university|secondary|primary|corporate|gym|conference|other",
    "grouping": {
      "d1": { "label": "string", "values": ["..."] } or null,
      "d2": { "label": "string", "values": [...]   } or null
    } or null
  },
  "courses": [
    {
      "code":     "string",
      "name":     "string",
      "day":      "MON|TUE|WED|THU|FRI|SAT|SUN",
      "time":     "HH:MM-HH:MM",
      "hall":     "string or null",
      "lecturer": "string or null",
      "g1":       "string|number|null",
      "g2":       "string|number|null"
    }
  ]
}
`.trim();

// ─── Gemini API endpoint ──────────────────────────────────────────────────────
// gemini-1.5-flash: FREE — 15 RPM, 1,500 requests/day, no credit card
const GEMINI_MODEL    = 'gemini-1.5-flash';
const GEMINI_ENDPOINT = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;

// ─── Main function ────────────────────────────────────────────────────────────

/**
 * Parse any timetable file and return structured course data.
 *
 * @param fileUri   Local file URI from DocumentPicker
 * @param fileName  Original filename (used to detect extension)
 * @param apiKey    Gemini API key (free from aistudio.google.com/app/apikey)
 */
export async function parseTimetable(
  fileUri:  string,
  fileName: string,
  apiKey:   string,
): Promise<ParseResult> {

  // ── 1. Validate extension ──────────────────────────────────────────────────
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  const mimeType = MIME_MAP[ext];
  if (!mimeType) {
    throw new Error(
      `".${ext}" is not supported.\nPlease upload a PDF, XLSX, XLS, CSV, or DOCX file.`,
    );
  }

  // ── 2. Read file as base64 ─────────────────────────────────────────────────
  let base64: string;
  try {
    base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: 'base64',
    });
  } catch {
    throw new Error(
      'Could not read the file. Make sure it is accessible and try again.',
    );
  }

  // ── 3. Build Gemini request ────────────────────────────────────────────────
  // Gemini accepts inline file data — no separate upload step needed.
  const requestBody = {
    contents: [
      {
        parts: [
          {
            // The actual file (PDF, spreadsheet, etc.)
            inline_data: {
              mime_type: mimeType,
              data: base64,
            },
          },
          {
            // The instruction
            text: EXTRACTION_PROMPT,
          },
        ],
      },
    ],
    // Ask Gemini to return JSON directly
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0,        // deterministic output — we want exact JSON
      maxOutputTokens: 8192, // enough for large timetables
    },
  };

  // ── 4. Call the API ────────────────────────────────────────────────────────
  let response: Response;
  try {
    response = await fetch(GEMINI_ENDPOINT(apiKey), {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(requestBody),
    });
  } catch {
    throw new Error(
      'Network request failed. Check your internet connection and try again.',
    );
  }

  // ── 5. Handle API-level errors ─────────────────────────────────────────────
  if (!response.ok) {
    let body = '';
    try { body = await response.text(); } catch {}

    if (response.status === 400) {
      // Often means the file is too large or corrupted
      throw new Error(
        'The file could not be processed. It may be too large, password-protected, or corrupted.',
      );
    }
    if (response.status === 403) {
      throw new Error(
        'Invalid or unauthorised API key.\nGet a free key at aistudio.google.com/app/apikey',
      );
    }
    if (response.status === 429) {
      throw new Error(
        'Too many requests. The free tier allows 15 requests/minute.\nWait a moment and try again.',
      );
    }
    throw new Error(`API error ${response.status}. Please try again.`);
  }

  // ── 6. Extract text from Gemini response ───────────────────────────────────
  const data = await response.json();

  // Gemini response shape:
  // { candidates: [{ content: { parts: [{ text: "..." }] } }] }
  const rawText: string =
    data?.candidates?.[0]?.content?.parts
      ?.filter((p: any) => p.text)
      ?.map((p: any) => p.text)
      ?.join('') ?? '';

  if (!rawText) {
    // Check if Gemini blocked the content
    const blockReason = data?.candidates?.[0]?.finishReason;
    if (blockReason === 'SAFETY') {
      throw new Error('The file was blocked by content filters. Try a different file.');
    }
    throw new Error('AI returned an empty response. Please try again.');
  }

  // ── 7. Parse JSON — strip any accidental markdown fences ──────────────────
  // Even with responseMimeType: 'application/json', occasionally fences slip in
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  let parsed: ParseResult;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      'AI returned an unexpected format. Please try again or use a simpler file.',
    );
  }

  // ── 8. Validate shape ──────────────────────────────────────────────────────
  if (!parsed?.meta || !Array.isArray(parsed?.courses)) {
    throw new Error('AI response is missing required fields. Please try again.');
  }
  if (parsed.courses.length === 0) {
    throw new Error(
      'No sessions were found in this file.\nMake sure it is a timetable or schedule document.',
    );
  }

  // ── 9. Sanitise courses — guarantee required fields exist ──────────────────
  parsed.courses = parsed.courses.map(c => ({
    code:     c.code     ?? 'UNK',
    name:     c.name     ?? 'Unknown Session',
    day:      normDay(c.day),
    time:     normTime(c.time),
    hall:     c.hall     ?? null,
    lecturer: c.lecturer ?? null,
    g1:       c.g1       ?? null,
    g2:       c.g2       ?? null,
  }));

  return parsed;
}

// ─── Small normalisers (guards against slightly off AI output) ────────────────

const VALID_DAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

function normDay(day: string | null | undefined): string {
  if (!day) return 'MON';
  const upper = day.toUpperCase().trim().slice(0, 3);
  return VALID_DAYS.includes(upper) ? upper : 'MON';
}

function normTime(time: string | null | undefined): string {
  if (!time) return '00:00-00:00';
  // Accept "09:00-11:00", "9:00 - 11:00", "9.00-11.00", etc.
  const cleaned = time.replace(/\s/g, '').replace(/\./g, ':');
  if (/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/.test(cleaned)) {
    // Pad to HH:MM-HH:MM
    const [start, end] = cleaned.split('-');
    return `${start.padStart(5, '0')}-${end.padStart(5, '0')}`;
  }
  return time; // return as-is if it doesn't match; won't crash the app
}

// ─── API key helper ───────────────────────────────────────────────────────────

/**
 * Reads the Gemini key from Expo Constants (app.config.js → extra).
 *
 * In app.config.js:
 *   extra: { geminiApiKey: process.env.GEMINI_API_KEY }
 *
 * In .env (never commit this file):
 *   GEMINI_API_KEY=AIzaSy...
 */
export function getGeminiKey(): string {
  const key = Constants.expoConfig?.extra?.geminiApiKey as string | undefined;
  if (!key?.trim()) {
    throw new Error(
      'Gemini API key not configured.\n\n' +
      '1. Get a free key at: aistudio.google.com/app/apikey\n' +
      '2. Add to .env:  GEMINI_API_KEY=AIzaSy...\n' +
      '3. In app.config.js → extra: { geminiApiKey: process.env.GEMINI_API_KEY }',
    );
  }
  return key;
}
