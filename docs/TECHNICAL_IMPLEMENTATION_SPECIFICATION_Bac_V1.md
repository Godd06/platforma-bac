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

## 9.1. Schema & Constraints `lesson_progress`

`lesson_progress` este sursa unică de adevăr pentru parcursul individual al fiecărui elev prin conținutul educațional.

```text
id                uuid PK DEFAULT gen_random_uuid()
user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
lesson_id         uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE
status            text NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed'))
progress_percent  integer NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100)
last_block_id     uuid NULL
started_at        timestamptz NULL
completed_at      timestamptz NULL
updated_at        timestamptz NOT NULL DEFAULT now()
```

Constraints & Indexes:
```text
UNIQUE (user_id, lesson_id)
INDEX (user_id, status, updated_at DESC)
```

## 9.2. Reguli de Actualizare a Progresului & Validare Server-Side

- **Drepturi Client:** Utilizatorul autentic își poate citi și transmite propriul progres (`user_id = auth.uid()`).
- **Reguli Obligatorii de Validare Server-Side:**
  1. `user_id = auth.uid()` — verificat strict; utilizatorul nu poate citi sau modifica progresul altui elev;
  2. `lesson_id` aparține unei lecții existente și accesibile conform statutului de abonament;
  3. `progress_percent` este în intervalul [0, 100];
  4. Tranzițiile de stare sunt canonice (`not_started` $\rightarrow$ `in_progress` $\rightarrow$ `completed`);
  5. `last_block_id` aparține lecției respective;
  6. `completed_at` este setat doar la finalizarea validă a conținutului relevant.
- **Interdicție Antifraudă:** Clientul **NU** poate falsifica o lecție completată transmițând direct un payload arbitrar (`status: 'completed', progress_percent: 100`) fără validarea contextului educațional pe server.
- **Inițiere:** Când utilizatorul deschide lecția și începe derularea/interacțiunea, dacă nu există o înregistrare anterioară, se creează un rând cu `status = 'in_progress'`, `started_at = now()`, `progress_percent = 0`.
- **Actualizare pe parcurs:** Pe măsură ce utilizatorul parcurge blocurile, `last_block_id` se actualizează, iar `progress_percent` este recalculat debounced pe baza procentului de blocuri parcurse.
- **Finalizare (`completed`):** Când utilizatorul ajunge la sfârșitul lecției sau apasă acțiunea explicită de finalizare, serverul marchează `status = 'completed'`, `progress_percent = 100`, `completed_at = now()`. Această tranziție declanșează scrierea server-side în `user_activity` și apelarea Streak Engine-ului.
- **Interdicție:** Simpla deschidere a paginii de lecție **NU** marchează lecția ca `completed`.

---

# 10. User activity

## 10.1. Schema & Reguli de Securitate `user_activity`

Tabela `user_activity` păstrează un jurnal structurat al acțiunilor semnificative ale utilizatorului pentru istoric, dashboard și analytics.

```text
id              uuid PK DEFAULT gen_random_uuid()
user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
activity_type   text NOT NULL
lesson_id       uuid NULL REFERENCES lessons(id) ON DELETE SET NULL
metadata        jsonb DEFAULT '{}'::jsonb
created_at      timestamptz NOT NULL DEFAULT now()
```

Index:
```text
INDEX (user_id, created_at DESC)
```

### Reguli de Securitate & RLS:
- **READ:** Studentul poate executa `SELECT` **DOAR** pentru propriile sale activități (`WHERE user_id = auth.uid()`).
- **WRITE:** Studentul **NU are permisiuni de `INSERT`, `UPDATE` sau `DELETE` direct din client**.
- Evenimentele de activitate sunt create **exclusiv de logica server-side / trusted application flow** în urma validării unor acțiuni reale (ex: finalizare lecție, trimitere quiz). Clientul nu poate trimite direct `activity_type = 'lesson_completed'`.

## 10.2. Tipuri de Activități & Prioritizare UI

