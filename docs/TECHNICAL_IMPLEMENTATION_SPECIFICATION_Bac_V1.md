# TECHNICAL IMPLEMENTATION SPECIFICATION — Bac Learning Platform
## V1 — Specificație tehnică executabilă

**Rolul documentului:** sursa tehnică de adevăr pentru implementare.  
**Scop:** transformarea MASTER PROJECT SPECIFICATION V3 într-un plan concret pentru database, auth, storage, frontend, CMS, progres, monetizare și deployment.

---

# 1. Principii tehnice

1. Codul trebuie să rămână portabil și versionat în Git.
2. Builderul/AI-ul este un instrument, nu fundația produsului.
3. Database-ul este sursa de adevăr pentru conținut, acces și progres.
4. Conținutul lecțiilor este modular, prin Lesson Blocks.
5. Orice funcție importantă trebuie să aibă o verificare server-side.
6. Nu introducem servicii plătite dacă funcționalitatea poate fi realizată rezonabil cu infrastructura existentă.
7. Nu construim funcții avansate înainte ca MVP-ul să fie stabil.
8. Orice modificare a schemei database trebuie făcută prin migration.
9. UI-ul folosește componente reutilizabile.
10. AI-ul primește task-uri mici, verificabile.

---

# 2. Stack de referință

## Direcție propusă

- Frontend: React + TypeScript
- Build: Vite sau framework echivalent ales după evaluarea builderului
- Styling: Tailwind CSS
- Backend/database/auth/storage: Supabase
- Database: PostgreSQL
- Payments: Stripe
- Source control: GitHub
- Hosting: Vercel sau alternativă echivalentă
- Media: object storage
- Analytics: soluție privacy-conscious, introdusă după MVP

Aceasta este o arhitectură de referință, nu un contract cu un anumit builder.

---

# 3. Environment

Environment variables:

```text
DATABASE / SUPABASE
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

PAYMENTS
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRO_PRICE_ID

APP
NEXT_PUBLIC_APP_URL
```

Cheile server-side nu trebuie expuse în browser.

---

# 4. Database schema

## 4.1 profiles

```text
id                uuid PK
user_id           uuid UNIQUE NOT NULL
display_name      text
avatar_url        text
created_at        timestamptz
updated_at        timestamptz
```

`user_id` referă utilizatorul din auth.

---

## 4.2 user_roles

```text
id                uuid PK
user_id           uuid NOT NULL
role              enum
created_at        timestamptz
```

Role enum:

```text
student
editor
reviewer
super_admin
```

Un user poate avea mai multe roluri dacă arhitectura finală o permite.

---

## 4.3 subjects

```text
id                uuid PK
slug              text UNIQUE NOT NULL
name              text NOT NULL
short_description text
description       text
icon              text
cover_media_id    uuid NULL
accent_theme      text
sort_order        integer NOT NULL DEFAULT 0
is_published      boolean NOT NULL DEFAULT false
created_at        timestamptz
updated_at        timestamptz
```

---

## 4.4 chapters

```text
id                uuid PK
subject_id        uuid NOT NULL
slug              text NOT NULL
title             text NOT NULL
short_description text
description       text
cover_media_id    uuid NULL
sort_order        integer NOT NULL DEFAULT 0
is_published      boolean NOT NULL DEFAULT false
metadata          jsonb
created_at        timestamptz
updated_at        timestamptz
```

Unique conceptual constraint:

```text
(subject_id, slug)
```

`metadata` permite informații specifice materiei fără coloane inutile.

Exemplu Română:

```json
{
  "author": "Liviu Rebreanu",
  "work": "Ion",
  "work_type": "roman realist obiectiv"
}
```

---

# 5. Lessons

## 5.1 lessons

```text
id                  uuid PK
chapter_id          uuid NOT NULL
slug                text NOT NULL
title               text NOT NULL
short_description   text
estimated_minutes   integer
access_level        enum(free, pro)
status              enum(draft, review, published, archived)
cover_media_id      uuid NULL
sort_order          integer NOT NULL DEFAULT 0
published_at        timestamptz NULL
created_at          timestamptz
updated_at          timestamptz
```

Unique conceptual constraint:

```text
(chapter_id, slug)
```

---

# 6. Lesson Blocks

## 6.1 lesson_blocks

