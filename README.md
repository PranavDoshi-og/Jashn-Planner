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
```
cd backend
pip install -r requirements-dev.txt
pytest
```
19 tests cover budget normalisation, input validation, section regeneration, prompt-injection wrapping, rate limiting, security headers and error leakage. CI (`.github/workflows/ci.yml`) runs them and builds the frontend on every push.

## How this maps to the judging criteria
| Criterion | What the project does |
|---|---|
| Problem alignment | Covers every item in the brief: weddings, birthdays and community events; budgets; timelines; vendor checklists; personalised ideas. |
| Code quality | Typed Pydantic schemas, one place for the prompt, small endpoints, CI. |
| Security | No secrets in the repo (`.env` is git-ignored); input length, range and format limits; per-IP rate limit; user text wrapped as data; Gemini errors logged server-side, never returned; CORS restricted to your frontend; security headers; API docs disabled. |
| Efficiency | One structured call per plan; per-section regeneration instead of re-running everything; budget slider is computed in the browser; gzip; stale requests are cancelled; optional `GEMINI_THINKING_BUDGET=0` for faster Flash responses. |
| Testing | pytest suite and CI above. |
| Accessibility | Labelled fields, skip link, tabs with arrow-key navigation and ARIA roles, live status for loading, error alerts, visible focus, text contrast of 4.5:1 or better, reduced-motion support, data is never colour-only. |

## Submission checklist (deadline 1 Nov 2026, 11:59 PM IST; max 3 submissions)
- [ ] Public GitHub repo, under 10 MB (no `node_modules`, `.venv` or `dist`; the `.gitignore` covers these). Open the link in a private window to confirm it is public.
- [ ] Demo video as an unlisted YouTube link, or a Drive link with access set to anyone with the link. Test it logged out.
- [ ] README has run steps, the architecture, and the criteria table above.
- [ ] No API key anywhere in git history. If one leaked, revoke it and create a new one.
- [ ] Use submission 1 for a working version early, submission 2 for the final, and keep 3 as a spare.