| Activity Type | Semnificație | Inclus în Dashboard Recent Activity? |
| :--- | :--- | :--- |
| `lesson_completed` | Lecție finalizată integral | **DA (Prioritate 1)** |
| `quiz_completed` | Quiz de verificare parcurs cu scor | **DA (Prioritate 2)** |
| `lesson_started` / `lesson_progress` | Începere lecție sau milestone de progres | **DA (Prioritate 3)** |
| `hidden_answer_revealed` / `self_assessment` | Autoevaluare „Știam” / „Mai trebuie să repet” | **DA (Prioritate 4)** |
| `audio_played` / `video_played` | Audiere / vizionare multimedia | **DA (Opțional)** |
| `lesson_opened` | Navigare la pagina lecției (telemetrie internă) | **NU (Filtrat din Dashboard UI)** |

---

# 11. Streak

## 11.1. Schema & Reguli de Securitate `user_streaks`

Tabela `user_streaks` monitorizează continuitatea zilnică a învățării.

```text
user_id             uuid PK REFERENCES auth.users(id) ON DELETE CASCADE
current_streak      integer NOT NULL DEFAULT 0
longest_streak      integer NOT NULL DEFAULT 0
last_activity_date  date NULL
updated_at          timestamptz NOT NULL DEFAULT now()
```

### Reguli de Securitate & RLS:
- **READ:** Studentul poate executa `SELECT` **DOAR** pentru propriul rând de streak (`WHERE user_id = auth.uid()`).
- **WRITE:** Studentul **NU are permisiuni de `INSERT`, `UPDATE` sau `DELETE` direct din client**.
- `user_streaks` este gestionat și actualizat **exclusiv server-side de către Streak Engine** la validarea unei activități eligibile. Utilizatorul nu poate manipula valorile `current_streak`, `longest_streak` sau `last_activity_date`.

## 11.2. Algoritmul Canonic de Calcul al Streak-ului (Server-Side)

1. **Eligibilitate:** Doar activitățile de învățare efectivă (`progress_percent` actualizat, `lesson_completed`, `quiz_completed`, autoevaluare `hidden_answer`) sunt considerate activități eligibile. Autentificarea sau simpla navigare sunt ignorate.
2. **Logica de Calcul:**
```ts
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

if (streak.last_activity_date === today) {
  // Idempotență: activitatea pe ziua de azi a fost deja contorizată. Nu incrementăm.
  return streak;
} else if (streak.last_activity_date === yesterday) {
  // Ziua precedentă este activă -> continuăm seria
  const newCurrent = streak.current_streak + 1;
  const newLongest = Math.max(streak.longest_streak, newCurrent);
  return { current_streak: newCurrent, longest_streak: newLongest, last_activity_date: today };
} else {
  // Seria a fost întreruptă sau este prima activitate -> reset / start la 1
  return { current_streak: 1, longest_streak: Math.max(streak.longest_streak, 1), last_activity_date: today };
}
```

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

> [!IMPORTANT]
> **CANONICAL PRINCIPLE**: **EDUCATIONAL CONTENT REQUIRES AUTHENTICATION**
> Access to any educational route (`/catalog`, `/catalog/:subject`, `/lesson/:lessonId`) or database query on educational tables (`subjects`, `chapters`, `lessons`, `lesson_blocks`, `media`) requires valid authentication. Unauthenticated requests (ANON/Guest) are DENIED both at router level and database RLS level.

## 1. Unauthenticated Users (ANON / Guest)
Can read:
- Public marketing & auth assets/routes only (`/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/pro`).

Cannot read:
- Educational content tables (`subjects`, `chapters`, `lessons`, `lesson_blocks`, `media`). Access is DENIED by RLS.

## 2. Authenticated Non-PRO Users (Student Standard)
Can read:
- Published `subjects` and `chapters`;
- Published lesson **metadata** for ALL published lessons (`id, chapter_id, slug, title, short_description, estimated_minutes, access_level, cover_media_id, sort_order, status`) to enable authenticated catalog discovery;
- `lesson_blocks` and media for published **FREE** lessons only.