```text
id              uuid PK
lesson_id       uuid NOT NULL
block_type      text NOT NULL
sort_order      integer NOT NULL
content         jsonb NOT NULL
created_at      timestamptz
updated_at      timestamptz
```

Index:

```text
(lesson_id, sort_order)
```

---

# 7. Block JSON schemas

## rich_text

```json
{
  "html": "<p>...</p>"
}
```

Editorul poate păstra rich text într-un format controlat. Nu se acceptă HTML arbitrar provenit din input neverificat.

## heading

```json
{
  "level": 2,
  "text": "Contextul operei"
}
```

## important

```json
{
  "title": "Important",
  "content": "<p>...</p>"
}
```

## remember

```json
{
  "title": "De reținut",
  "items": [
    "Ideea 1",
    "Ideea 2"
  ]
}
```

## definition

```json
{
  "term": "Roman psihologic",
  "definition": "..."
}
```

## image

```json
{
  "media_id": "uuid",
  "caption": "...",
  "alt_text": "..."
}
```

## gallery

```json
{
  "items": [
    {
      "media_id": "uuid",
      "caption": "..."
    }
  ]
}
```

## table

```json
{
  "headers": ["Element", "Explicație"],
  "rows": [
    ["...", "..."]
  ]
}
```

## timeline

```json
{
  "items": [
    {
      "date": "1918",
      "title": "...",
      "description": "..."
    }
  ]
}
```

## map

```json
{
  "media_id": "uuid",
  "caption": "...",
  "alt_text": "..."
}
```

## audio

```json
{
  "media_id": "uuid",
  "title": "Eseu audio",
  "description": "..."
}
```

## video

```json
{
  "media_id": "uuid",
  "title": "...",
  "description": "...",
  "poster_media_id": "uuid"
}
```

## summary

```json
{
  "title": "Pe scurt",
  "items": [
    "Ideea esențială 1",
    "Ideea esențială 2"
  ]
}
```

## hidden_answer

```json
{
  "prompt": "Ion este un roman ...",
  "answer": "realist obiectiv",
  "explanation": "..."
}
```

## quiz

```json
{
  "quiz_id": "uuid"
}
```

---

# 8. Media

## media

```text
id                uuid PK
type              enum(image, audio, video, document)
storage_bucket    text NOT NULL
storage_path      text NOT NULL
filename          text
mime_type         text
size_bytes        bigint
title             text
description       text
alt_text          text
duration_seconds  integer NULL
created_by        uuid
created_at        timestamptz
updated_at        timestamptz
```

Media nu este stocată în database ca binary.

Database păstrează metadata și locația fișierului.

---

# 9. Lesson progress

## lesson_progress

```text
id                uuid PK
user_id           uuid NOT NULL
lesson_id         uuid NOT NULL
status            enum(not_started, in_progress, completed)
progress_percent  integer DEFAULT 0
last_block_id     uuid NULL
started_at        timestamptz NULL
completed_at      timestamptz NULL
updated_at        timestamptz
```

Unique:

```text
(user_id, lesson_id)
```

---

# 10. User activity

## user_activity

```text
id              uuid PK
user_id         uuid NOT NULL
activity_type   text NOT NULL
lesson_id       uuid NULL
metadata        jsonb
created_at      timestamptz
```

Activități MVP:

```text
lesson_opened
lesson_started
lesson_completed
quiz_completed
hidden_answer_revealed
audio_played
video_played
```

Nu înregistrăm excesiv fiecare interacțiune de UI.

---

# 11. Streak

## user_streaks

```text
user_id             uuid PK
current_streak      integer DEFAULT 0
longest_streak      integer DEFAULT 0
last_activity_date  date NULL
updated_at          timestamptz
```

Activitatea eligibilă trebuie să fie activitate de învățare.

---

# 12. Quiz

## quizzes

```text
id              uuid PK
lesson_id       uuid NOT NULL
title           text NOT NULL
description     text
created_at      timestamptz
updated_at      timestamptz
```

## quiz_questions

```text
id              uuid PK
quiz_id         uuid NOT NULL
question_type   text NOT NULL
question        text NOT NULL
explanation     text
metadata        jsonb
sort_order      integer NOT NULL
created_at      timestamptz
```

## quiz_options

```text
id              uuid PK
question_id     uuid NOT NULL
option_text     text NOT NULL
is_correct      boolean NOT NULL
sort_order      integer NOT NULL
```

