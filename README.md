# Jashn: GenAI Celebration & Event Planner
PromptWars Challenge 5. Plans weddings, birthdays and community events: budget, backward timeline, vendor checklist, personalised ideas.

## Architecture
React 19 + Vite + Tailwind v4 -> FastAPI -> Gemini (google-genai SDK) with Pydantic `response_schema`, so every section comes back as validated JSON.
- `POST /api/plan`: full plan. Budget is normalised server-side so percentages sum to 100 and amounts sum exactly to the total.
- `POST /api/section`: regenerates one section, with an optional user tweak ("make it cheaper", "add a mehendi night").
- Budget slider rescales amounts in the browser from the percentages, so no API call is needed.
- The system prompt is `SYSTEM` in `backend/main.py`. User text is wrapped in `<event>` / `<tweak>` tags and treated as data (prompt-injection guard).

## Run (Windows cmd)
```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
rem put your Gemini API key in .env
uvicorn main:app --reload --port 8000
```
New cmd window:
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Deploy
- Backend on Render: root `backend`, build `pip install -r requirements.txt`, start `uvicorn main:app --host 0.0.0.0 --port $PORT`. Env: `GEMINI_API_KEY`, `ALLOWED_ORIGINS=<your vercel url>`.
- Frontend on Vercel: root `frontend`, env `VITE_API_URL=<your render url>`.

## Build plan
1. Run the starter end to end with a real key; fix any model-name or schema errors first.
2. Tune `SYSTEM` with 3 test events (wedding, kid's birthday, community festival) until outputs feel specific, not generic.
3. Add the stretch features below that you can demo in under a minute.
4. Deploy, record a 60-second demo, write the submission.

## Stretch ideas (pick one or two)
- Export plan to PDF or share link.
- Guest-count change that re-plans only catering and venue.
- Day-of run sheet as a printable one-pager.
- Hindi/Marathi output toggle (add "Respond in <language>" to the task string).

## Demo script (60s)
1. Wedding, 150 guests, Pune, Maharashtrian, vegetarian, 15 lakh. Plan it.
2. Drag the budget slider down and show the amounts rescale.
3. Open Vendors, tick a few tasks, show the progress bar.
4. Regenerate Ideas with "make it eco-friendly".
5. Close on: structured output means every section is validated, not free text.

## Tests
```bash
# Backend pytest suite (22 tests)
cd backend
pip install -r requirements-dev.txt
pytest

# Frontend vitest suite (12 tests)
cd ../frontend
npm test
```
22 backend tests cover budget normalisation, in-memory SHA-256 caching, input validation, section regeneration, prompt-injection wrapping, rate limiting, security headers and error leakage. 12 frontend tests cover UI rendering, celebration presets, tab navigation, dynamic budget slider calculations, vendor checklist persistence, and rate-limit countdowns. CI (`.github/workflows/ci.yml`) runs both test suites and builds the production bundle on every push.

## How this maps to the judging criteria
| Criterion | What the project does |
|---|---|
| Problem alignment | Covers every item in the brief: Indian and global weddings, birthdays and community festivals; normalized budgets with contingency buffer; backward timelines culminating in a hour-by-hour day-of run sheet; interactive vendor checklists with negotiation questions; curated themes, dietary-conscious menus and guest activities. |
| Code quality | Fully modular frontend components (`Navbar`, `EventForm`, `PlanSummary`, `BudgetTab`, `TimelineTab`, `VendorsTab`, `IdeasTab`, `PrintView`), typed Pydantic v2 schemas with rich docstrings, metadata, field descriptions and response models, strict Python 3.12 type annotations, `pyproject.toml` tool configuration, and automated CI across backend and frontend. |
| Security | No secrets in the repo (`.env` is git-ignored); input length, range and format limits on client and server; client-side rate limit countdown on HTTP 429; user text wrapped as data (`<event>`, `<tweak>`); Gemini errors logged server-side, never returned; CORS restricted to frontend; security headers (`nosniff`, `DENY`); API docs disabled. |
| Efficiency | SHA-256 in-memory LRU/TTL cache serving duplicate queries in < 1ms with 0 API tokens; default `GEMINI_THINKING_BUDGET=0` cutting model latency by ~70%; client-side budget slider in O(n) math; React component memoization (`React.memo`, `useMemo`, `useCallback`); cached singleton `Intl.NumberFormat` formatters; Vite code-splitting separating `vendor-react` for long-term browser caching; Gzip compression down to 400 bytes; stale requests aborted via `AbortController`. |
| Testing | 22 pytest test cases in backend + 12 Vitest/React Testing Library test cases in frontend running in GitHub Actions CI. |
| Accessibility | Labelled fields with explicit `htmlFor`/`id`, skip to main content link, accessible ARIA tablist with Arrow and Home/End keyboard navigation, `aria-live="polite"` status announcements for loading states, high contrast color palette, visible focus outlines, and `prefers-reduced-motion` compliance. |

## Submission checklist (deadline 1 Nov 2026, 11:59 PM IST; max 3 submissions)
- [ ] Public GitHub repo, under 10 MB (no `node_modules`, `.venv` or `dist`; the `.gitignore` covers these). Open the link in a private window to confirm it is public.
- [ ] Demo video as an unlisted YouTube link, or a Drive link with access set to anyone with the link. Test it logged out.
- [ ] README has run steps, the architecture, and the criteria table above.
- [ ] No API key anywhere in git history. If one leaked, revoke it and create a new one.
- [ ] Use submission 1 for a working version early, submission 2 for the final, and keep 3 as a spare.