Cannot read:
- `lesson_blocks` for `pro` lessons (enforced strictly by database RLS via `private.is_pro_user(auth.uid())`);
- `media` objects associated with PRO content;
- Unpublished lessons (`draft`, `review`, `archived`).

Behavior on `/lesson/:lessonId`:
- Authenticated Non-PRO student opening a PRO lesson receives lesson metadata from database, but `lesson_blocks` query returns 0 rows due to RLS.
- UI renders **PRO Gate / Upgrade CTA** instead of 404.
- 404 is reserved strictly for non-existent lesson IDs in database.

## 3. Authenticated PRO Users
Can read:
- All published metadata;
- `lesson_blocks` and media for both `free` and `pro` published lessons.

## Student (Authenticated)

Can:
- read permitted educational content (all published metadata, FREE lesson blocks);
- read/write **own profile** (`user_id = auth.uid()`);
- read/write **own lesson progress** (`user_id = auth.uid()`, supus validării de context pe server);
- read-only **own streak** (`user_id = auth.uid()`, scrierile sunt gestionate exclusiv server-side);
- read-only **own user activity** (`user_id = auth.uid()`, scrierile sunt gestionate exclusiv server-side);
- read/write **own quiz attempts** (`user_id = auth.uid()`);
- read **own subscription status** (`user_id = auth.uid()`).

Cannot:
- executa operațiuni directe de `INSERT`, `UPDATE` sau `DELETE` din client pe `user_streaks` sau `user_activity`;
- falsifica progresul sau finalizarea unei lecții fără validare pe server;
- citi sau modifica înregistrările de progres, streak, activitate sau profil ale altor utilizatori (izolare strictă RLS pe `user_id = auth.uid()`);
- modifica conținutul educațional publicat;
- accesa blocurile de conținut `lesson_blocks` ale lecțiilor PRO fără abonament activ;
- modifica propriul rol sau statutul de abonament în mod direct.

### Progress & Dashboard Authorization Guarantee
- **Model de date & RLS:**
  - `lesson_progress`: READ/WRITE own data (cu validare strictă server-side a tranzițiilor de stare și a procentajelor);
  - `user_activity`: READ own data, WRITE server-side only (generat în trusted flow);
  - `user_streaks`: READ own data, WRITE server-side only (gestionat de Streak Engine);
  - Acces la datele altor utilizatori: **COMPLET INTERZIS (ZERO ACCESS)**.