---

# 13. Quiz attempts

## quiz_attempts

```text
id              uuid PK
user_id         uuid NOT NULL
quiz_id         uuid NOT NULL
score           integer
max_score       integer
completed_at    timestamptz
created_at      timestamptz
```

MVP-ul poate păstra doar rezultatul final.

---

# 14. Subscriptions

## subscriptions

```text
id                       uuid PK
user_id                  uuid NOT NULL
provider                 text NOT NULL
provider_customer_id     text
provider_subscription_id text
plan                     text NOT NULL
status                   text NOT NULL
current_period_start     timestamptz
current_period_end       timestamptz
cancel_at_period_end     boolean DEFAULT false
created_at               timestamptz
updated_at               timestamptz
```

Nu folosim client-side payment status ca sursă de adevăr.

---

# 15. Payment events

## payment_events

```text
id                uuid PK
provider          text
event_id          text UNIQUE
event_type        text
payload           jsonb
processed_at      timestamptz
created_at        timestamptz
```

Scop:
- idempotency;
- debugging;
- audit minimal.

Nu stocăm date de card.

---

# 16. Templates

## lesson_templates

```text
id              uuid PK
name            text NOT NULL
subject_id      uuid NULL
template_type   text NOT NULL
blocks          jsonb NOT NULL
created_at      timestamptz
updated_at      timestamptz
```

Template-uri:

```text
history_lesson
romanian_work_characteristics
romanian_character
romanian_relationship
```

---

# 17. Database relationships

```text
profiles
  └── user

users
  ├── roles
  ├── progress
  ├── activity
  ├── streak
  ├── subscriptions
  └── quiz_attempts

subject
  └── chapters
       └── lessons
            ├── lesson_blocks
            ├── progress
            └── quizzes
                 └── questions
                      └── options

media
  └── referenced by lesson/blocks
```

---

# 18. RLS / security model

### Content Discovery & Access Model

The security model separates **Discovery (Metadata)** from **Content Access (Lesson Blocks & Media)**:

## Public & Non-PRO Users

Can read:
- published subjects;
- published chapters;
- published lesson **metadata** for ALL published lessons (both `free` and `pro` access levels: `id`, `chapter_id`, `slug`, `title`, `short_description`, `estimated_minutes`, `access_level`, `cover_media_id`, `sort_order`, `status`);
- `lesson_blocks` and media for published **FREE** lessons only.

Cannot read:
- `lesson_blocks` for `pro` lessons (enforced strictly by database RLS via `private.is_pro_user(auth.uid())`);
- `media` objects associated with PRO content;
- unpublished lessons (`draft`, `review`, `archived`).

Behavior on `/lesson/:lessonId`:
- Non-PRO opening a PRO lesson receives lesson metadata from database, but `lesson_blocks` query returns 0 rows due to RLS.
- UI renders **PRO Gate / Upgrade CTA** instead of 404.
- 404 is reserved strictly for non-existent lesson IDs in database.

## PRO Users

Can read:
- all published metadata;
- `lesson_blocks` and media for both `free` and `pro` published lessons.

## Student

Can:
- read permitted content;
- read/write own profile;
- read/write own progress;
- read/write own quiz attempts;
- read own subscription.

Cannot:
- modify published content;
- access other users' private data;
- assign own role;
- change own subscription status.

## Editor

Can manage content according to assigned permissions.

## Reviewer

Can review content and change review status.

## Super Admin

Full administrative access.

Service-role keys are server-only.

---

# 19. Authentication flows

## Registration

```text
Register
 ↓
Auth provider
 ↓
Create profile
 ↓
Role = student
 ↓
Dashboard
```

## Login

```text
Login
 ↓
Auth
 ↓
Load profile
 ↓
Dashboard
```

## Password reset

Auth provider handles secure reset.

---

# 20. Route guards

Conceptual guards:

```text
PublicRoute
AuthenticatedRoute
ProRoute
AdminRoute
EditorRoute
ReviewerRoute
```

UI guards are only UX.

Actual access must also be enforced by backend/database policies.

---

# 21. Student route map

```text
/
├── login
├── register
├── pro
├── dashboard
├── catalog
│   └── :subject
├── lesson
│   └── :lessonId
└── settings
```

---

# 22. Admin route map

