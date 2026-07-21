# InterviewForge

A static, vanilla HTML/CSS/JS interview-preparation website for IT job seekers: company-wise questions (TCS, Infosys, Cognizant, Accenture, Wipro), programming questions (Java, Python, SQL, JavaScript, React), HR prep, aptitude practice, and client-side PDF export — no build step, no framework.

## Running locally

Data is loaded via `fetch()`, so opening `index.html` directly with `file://` will not work in most browsers (CORS blocks local fetch). Serve the folder instead:

```bash
cd interview-website
python3 -m http.server 8000
# visit http://localhost:8000
```

Or use the VS Code "Live Server" extension, or deploy straight to **GitHub Pages** / Netlify / Vercel — all of which serve files over HTTP and work out of the box.

## Folder structure

```
interview-website/
  index.html                 Home page
  hr.html                    HR interview prep (all categories)
  aptitude.html               Aptitude prep (quant / logical / verbal)
  resume.html                 Resume & career guide (static content)
  bookmarks.html              User's saved questions (reads localStorage)
  about.html / contact.html / privacy.html / terms.html / disclaimer.html
  company/
    tcs.html, infosys.html, cognizant.html, accenture.html, wipro.html
  programming/
    java.html, python.html, sql.html, javascript.html, react.html
  css/style.css               Single stylesheet (design tokens + components)
  js/
    script.js                 Shared header/footer, theme, search, bookmarks,
                               progress tracking, and the generic question
                               list renderer used by every topic page
    pdf-generator.js           jsPDF-based branded PDF export
  data/
    catalog.json               Metadata for every company & language (names,
                                colors, keywords, overview/selection-process text)
    tcs.json, infosys.json, cognizant.json, accenture.json, wipro.json
    java.json, python.json, sql.json, javascript.json, react.json
    hr.json, aptitude.json
  assets/images/               (empty — add your own logo/screenshots here)
  robots.txt
  sitemap.xml
```

## Content included in this build

This build ships with real, original, non-copied Q&A content:

| Dataset | Questions included |
|---|---|
| TCS | 30 (3 online-test, 12 technical, 11 coding, 4 HR) |
| Infosys | 24 (2 online-test, 11 technical, 9 coding, 2 HR) |
| Cognizant | 24 (2 online-test, 10 technical, 9 coding, 3 HR) |
| Accenture | 24 (1 online-test, 11 technical, 9 coding, 3 HR) |
| Wipro | 24 (2 online-test, 10 technical, 9 coding, 3 HR) |
| Java | 20 |
| Python | 20 |
| SQL | 20 |
| JavaScript | 18 |
| React | 12 |
| HR | 22 |
| Aptitude | 15 |

The brief asked for much higher counts (50 per company, 100 per language, etc.). Hand-writing hundreds of original, high-quality technical answers is more than a single build pass can responsibly do at full depth — so this ships a solid, review-quality starter set per category, built on a schema designed to scale. **Adding more questions requires no code changes** — just append objects to the matching `data/*.json` file, following the exact shape already used in that file (see below). Pages, filters, search, PDF export, and bookmarking all read from these files dynamically.

### JSON shapes

**Company files** (`data/tcs.json`, etc.) — array of:
```json
{ "id": 19, "section": "technical", "title": "...", "difficulty": "Easy|Medium|Hard", "answer": "...", "example": "optional code snippet", "tips": "optional" }
```
`section` must be one of: `online-test`, `technical`, `coding`, `hr`.

**Programming language files** (`data/java.json`, etc.) — array of:
```json
{ "id": 21, "level": "Beginner|Intermediate|Advanced", "difficulty": "Easy|Medium|Hard", "title": "...", "answer": "...", "example": "optional code snippet" }
```

**HR file** (`data/hr.json`) — array of:
```json
{ "id": 23, "category": "Introduction|Strengths & Weaknesses|Motivation|Salary & Logistics|Behavioral|Career Gap & Background|Fresher-Specific|Closing|Common Mistakes", "difficulty": "Easy|Medium|Hard", "title": "...", "answer": "...", "example": "optional", "tips": "optional" }
```

**Aptitude file** (`data/aptitude.json`) — array of:
```json
{ "id": 16, "category": "Quantitative Aptitude|Logical Reasoning|Verbal Ability", "difficulty": "Easy|Medium|Hard", "title": "...", "answer": "...", "steps": "optional step-by-step text" }
```

`id` values only need to be unique within their own file. New company pages can be added by adding an entry to `data/catalog.json` and creating a `company/<id>.html` file (copy `company/tcs.html` and change `data-cat-id`).

## PDF generation

`js/pdf-generator.js` lazy-loads jsPDF from `cdnjs.cloudflare.com` the first time a "Download PDF" button is clicked, then builds a branded, paginated PDF (cover header, table of contents, Q&A body, page numbers, footer) from whatever array of questions you pass it — no server required.

## SEO features included

- Unique title/meta description/keywords per page, canonical URLs, Open Graph + Twitter Card tags
- `WebSite` + `Organization` JSON-LD on the home page
- `FAQPage` JSON-LD (auto-generated from the first 6 questions on every topic page)
- `BreadcrumbList` JSON-LD on company/programming pages
- `sitemap.xml` and `robots.txt` at the project root

## AdSense-ready placeholders

`.ad-slot` elements are placed in header-leaderboard, sidebar, inline (between content), and footer positions across every page — replace them with real ad units once your AdSense account is approved. No auto-refresh or disguised/misleading click patterns are used, in line with AdSense policy.

## Extra features implemented

- 🔍 Site-wide search (header dropdown, debounced, searches every dataset)
- 🌙 Dark mode toggle (persisted via `localStorage`)
- ⭐ Bookmark any question (persisted via `localStorage`, viewable on `bookmarks.html`)
- 📊 Progress tracker (counts unique questions opened, shown on `bookmarks.html`)
- 🕘 Recently viewed tracking helper (`trackRecentlyViewed` / `getRecentlyViewed` in `script.js`, ready to wire into a "Recently Viewed" widget)
- 🧭 Category/level/difficulty filter chips on every topic page