- Calculele de Global Progress și Subject Progress sunt efectuate pe baza metadatelor lecțiilor publicate (`lessons.status = 'published'`) și a propriilor înregistrări din `lesson_progress`.
- Numărarea lecțiilor PRO publicate în cadrul numitorului nu expune conținutul lor intern (`lesson_blocks`) sau media privată.
- RLS-ul PostgreSQL este și rămâne sursa principală, de neocolit, de autorizare server-side.

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
PublicRoute (/, /login, /register, /forgot-password, /reset-password, /pro)
AuthenticatedEducationalRoute (/catalog, /catalog/:subject, /lesson/:lessonId)
AuthenticatedStudentRoute (/dashboard, /settings)
ProRoute (PRO lesson blocks & PRO media access)
AdminRoute (/admin/*)
EditorRoute (/admin/content)
ReviewerRoute (/admin/content read-only)
```

UI guards are only UX.

Actual access must also be enforced by backend/database policies (Supabase RLS).

---

# 21. Student route map

```text
Public Routes (Unauthenticated):
/
├── login
├── register
├── forgot-password
├── reset-password
└── pro

Protected Educational Routes (Requires Auth):
/catalog
├── :subject
└── /lesson/:lessonId

Protected Student Routes (Requires Auth):
/dashboard
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

# 23. Dashboard data requirements & contracts

## 23.1. Arhitectură Agregată de Interogare (`useDashboardData`)

Pentru a evita multiple cereri succesive de tip waterfall și a garanta un timp rapid de randare (`LCP < 1.2s`), Dashboard-ul apelează o funcție centralizată de agregare sau rulează interogări paralele optimizate (`Promise.all`):

```ts
interface DashboardData {
  profile: Profile;
  continueLearning: ContinueLearningItem | null;
  globalProgress: {
    completedLessons: number;
    totalPublishedLessons: number;
    progressPercent: number; // Math.round((completed / total) * 100)
  };
  subjectProgress: Array<{
    subjectId: string;
    subjectName: string;
    subjectSlug: string;
    accentTheme: string;
    completedLessons: number;
    totalPublishedLessons: number;
    progressPercent: number;
    proLessonsCount: number;
  }>;
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string | null;
  };
  recentActivity: Array<UserActivityItem>;
  subscription: {
    isPro: boolean;
    plan: 'free' | 'pro';
    status: string;
  };
}
```

---

## 23.2. Contract de Date: Continue Learning

### Sursă de Adevăr & Selecție Canonică
Continue Learning selectează **cea mai recentă lecție cu `status = 'in_progress'`** a elevului autentificat:

```sql
SELECT
  lp.lesson_id,
  lp.progress_percent,
  lp.last_block_id,
  lp.updated_at,
  l.title AS lesson_title,
  l.slug AS lesson_slug,
  l.access_level,
  c.id AS chapter_id,
  c.title AS chapter_title,
  c.metadata AS chapter_metadata,
  s.id AS subject_id,
  s.name AS subject_name,
  s.slug AS subject_slug
FROM lesson_progress lp
JOIN lessons l ON l.id = lp.lesson_id
JOIN chapters c ON c.id = l.chapter_id
JOIN subjects s ON s.id = c.subject_id
WHERE lp.user_id = auth.uid()
  AND lp.status = 'in_progress'
  AND l.status = 'published'
ORDER BY lp.updated_at DESC
LIMIT 1;
```

### Reguli de Randare:
- **Dacă există rezultat:** Se randează `ContinueLearningCard` cu toate detaliile (materie, operă/capitol, titlu lecție, progres curent, buton CTA către `/lesson/:lessonId`).
- **Dacă returnează 0 rânduri (Empty State):**
  - **INTERZIS:** Nu se randează un card gol, nu se selectează prima lecție arbitrară din catalog ca fallback.
  - **OBLIGATORIU:** Se randează `EmptyState` stilizat ("Începe pregătirea pentru Bac! Alege o materie din catalog.") cu CTA primar către `/catalog`.

---

## 23.3. Contract de Date: Global Progress

### Formula Canonică
$$\text{Global Progress (\%)} = \text{round}\left( \frac{\text{Lecții publicate cu status 'completed' ale utilizatorului}}{\text{Total lecții publicate pe platformă (FREE + PRO)}} \times 100 \right)$$

### Interogare Denominator (Total Published Lessons):
```sql
SELECT COUNT(*)::int AS total_published
FROM lessons
WHERE status = 'published';
```
*(Include atât lecțiile `free` cât și lecțiile `pro`)*.

### Interogare Numerator (User Completed Lessons):
```sql
SELECT COUNT(*)::int AS completed_count
FROM lesson_progress lp
JOIN lessons l ON l.id = lp.lesson_id
WHERE lp.user_id = auth.uid()
  AND lp.status = 'completed'
  AND l.status = 'published';
```

---

## 23.4. Contract de Date: Progress by Subject

Pentru fiecare materie publicată (`subjects.is_published = true`):

### Formula Canonică
$$\text{Subject Progress (\%)} = \text{round}\left( \frac{\text{Lecții completate din materie}}{\text{Total lecții publicate din materie (FREE + PRO)}} \times 100 \right)$$

### Interogare Date Materie:
```sql
SELECT
  s.id AS subject_id,
  s.name AS subject_name,
  s.slug AS subject_slug,
  s.accent_theme,
  COUNT(l.id)::int AS total_lessons,
  COUNT(l.id) FILTER (WHERE l.access_level = 'pro')::int AS pro_lessons,
  COUNT(lp.id) FILTER (WHERE lp.status = 'completed')::int AS completed_lessons
FROM subjects s
JOIN chapters c ON c.subject_id = s.id AND c.is_published = true
JOIN lessons l ON l.chapter_id = c.id AND l.status = 'published'
LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = auth.uid()
WHERE s.is_published = true
GROUP BY s.id, s.name, s.slug, s.accent_theme, s.sort_order
ORDER BY s.sort_order ASC;
```

---

## 23.5. Contract de Date: Streak

```sql
SELECT current_streak, longest_streak, last_activity_date
FROM user_streaks
WHERE user_id = auth.uid();
```
- Dacă rândul nu există în baza de date, valorile implicite sunt `current_streak: 0`, `longest_streak: 0`, `last_activity_date: null`.
- Actualizarea streak-ului se execută la nivel de server/hook doar la finalizarea unei activități pedagogice eligibile.

---

## 23.6. Contract de Date: Recent Activity

```sql
SELECT
  ua.id,
  ua.activity_type,
  ua.lesson_id,
  ua.metadata,
  ua.created_at,
  l.title AS lesson_title,
  l.slug AS lesson_slug
FROM user_activity ua
LEFT JOIN lessons l ON l.id = ua.lesson_id
WHERE ua.user_id = auth.uid()
  AND ua.activity_type IN (
    'lesson_completed',
    'quiz_completed',
    'lesson_started',
    'lesson_progress',
    'hidden_answer_revealed',
    'self_assessment'
  )
ORDER BY ua.created_at DESC
LIMIT 10;
```
- Telemetria de navigare (`lesson_opened`) este **exclusă** din interogarea pentru Dashboard.

---

## 23.7. Card Informativ: PRO Status

- Verifică `isPro` prin statutul abonamentului din `subscriptions` sau funcția `private.is_pro_user(auth.uid())`.
- **FREE Account:** Randează card cu beneficii PRO + CTA către `/pro`.
- **PRO Account:** Randează card de membru activ cu badge distinctiv.
- *(Plățile efective Stripe și gestiunea facturării rămân în sarcina Sprintului dedicat Stripe)*.

---

## 23.8. Specificații Tehnice Skeleton Loading (Obligatoriu)

> [!IMPORTANT]
> **ESTE STRICT INTERZIS UN SPINNER CENTRAL CARE LASĂ PAGINA GOALĂ**

Componenta de încărcare a Dashboard-ului afișează o structură compozită de skeleton-uri (`animate-pulse`):
1. **Header Skeleton:**
   - Avatar cerc: `w-12 h-12 rounded-full bg-surface-elevated`
   - Nume & email: 2 linii dreptunghiulare (`w-48 h-6`, `w-32 h-4`)
2. **Continue Learning Card Skeleton:**
   - Card mare dreptunghiular (`h-44 w-full rounded-2xl bg-surface`)
   - Linii interne pentru tag materie, titlu lecție, bară de progres și buton CTA
3. **Global Progress & Streak Grid Skeleton:**
   - Două cutii (`h-36 rounded-2xl bg-surface`) cu placeholder circular și badge streak
4. **Subject Progress Skeletons:**
   - 2 carduri egale (`h-32 rounded-2xl bg-surface`) cu bare scheletice
5. **Recent Activity List Skeleton:**
   - 3 rânduri compuse (`h-12 w-full rounded-xl bg-surface-elevated`)

Fluxul stărilor de încărcare:
- `Skeleton` $\rightarrow$ `Loaded (Success)`
- `Skeleton` $\rightarrow$ `Empty (pentru utilizatori noi)`
- `Skeleton` $\rightarrow$ `Error (cu componentă ErrorState și buton Retry)`

---

## 23.9. Matricea de Stări ale Dashboard-ului

| Stare | Condiție Declanșare | Comportament UI |
| :--- | :--- | :--- |
| **Loading** | Datele se preiau din Supabase | Afișare schelet complet (Skeleton Loading) |
| **Empty (Utilizator Nou)** | 0 lecții începute, 0 activități | Continue Learning Empty State + Progress 0% + CTA `/catalog` |
| **Normal / Success** | Date agregate prezente | Randează toate cele 6 module populate |
| **Error** | Eșec rețea / interogare DB | `ErrorState` integrat cu mesaj descriptiv și buton `Reîncearcă` |
| **Locked / PRO Promo** | Utilizator FREE | Afișează badge-uri PRO și indicatori educaționali fără a bloca interfața |

---

## 23.10. Specificații Ergonomice Responsive

- **Mobile Viewport (< 768px):**
  - O singură coloană verticală (`flex flex-col gap-4`);
  - Carduri întinse pe toată lățimea (`w-full`);
  - Touch targets de minimum 44px;
  - Ierarhie: Salut $\rightarrow$ Continue Learning $\rightarrow$ Progres & Streak $\rightarrow$ Materii $\rightarrow$ Activitate $\rightarrow$ PRO.
- **Desktop Viewport (≥ 1024px):**
  - Layout pe grid structurat pe 12 coloane (`grid grid-cols-12 gap-6`);
  - Continue Learning ocupă poziția centrală dominantă (8 coloane);
  - Streak & PRO Status poziționate strategic în panoul lateral (4 coloane);
  - Progress by Subject desfășurat pe 2 coloane mari (6 + 6 coloane);
  - Spațiere aerisită, culori dark-first, text lizibil conform design tokens.

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

# 26. Lesson progress behavior & lifecycle

## 26.1. Fluxul de Stare al Progresului în Lecție

```text
[Utilizator deschide lecția]
          │
          ▼
Verificare lesson_progress existent
          │
  ┌───────┴────────────────────────┐
  ▼                                ▼
[Fără înregistrare]           [Înregistrare existentă]
  │                                │
  ▼                                ▼
Creează in_progress           Restaurează last_block_id
la prima interacțiune         și scroll automat la poziție
  │                                │
  └───────────────┬────────────────┘
                  │
                  ▼
          [Parcurgere conținut]
                  │
                  ▼ (debounced / pe măsură ce blocurile devin vizibile)
        Actualizare last_block_id
        Recalculare progress_percent (0-99%)
                  │
                  ▼
        [Finalizare conținut / Click „Finalizează lecția”]
                  │
                  ▼
        status = 'completed'
        progress_percent = 100
        completed_at = now()
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
Logare user_activity    Actualizare user_streaks
(lesson_completed)      (idempotent pe ziua curentă)
```

## 26.2. Reguli Tehnice de Execuție:
- **Debouncing:** Modificările intermediare de progres sunt transmise la un interval controlat (ex: 1–2 secunde sau la schimbarea blocului activ), **niciodată pe fiecare eveniment brut de `window.scroll`**.
- **Idempotență:** Marcarea ca `completed` a unei lecții deja finalizate anterior nu recalculează streak-ul și nu generează evenimente duplicate în `user_activity`.

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
ui/Badge
ui/ProgressBar
ui/ProgressRing
ui/Skeleton
ui/EmptyState
ui/ErrorState
ui/Modal

dashboard/ContinueLearningCard
dashboard/GlobalProgressCard
dashboard/StreakCard
dashboard/SubjectProgressCard
dashboard/RecentActivityList
dashboard/ProStatusCard

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

# 46. Acceptance criteria for technical milestones

## 46.1. Content, Auth & RLS Access Control (Milestones 1 & 2)

- Project runs locally and Supabase connection is established;
- Auth, profile creation, and user roles work as specified;
- Unauthenticated requests to educational routes (`/catalog`, `/catalog/:subject`, `/lesson/:lessonId`) are rejected by UI guards and database RLS;
- Published lesson metadata is readable by authenticated users;
- Non-PRO student receives `PRO_REQUIRED` status and PRO gate UI on PRO lessons without leaking blocks;
- PRO student receives full access to FREE and PRO lesson blocks.

## 46.2. Dashboard, Progress, Streak & Activity (Milestone 3)

1. **Authenticated Student Access:** Authenticated student can open `/dashboard` and view all aggregated personal data.
2. **Guest Protection:** Guest user cannot open `/dashboard` and is redirected to `/login`.
3. **Continue Learning Selection:** Continue Learning card selects the latest incomplete `in_progress` lesson (`ORDER BY updated_at DESC LIMIT 1`).
4. **New User Empty State:** New user with zero in-progress lessons receives a premium Empty State with CTA linking to `/catalog` (no empty broken card, no arbitrary catalog fallback).
5. **Global Progress Total Denominator:** Global Progress formula includes all published lessons (both `FREE` and `PRO`) in the denominator.
6. **Subject Progress Total Denominator:** Subject Progress formula includes all published lessons for that subject (both `FREE` and `PRO`) in the denominator.
7. **Progress Lifecycle:** Parcurgerea lecției actualizează `last_block_id` și `progress_percent`; finalizarea marchează lecția ca fiind `completed`.
8. **Streak Eligible Activities:** Streak engine counts only eligible learning activity (real lesson progress, lesson completion, quiz completion, self-assessment); app opens, logins, and browsing are excluded.
9. **Streak Daily Idempotency:** Multiple eligible learning activities on the same calendar day do not increment streak repeatedly.
10. **Recent Activity Relevant Feed:** Recent Activity displays relevant learning events (`lesson_completed`, `quiz_completed`, progress, self-assessment); internal `lesson_opened` telemetry is filtered out.
11. **PRO Status Representation:** PRO status card accurately reflects account plan (FREE with upgrade CTA vs PRO active member badge) without requiring Stripe checkout in this milestone.
12. **Mandatory Skeleton Loading:** Complete skeleton layouts (header, continue learning, progress, streak, subjects, activity, PRO card) are displayed while data is resolving; no blank screen spinner.
13. **Dashboard State Matrix:** Dashboard handles Loading (skeleton), Empty (new user), Error (retryable ErrorState), Success/Normal, and Locked/PRO states.
14. **Security & RLS Isolation:** User can read only their own data (progress, streak, activity, subscription) via RLS; `lesson_progress` is updated with strict server-side validation, while `user_streaks` and `user_activity` are written and managed exclusively server-side.
15. **Responsive Ergonomics:** Layout adapts fluidly on mobile (single vertical column, full-width cards, touch targets ≥ 44px) and desktop (spacious grid layout, clear hierarchy).

---

# 47. MVP build order (Canonical Roadmap)

## Step 1 — Foundation
Repository, environment, project setup, design tokens, basic routing.

## Step 2 — Auth + Security
Supabase Auth, profiles, user_roles, route guards, RLS policies.

## Step 3 — Lesson Engine
Lessons schema, `lesson_blocks`, block renderer, drawer, adjacent navigation.

## Step 4 — Catalog
`/catalog` page, `/catalog/:subject` page, works/chapters in Accordion format, FREE/PRO indicators.

## Step 5 — Dashboard + Progress + Streak + Activity (Milestone 3)
`/dashboard`, `lesson_progress`, `user_streaks`, `user_activity`, Continue Learning, Global & Subject Progress engines, Skeleton Loading, State handling.

## Step 6 — Quiz Engine
`quizzes`, `quiz_questions`, `quiz_options`, `quiz_attempts`, self-assessment.

## Step 7 — Stripe / PRO subscriptions
Stripe Checkout, webhook listener, subscription sync, billing portal.

## Step 8 — Admin CMS
`/admin` portal, 3-column block editor, Draft -> Review -> Publish workflow, media library.

## Step 9 — AI content pipeline
PDF text extractor, block proposal generator, human review tooling.

## Step 10 — Final Polish / Launch
Micro-interactions, accessibility audit, performance tuning, SEO, GDPR/legal, production launch.

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