```text
/admin
├── content
│   ├── :subject
│   ├── :chapter
│   └── :lesson
├── media
├── quizzes
├── users
├── subscriptions
├── analytics
└── settings
```

---

# 23. Dashboard data requirements

Dashboard needs:

1. current user;
2. current streak;
3. latest in-progress lesson;
4. subject progress;
5. recent activities;
6. subscription status.

Do not make six independent blocking requests if data can be aggregated efficiently.

---

# 24. Catalog data requirements

## 24.1. Structură & Mapping Data (Română)

Ierarhia de conținut din baza de date:
```text
Subject (Limba și literatura română)
 └── Chapter = Operă literară
      └── Lesson = Tip de eseu / lecție
```

### Compoziție Titlu și Subtitlu Operă (Chapter)

Datele operei sunt stocate în tabela `chapters`:
- `title`: Titlul operei (ex: `Moara cu noroc`)
- `metadata.author`: Autorul operei (ex: `Ioan Slavici`)
- `metadata.work_type`: Specia sau tipul operei (ex: `Nuvela psihologică`)

Formula de compoziție vizuală în UI:
```ts
const displayTitle = chapter.metadata?.author
  ? `${chapter.title} — ${chapter.metadata.author}`
  : chapter.title;

const displaySubtitle = chapter.metadata?.work_type || chapter.short_description || '';
```

## 24.2. Catalog UX & Expandable Accordion

- Pagina `/catalog/:subject` (ex: `/catalog/romana`) încarcă materia, toate capitolele (operele) și toate lecțiile aferente într-o singură pagină.
- Fiecare operă (Chapter) se randează ca o secțiune Expandable (Accordion):
  - **Collapsed (default)**: Afișează `displayTitle`, `displaySubtitle` și indicatorul Chevron. Lecțiile rămân ascunse.
  - **Expanded**: Afișează lista de lecții atașate (`lessons`), fiecare având titlul, timpul estimat și badge-ul `FREE` sau `PRO 🔒`.
- Click pe lecție efectuează navigare directă către `/lesson/:lessonId`.
- `/catalog/:subject/:chapter` NU este o rută de produs necesară.

## 24.3. Cerințe de Interogare Catalog
- `published` subjects;
- `published` chapters (opere) cu `metadata` (`author`, `work_type`);
- `published` lessons metadata (selectând DOAR câmpurile aprobate: `id, chapter_id, slug, title, short_description, estimated_minutes, access_level, cover_media_id, sort_order, status`);
- discovery permis atât pentru lecțiile `FREE` cât și `PRO 🔒`.

---

# 25. Lesson page data requirements

Initial load:

- lesson metadata;
- chapter;
- subject;
- ordered blocks;
- adjacent lessons;
- access status.

Optional:
- media metadata.

The player should only render if relevant media exists.

---

# 26. Lesson progress behavior

When lesson opens:

```text
if no progress:
    create in_progress
else:
    load progress
```

During reading:
- update progress at meaningful intervals;
- update last block.

At completion:
- status = completed;
- progress = 100;
- completed_at = now;
- update activity;
- update streak.

Do not write to database on every scroll event.

---

# 27. Adjacent lesson navigation

Previous/next are based on:

```text
same chapter
ORDER BY sort_order
```

If at first lesson:
- previous button disabled/hidden.

If at last lesson:
- next button can point to next chapter only if that behavior is explicitly enabled.

MVP recommendation:
keep navigation inside the current chapter.

---

# 28. Admin editor architecture

Editor state:

```text
lesson
 ├── metadata
 └── blocks[]
```

Each block has:

```text
id
type
content
sort_order
```

Editor operations:

```text
addBlock()
updateBlock()
duplicateBlock()
deleteBlock()
moveBlock()
saveDraft()
publish()
```

The UI never directly manipulates database rows in an uncontrolled manner.

---

# 29. Draft / publish behavior

Draft changes should not alter the public published version until Publish.

Recommended V1 implementation:

Option A:
- draft fields in same record;
- publish status controls visibility.

Option B, more robust:
- revisions table.

For MVP, use Option A.

Version history can be added later.

---

# 30. Content validation

Before publishing a lesson:

Required:
- title;
- chapter;
- at least one content block;
- valid block JSON;
- valid referenced media;
- no broken internal references.

Optional:
- estimated duration;
- summary;
- quiz.

---

# 31. Media security

Public assets:
- selected decorative/public assets.

Protected assets:
- PRO audio/video/documents if required.

Use signed URLs for protected media when appropriate.

Never expose service-role credentials.

---

# 32. Payments architecture

## Upgrade

```text
Student
 ↓
PRO page
 ↓
Stripe Checkout
 ↓
Payment
 ↓
Stripe webhook
 ↓
verify event
 ↓
upsert subscription
 ↓
user becomes PRO
```

## Cancellation

```text
Stripe
 ↓
webhook
 ↓
cancel_at_period_end = true
 ↓
access remains until period end
```

Actual entitlement logic uses the subscription state and period.

---

# 33. ProGate

When FREE user accesses PRO lesson:

Show:
- lesson title;
- selected preview if available;
- explanation;
- PRO benefits;
- CTA.

Do not send full protected lesson content to the browser and merely blur it.

---

# 34. Learning system architecture

MVP:

```text
hidden_answer
quiz
lesson completion
```

Future:
- spaced repetition;
- adaptive review;
- mastery score.

The schema must not prevent future additions.

---

# 35. Search architecture

MVP:
- PostgreSQL queries.

Future:
- PostgreSQL full text;
- trigram;
- ranking;
- filters.

Search results should return:
- type;
- title;
- parent subject;
- parent chapter;
- access level.

---

# 36. Design tokens

Initial conceptual tokens:

```text
--background
--surface
--surface-elevated
--text
--text-muted
--border
--accent
--success
--warning
--danger
```

Spacing:
- 4px base rhythm.

Radius:
- small;
- medium;
- large;
- pill.

Effects:
- subtle glow;
- elevated shadow;
- backdrop blur.

Do not hardcode dozens of arbitrary values.

---

# 37. Component architecture

```text
components/
  ui/
  layout/
  content/
  lesson/
  dashboard/
  catalog/
  admin/
  media/
```

Examples:

```text
ui/Button
ui/Card
ui/Modal

lesson/LessonRenderer
lesson/LessonBlock
lesson/LessonOutline
lesson/LessonNavigation

catalog/SubjectCard
catalog/ChapterCard
catalog/LessonCard

admin/LessonEditor
admin/BlockEditor
admin/MediaLibrary
```

---

# 38. State management

Avoid global state unless necessary.

Use:
- server/database state through a data-fetching layer;
- local component state for editor interactions;
- auth context/session provider;
- minimal global UI state.

Do not put all database data in one giant global store.

---

# 39. Error handling

Every data operation should handle:

- loading;
- success;
- empty;
- unauthorized;
- forbidden;
- not found;
- server error.

User-facing errors should be understandable.

Technical errors go to logs.

---

# 40. Logging

Log:
- server errors;
- payment webhook failures;
- authentication failures where appropriate;
- publish failures.

Do not log:
- passwords;
- auth tokens;
- payment secrets;
- unnecessary personal data.

---

# 41. Testing strategy

## Minimum

Unit tests:
- access rules;
- progress calculations;
- streak calculations;
- block validation.

Integration:
- auth;
- lesson loading;
- PRO access;
- admin publishing;
- Stripe webhook.

E2E:
- register → dashboard → catalog → lesson;
- FREE → PRO gate;
- admin → create lesson → publish → student sees it.

---

# 42. Seed data

Development environment should include:

Subject:
- Istorie
- Română

Chapters:
- at least one per subject.

Lessons:
- at least two per chapter.

Blocks:
- text;
- important;
- remember;
- summary;
- hidden answer.

Seed data is fictional/test content unless real material has been approved.

---

# 43. Migration strategy

Every database change:

```text
create migration
 ↓
apply locally
 ↓
test
 ↓
commit migration
 ↓
deploy
```

Never edit production schema manually as the normal workflow.

---

# 44. Git strategy

Branches:

```text
main
develop (optional)
feature/*
fix/*
```

Small commits.

Commit messages should describe the change.

Example:

```text
feat: add lesson block editor
fix: prevent free users from loading pro content
```

---

# 45. AI coding protocol

Every AI coding session starts with:

1. project context;
2. relevant specification;
3. exact task;
4. constraints;
5. files allowed to change;
6. acceptance criteria.

AI must not:
- rewrite unrelated files;
- replace architecture without permission;
- install unnecessary packages;
- remove security policies;
- bypass RLS;
- hardcode secrets.

---

# 46. Acceptance criteria for first technical milestone

Milestone 1 is complete when:

- project runs locally;
- Git repository exists;
- Supabase project connected;
- auth works;
- profile is created;
- roles exist;
- subjects/chapters/lessons tables exist;
- RLS is enabled;
- one published lesson can be read;
- one protected lesson cannot be read by a FREE user.

---

# 47. MVP build order

## Step 1
Repository + project foundation.

## Step 2
Supabase + auth.

## Step 3
Database schema + migrations + RLS.

## Step 4
Admin content CRUD.

## Step 5
Lesson block editor.

## Step 6
Student catalog.

## Step 7
Lesson renderer.

## Step 8
Progress.

## Step 9
Dashboard.

## Step 10
FREE/PRO.

## Step 11
Stripe.

## Step 12
Learning blocks + quiz.

## Step 13
Media polish.

## Step 14
Responsive + accessibility.

## Step 15
Testing + deployment.

---

# 48. Content import pipeline

After CMS is stable:

```text
Source PDF
 ↓
Extract text
 ↓
Identify chapter
 ↓
Identify lessons
 ↓
Structure content
 ↓
Generate block proposal
 ↓
Human verification
 ↓
Admin import/draft
 ↓
Preview
 ↓
Publish
```

AI should not invent missing content.

---

# 49. Cost minimization strategy

Priorities:

1. Use free tiers during development.
2. Avoid unnecessary SaaS dependencies.
3. Store structured content in PostgreSQL.
4. Use object storage for media.
5. Generate only required AI output.
6. Keep services replaceable.
7. Do not pay for a tool solely because it generates code faster.
8. Measure usage before upgrading.

Multiple accounts should not be used to evade a provider's terms or limits. If a provider explicitly permits multiple accounts/workspaces, they can be considered as part of the cost strategy.

---

# 50. Deployment environments

At minimum:

```text
local
production
```

Preferred later:

```text
local
staging
production
```

Do not test destructive database changes directly in production.

---

# 51. Backup strategy

Before launch:

- database backup strategy;
- media backup strategy;
- Git repository backup;
- recovery procedure.

The project must not depend on a single machine or AI conversation.

---

# 52. Launch checklist

## Product
- [ ] Landing
- [ ] Auth
- [ ] Dashboard
- [ ] Catalog
- [ ] Lessons
- [ ] Admin
- [ ] FREE/PRO
- [ ] Payments

## Content
- [ ] Istorie initial
- [ ] Română initial
- [ ] Content reviewed

## Technical
- [ ] RLS
- [ ] backups
- [ ] error handling
- [ ] responsive
- [ ] accessibility
- [ ] analytics
- [ ] monitoring

## Legal
- [ ] Privacy
- [ ] Terms
- [ ] cookies/consent as required
- [ ] account deletion

---

# 53. What is intentionally postponed

- native mobile app;
- advanced spaced repetition;
- AI tutor;
- social features;
- forum;
- leaderboard;
- complex gamification;
- collaborative editing;
- advanced video infrastructure;
- multi-tier subscriptions;
- advanced recommendation engine.

---

# 54. Immediate next phase

The technical specification is now sufficiently defined to move to:

## BUILDER / STACK EVALUATION

We need to compare current tools based on:

- free tier;
- monthly limits;
- quality of generated React/TypeScript;
- Supabase integration;
- GitHub;
- custom backend logic;
- Stripe;
- ease of continuing manually;
- AI context handling;
- lock-in;
- ability to use Claude/other models;
- deployment;
- total cost.

Only after that do we choose the implementation environment.

---

# 55. First implementation prompt structure

The first prompt given to a coding AI should NOT ask for the whole application.

It should request only:

1. project initialization;
2. routing;
3. design tokens;
4. basic layout;
5. Supabase client setup;
6. environment variable placeholders;
7. no fake production data;
8. no payment implementation;
9. no full admin implementation.

Then the project is checked before moving to database/auth.

---

# 56. Final implementation principle

The project should be built as a sequence of small, reversible, testable steps.

The target is not:

> “Make the entire app.”

The target is:

> “Build the next verified piece of the app without damaging what already works.”

That is the core rule for the vibe-coding workflow.
