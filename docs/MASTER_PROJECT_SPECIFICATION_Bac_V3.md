# MASTER PROJECT SPECIFICATION — Platformă web pentru Bacalaureat
## V3 — Arhitectură + UX + Design + MVP Blueprint

**Status:** Blueprint de implementare
**Scop:** documentul de lucru principal înainte de alegerea builderului și începerea codului.

> V3 transformă ideile stabilite anterior într-o arhitectură concretă. Unde am luat o decizie de proiectare pentru a evita blocajele, aceasta este marcată **DECIZIE PROPUSĂ**. Poate fi modificată ulterior, dar nu trebuie lăsată ambiguă în timpul implementării.

---

# 1. Decizii de produs

## 1.1. Produsul

Platformă web premium pentru pregătirea examenului de Bacalaureat, bazată pe lecții structurate, progres, învățare activă și conținut multimedia.

## 1.2. MVP

Prima versiune publică va porni cu:
- Română
- Istorie

Motiv: există deja materiale PDF pentru aceste materii și putem valida produsul cu conținut real.

Arhitectura va permite adăugarea ulterioară a:
- Logică
- Geografie
- Biologie
- alte materii

Fără refacerea bazei de date sau a UI-ului.

## 1.3. Principiul central

Aplicația trebuie să funcționeze ca un produs de învățare, nu ca un depozit de documente.

---

# 2. Arhitectura tehnică propusă

## 2.1. Stack

**DECIZIE PROPUSĂ**

- Frontend: React + TypeScript
- UI: Tailwind CSS + componente reutilizabile
- Backend: Supabase
- Database: PostgreSQL
- Auth: Supabase Auth
- Storage: Supabase Storage
- Hosting: Vercel sau echivalent
- Version control: GitHub
- Payments: Stripe
- Email: provider transactional ales ulterior
- AI: provider API ales ulterior

Motivul principal: combinația permite construirea rapidă cu vibe-coding, dar păstrează accesul la cod și la baza de date.

## 2.2. Principiu

Builderul este înlocuibil.

Aplicația nu trebuie proiectată astfel încât să depindă permanent de un singur builder.

---

# 3. Structura aplicației

## Public Routes (Fără autentificare)

- `/`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/pro`
- pagini juridice

## Protected Educational Routes (Necesită autentificare)

- `/catalog`
- `/catalog/:subject`
- `/lesson/:lessonId`

## Protected Student Routes (Necesită autentificare)

- `/dashboard`
- `/settings`

## Admin

- `/admin`
- `/admin/content`
- `/admin/content/:subject`
- `/admin/content/:subject/:chapter`
- `/admin/content/:lesson`
- `/admin/media`
- `/admin/quizzes`
- `/admin/users`
- `/admin/subscriptions`
- `/admin/analytics`
- `/admin/settings`

---

# 4. Modelul de date

## 4.1. Profiles

`profiles`

Câmpuri conceptuale:
- id
- user_id
- display_name
- avatar_url
- created_at
- updated_at

`user_id` este legat de sistemul Auth.

## 4.2. Roles

Rolul nu trebuie ținut doar în frontend.

Roluri:
- student
- editor
- reviewer
- super_admin

## 4.3. Subjects

`subjects`

- id
- slug
- name
- short_description
- description
- icon
- cover_media_id
- accent_theme
- sort_order
- is_published
- created_at
- updated_at

## 4.4. Chapters

`chapters`

- id
- subject_id
- slug
- title
- short_description
- description
- cover_media_id
- sort_order
- is_published
- created_at
- updated_at

Pentru Română, un „Chapter” poate reprezenta o operă.

## 4.5. Lessons

`lessons`

- id
- chapter_id
- slug
- title
- short_description
- estimated_minutes
- access_level
- cover_media_id
- sort_order
- status
- published_at
- created_at
- updated_at

`access_level`:
- free
- pro

`status`:
- draft
- review
- published
- archived

### 4.1. Content Discovery & Access Model

> [!IMPORTANT]
> **REGULĂ PRINCIPALĂ DE PRODUS**: **EDUCATIONAL CONTENT REQUIRES AUTHENTICATION**
> Accesul la orice resursă sau rută educațională (`/catalog`, `/catalog/:subject`, `/lesson/:lessonId`) necesită autentificare prealabilă. Utilizatorii neautentificați (Guest/Anonim) **NU** pot accesa catalogul, operele sau lecțiile și sunt redirecționați către `/login`.

Modelul de securitate și acces la conținut este structurat pe 3 niveluri clare:

1. **Authentication Gate (Autentificare)**:
   - **Utilizator Neautentificat (Guest / Anonim)**:
     - Poate accesa doar rutele publice: `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/pro`.
     - Orice încercare de acces la rute educaționale (`/catalog`, `/catalog/:subject`, `/lesson/:lessonId`) sau interogări direct la API-ul de date educaționale este respinsă (redirecționare în UI și RLS DENIED pe server).

2. **Authenticated Discovery (Descoperire pentru Utilizatori Autentificați)**:
   - **Utilizatorul Autentificat Non-PRO (Student Standard)**:
     - Poate explora Catalogul (`/catalog`) și paginile de materii (`/catalog/:subject`).
     - Poate vedea metadata tuturor lecțiilor publicate (`id`, `chapter_id`, `slug`, `title`, `short_description`, `estimated_minutes`, `access_level`, `cover_media_id`, `sort_order`, `status`).
     - Pentru o lecție `free`: Are acces complet (`ACCESSIBLE`) la `lesson_blocks` și conținutul de studiu.
     - Pentru o lecție `pro`: Are stare `PRO_REQUIRED` (vede metadata lecției + PRO Gate Banner / Upgrade CTA; `lesson_blocks` sunt blocate la nivel de server prin RLS).

3. **Authorized PRO & Staff Access (Utilizatori PRO & Staff)**:
   - **Utilizatorul Autentificat PRO**: Are acces deplin (`ACCESSIBLE`) la lecțiile `free` și `pro`, blocurile de lecție și resursele media PRO.
   - **Roluri Staff (Reviewer, Editor, Super Admin)**:
     - `reviewer`: Are acces `SELECT` read-only la conținutul nepublicat (status `draft`/`review`) în scop de verificare. **NU** deține permisiuni `INSERT`/`UPDATE`/`DELETE`.
     - `editor`: Poate crea și edita conținut (`INSERT`, `UPDATE`).
     - `super_admin`: Acces administrativ complet (`INSERT`, `UPDATE`, `DELETE` conținut, gestionare `user_roles`).

4. **Tratarea Stărilor de Acces la Lecție**:
   - `NOT_FOUND` (404): ID de lecție inexistent în baza de date.
   - `PRO_REQUIRED`: Lecție PRO accesată de un utilizator autentificat non-PRO (afișează Metadata + PRO Gate).
   - `ACCESSIBLE`: Lecție FREE sau lecție PRO accesată de un utilizator PRO/Staff (afișează metadata + blocuri de conținut).
   - `ERROR`: Eroare de rețea sau interogare DB.

---

# 5. Lesson Blocks

## 5.1. Principiu

Conținutul unei lecții NU este stocat ca un singur HTML gigantic.

Este stocat ca blocuri ordonate.

`lesson_blocks`

- id
- lesson_id
- block_type
- sort_order
- content_json
- created_at
- updated_at

`content_json` conține proprietățile specifice blocului.

## 5.2. Tipuri inițiale

- rich_text
- heading
- important
- remember
- definition
- image
- gallery
- table
- timeline
- map
- audio
- video
- summary
- quiz
- hidden_answer

## 5.3. Regula

Block renderer-ul trebuie să fie centralizat.

Exemplu conceptual:

`block_type = "remember"` → aceeași componentă vizuală oriunde apare.

Nu se copiază HTML separat în fiecare lecție.

---

# 6. Conținut specific Română

Nu creăm o bază de date separată pentru Română.

Folosim aceeași structură:

Subject = Română

Chapter = Opera

Lesson = tip de eseu

Exemplu:

Română
→ Liviu Rebreanu — Ion
→ Particularitățile operei

Română
→ Liviu Rebreanu — Ion
→ Construcția personajului

Română
→ Liviu Rebreanu — Ion
→ Relația dintre personaje

Tipul operei și alte informații specifice pot fi metadata ale capitolului.

---

# 7. Conținut specific Istorie

Subject = Istorie

Chapter = capitol istoric

Lesson = lecție individuală

Structură recomandată:

1. Introducere
2. Conținut structurat
3. De reținut
4. Scheme / hărți / cronologii
5. Rezumat final
6. Opțional: quiz / learning blocks

---

# 8. Media

## 8.1. Media table

`media`

- id
- type
- storage_path
- filename
- mime_type
- size_bytes
- title
- description
- alt_text
- duration_seconds
- created_by
- created_at

Tipuri:
- image
- audio
- video
- document

## 8.2. Storage

Fișierele mari nu se pun direct în database.

Database păstrează metadata + path-ul.

## 8.3. Reutilizare

O imagine/audio/video poate fi folosită în mai multe lecții.

---

# 9. Progress

## `lesson_progress`

- id
- user_id
- lesson_id
- status
- progress_percent
- last_block_id
- started_at
- completed_at
- updated_at

Status:
- not_started
- in_progress
- completed

## Regula

„Continuă de unde ai rămas” se bazează pe ultima lecție activă + ultimul punct relevant de progres.

---

# 10. Activity

`user_activity`

- id
- user_id
- activity_type
- lesson_id
- metadata_json
- created_at

Exemple:
- lesson_opened
- lesson_completed
- quiz_completed
- audio_played
- video_played
- subscription_started

Nu se păstrează inutil fiecare secundă de citire.

---

# 11. Streak

`user_streaks`

- user_id
- current_streak
- longest_streak
- last_activity_date
- updated_at

Streak-ul se actualizează pe baza activității eligibile.

Regulă propusă:
o zi contează când elevul efectuează o activitate de învățare relevantă, nu doar când deschide aplicația.

---

# 12. Quiz system

## `quizzes`

- id
- lesson_id
- title
- description
- created_at
- updated_at

## `quiz_questions`

- id
- quiz_id
- question_type
- question
- explanation
- sort_order
- metadata_json

## `quiz_options`

- id
- question_id
- option_text
- is_correct
- sort_order

Tipuri inițiale:
- multiple_choice
- true_false
- free_text

---

# 13. Learning System

## V1

Începem cu:
- hidden answer;
- recapitulare;
- quiz.

Nu implementăm încă un algoritm complex de spaced repetition.

## Hidden Answer

Blocul `hidden_answer` poate avea:

- prompt
- answer
- explanation

UI:
1. elevul vede întrebarea / propoziția;
2. încearcă să răspundă;
3. apasă „Arată răspunsul”;
4. vede răspunsul;
5. poate marca „Știam” / „Mai trebuie să repet”.

Această funcție poate alimenta ulterior un sistem de repetare.

---

# 14. Subscription

`subscriptions`

- id
- user_id
- provider
- provider_customer_id
- provider_subscription_id
- plan
- status
- current_period_start
- current_period_end
- cancel_at_period_end
- created_at
- updated_at

Plan:
- free
- pro

Status:
- active
- trialing
- past_due
- canceled
- incomplete
- expired

Plățile reale sunt procesate de provider, iar aplicația sincronizează starea prin webhook.

---

# 15. Access Control

## Principiu

Există trei niveluri:

1. Public
2. Student autentificat
3. PRO

Și separat:
4. Admin roles

## Verificare

Accesul la conținut PRO se verifică server-side.

Nu este suficient:

```text
if (isPro) showLesson()
```

în frontend.

Backend-ul trebuie să confirme dreptul de acces.

---

# 16. Admin content workflow

Fluxul complet:

```text
Create
 ↓
Draft
 ↓
Edit
 ↓
Preview
 ↓
Review
 ↓
Publish
```

Editorul poate salva draftul fără să îl publice.

Reviewer-ul poate aproba.

Super Admin poate publica direct.

---

# 17. Admin editor

## Layout desktop

```text
┌──────────────┬───────────────────────┬──────────────┐
│ Block list   │ Lesson canvas         │ Properties   │
│              │                       │              │
│ + Text       │ [Lesson content]      │ Selected     │
│ + Important  │                       │ block        │
│ + Image      │                       │ settings     │
│ + Audio      │                       │              │
│ + Video      │                       │              │
└──────────────┴───────────────────────┴──────────────┘
```

## Funcții

- add block
- drag
- reorder
- duplicate
- delete
- edit
- preview
- save
- publish

## V2 ulterior

- autosave
- undo/redo
- version history
- keyboard shortcuts

---

# 18. Template system

`lesson_templates`

- id
- name
- subject_id nullable
- template_type
- blocks_json
- created_at
- updated_at

Template-uri inițiale:

### Istorie
- Lecție Istorie

### Română
- Particularitățile operei
- Construcția personajului
- Relația dintre personaje

Crearea unei lecții din template copiază structura, nu leagă lecția permanent de template.

---

# 19. Dashboard UX

## Prioritatea #1

„Continuă de unde ai rămas”.

Structură:

1. Header
2. Continue Learning
3. Streak
4. Progress by subject
5. Recent activity
6. PRO status / upgrade

Nu creăm o pagină separată de progres.

Nu creăm o pagină separată de profil.

---

# 20. Catalog UX

## 20.1. Structură & Ierarhie (Română)

Pentru Limba și literatura română, ierarhia de conținut este:

```text
Subject (Limba și literatura română)
 └── Chapter = Operă (ex: Moara cu noroc — Ioan Slavici)
      └── Lesson = tip de eseu / lecție (ex: Particularitățile operei)
```

`Subject` / `Chapter` / `Lesson` reprezintă structura de date, **NU** pagini separate obligatorii în frontend.

## 20.2. Model de Date Chapter (Titlu + Subtitlu Operă)

Pentru capitolele care reprezintă opere literare, componentele vizuale compun titlul și subtitlul din schema `chapters`:

- `chapters.title` = Titlul operei (ex: `Moara cu noroc`)
- `chapters.metadata.author` = Autorul operei (ex: `Ioan Slavici`)
- `chapters.metadata.work_type` = Specia / tipul operei (ex: `Nuvela psihologică`)

Compunere Vizuală UI:
- **Titlu Principal**: `chapter.title + ' — ' + metadata.author` (ex: `Moara cu noroc — Ioan Slavici`)
- **Subtitlu**: `metadata.work_type` sau `chapter.short_description` (ex: `Nuvela psihologică`)

## 20.3. Routing Oficial Catalog & Protecție Acces

Rutele oficiale educaționale protejate (necesită autentificare) sunt:

- `/catalog` -> Pagina principală cu lista de materii (`subjects`). Accesibilă doar utilizatorilor autentificați.
- `/catalog/:subject` -> Pagina materiei selectate (ex: `/catalog/romana`), care afișează **pe aceeași pagină** toate operele și lecțiile lor. Accesibilă doar utilizatorilor autentificați.
- `/lesson/:lessonId` -> Pagina unică de studiu/conținut a lecției. Accesibilă doar utilizatorilor autentificați.

> [!IMPORTANT]
> **EDUCATIONAL CONTENT REQUIRES AUTHENTICATION**: Utilizatorii neautentificați care încearcă accesarea `/catalog`, `/catalog/:subject` sau `/lesson/:lessonId` vor fi redirecționați automat către `/login`.
> Ruta `/catalog/:subject/:chapter` **NU** este o rută de produs. `Chapter` este o secțiune vizuală și un card Expandable în interiorul paginii `/catalog/:subject`.

## 20.4. Model UX Expandable Card / Accordion

Pe pagina `/catalog/:subject` (ex: `/catalog/romana`), fiecare operă este afișată ca un Card / Section Expandable (Accordion).

### Starea Collapsed (Implicită)

```text
┌────────────────────────────────────────────────────────────┐
│ Moara cu noroc — Ioan Slavici                         ˅   │
│ Nuvela psihologică                                         │
└────────────────────────────────────────────────────────────┘
```

- Titlul operei + Autorul
- Subtitlu cu specia / tipul operei
- Chevron / indicator de extindere (`˅`)

### Starea Expanded

```text
┌────────────────────────────────────────────────────────────┐
│ Moara cu noroc — Ioan Slavici                         ˄   │
│ Nuvela psihologică                                         │
│                                                            │
│ Particularitățile operei                          FREE     │
│ Construcția unui personaj                         PRO 🔒   │
│ Relația dintre două personaje                     PRO 🔒   │
└────────────────────────────────────────────────────────────┘
```

### Reguli UI Accordion:
- Lecțiile sunt **COLLAPSED** implicit pe pagină.
- Click pe operă/card o extinde (EXPANDED), afișând lista de lecții.
- Click din nou pe operă o restrânge (COLLAPSED).
- Ideal o singură operă este expanded simultan (Single-expanded accordion) pentru claritate vizuală optimă.
- Click pe o lecție navighează direct la `/lesson/:lessonId`.
- Toate lecțiile `published` (atât `FREE` cât și `PRO 🔒`) sunt descoperibile în accordion.

---

# 21. Lesson UX

## Desktop

```text
┌───────────────┬───────────────────────────────┐
│ Drawer        │ Lesson                        │
│               │                               │
│ Cuprins       │ Title                         │
│ Section 1     │ Content                       │
│ Section 2     │                               │
│ Section 3     │ Media                         │
│               │                               │
│ Audio         │                               │
│ Video         │                               │
└───────────────┴───────────────────────────────┘
```

## Drawer

Conține:
- cuprins;
- secțiunea activă;
- audio dacă există;
- video dacă există.

Dacă nu există audio/video, elementul nu apare.

## Navigare

Sus:
- Lecția anterioară
- Lecția următoare

Jos:
- Lecția anterioară
- Lecția următoare

---

# 22. Lesson reading experience

Priorități:

1. lizibilitate;
2. structură;
3. navigare;
4. memorare;
5. media;
6. efecte vizuale.

Nu folosim animații agresive în timpul lecturii.

---

# 23. Design system

## Direcție

- dark/premium sau dark-first;
- glow;
- orbs;
- gradient-uri;
- pattern discret;
- glassmorphism moderat;
- 3D subtil;
- microinteracțiuni.

## Principiu

Landing = spectaculos.

Dashboard = premium.

Catalog = clar.

Lesson = focus.

Admin = productiv.

---

# 24. Componente globale

Biblioteca inițială:

- Button
- IconButton
- Card
- Badge
- Avatar
- ProgressBar
- ProgressRing
- Input
- SearchInput
- Select
- Tabs
- Modal
- Drawer
- Toast
- Tooltip
- Dropdown
- Breadcrumbs
- EmptyState
- LoadingState
- ErrorState
- AudioPlayer
- VideoPlayer

Componente de produs:

- SubjectCard
- ChapterCard
- LessonCard
- ContinueLearningCard
- StreakCard
- ProgressSubjectCard
- LessonNavigation
- LessonOutline
- LessonBlockRenderer
- ProGate

---

# 25. Responsive

## Mobile

- drawer overlay;
- sticky / accesibil navigation;
- butoane suficient de mari;
- text 100% lizibil;
- media responsive;
- carduri full width.

## Desktop

- sidebar;
- max-width pentru lectura lecției;
- spațiu lateral generos;
- editor Admin cu trei coloane.

---

# 26. State design

Fiecare pagină importantă trebuie să aibă:

- loading;
- empty;
- error;
- success;
- locked / PRO;
- unauthorized.

Nu construim doar „happy path”.

---

# 27. Security

## Student

Poate:
- vedea conținutul permis;
- modifica propriul profil;
- vedea propriul progres;
- vedea propriul abonament.

Nu poate:
- modifica lecții;
- modifica progresul altui utilizator;
- accesa date admin;
- accesa conținut PRO fără abonament.

## Editor

Poate administra conținutul permis.

## Reviewer

Poate verifica / aproba.

## Super Admin

Acces complet.

---

# 28. Database rules

- Foreign keys peste tot unde există relație.
- Slug-uri unice în contextul lor.
- `sort_order` pentru entitățile ordonabile.
- timestamps pe toate entitățile principale.
- soft delete doar unde este justificat.
- nu ștergem fizic media folosită fără verificare.
- indexuri pentru căutări și relații frecvente.

---

# 29. Search

Nu construim motor de căutare separat în MVP.

Folosim PostgreSQL pentru căutarea inițială.

Căutăm în:
- subject.name
- chapter.title
- chapter.description
- lesson.title
- lesson.short_description

Ulterior:
- full-text search;
- ranking;
- synonyms;
- căutare în conținut.

---

# 30. SEO

Public:
- Landing;
- eventual pagini publice de prezentare a materiilor.

Conținutul PRO nu trebuie tratat ca pagini publice indexabile în mod necontrolat.

---

# 31. Analytics

MVP:
- users;
- active users;
- lesson starts;
- lesson completions;
- popular lessons;
- progress;
- PRO conversions.

Nu colectăm excesiv date personale.

---

# 32. GDPR / legal

Înainte de lansare:
- Privacy Policy;
- Terms;
- Cookie policy, dacă sunt necesare;
- consent unde este obligatoriu;
- mecanism pentru ștergerea contului;
- export / gestionare date dacă este necesar.

---

# 33. AI workflow

## Conținut

```text
PDF
 ↓
Extract
 ↓
AI structure
 ↓
Human review
 ↓
Admin draft
 ↓
Preview
 ↓
Publish
```

## Coding

```text
Spec
 ↓
Small task
 ↓
AI implementation
 ↓
Run/test
 ↓
Review
 ↓
Commit
```

Niciun AI nu trebuie să primească dreptul de a „reproiecta tot proiectul” pentru o modificare locală.

---

# 34. Vibe-coding rules

1. O sarcină = un obiectiv clar.
2. Nu se modifică sisteme fără legătură.
3. Se reutilizează componente.
4. Se verifică build-ul după modificări majore.
5. Se verifică mobile după schimbări UI.
6. Se păstrează Git history.
7. Se lucrează pe branch pentru schimbări riscante.
8. Se evită dependency bloat.
9. Nu se schimbă schema DB fără migrare.
10. Documentația proiectului este sursa de adevăr.

---

# 35. MVP Definition of Done

MVP-ul este gata când un elev poate:

1. crea cont;
2. intra în Dashboard;
3. vedea Catalogul;
4. intra într-o materie;
5. intra într-un capitol;
6. deschide o lecție;
7. parcurge lecția;
8. folosi cuprinsul;
9. asculta audio dacă există;
10. vedea video dacă există;
11. trece la lecția următoare;
12. vedea progresul;
13. reveni și continua de unde a rămas;
14. vedea conținutul PRO blocat;
15. vedea pagina de upgrade.

Admin-ul poate:

1. crea materie;
2. crea capitol;
3. crea lecție;
4. folosi template;
5. adăuga blocuri;
6. reordona blocuri;
7. atașa media;
8. salva draft;
9. vedea preview;
10. publica;
11. edita conținut existent.

---

# 36. Ce NU intră în primul MVP

Pentru a evita proiectul prea mare:

- aplicație mobilă nativă;
- chat între elevi;
- forum;
- gamification complexă;
- leaderboard;
- AI tutor conversațional;
- spaced repetition avansat;
- notificări complexe;
- marketplace;
- multiple payment plans;
- video streaming complex;
- colaborare simultană în editor.

Acestea pot apărea ulterior.

---

# 37. Ordinea efectivă de dezvoltare

## Sprint 0 — Foundation
- repository;
- environment;
- project setup;
- design tokens;
- routing;
- Git.

## Sprint 1 — Auth + DB
- Supabase;
- auth;
- profiles;
- roles;
- schema inițială;
- RLS.

## Sprint 2 — Admin content
- subjects;
- chapters;
- lessons;
- blocks;
- editor;
- templates.

## Sprint 3 — Student catalog
- dashboard;
- catalog;
- subject;
- chapter.

## Sprint 4 — Lesson
- lesson renderer;
- drawer;
- media;
- navigation.

## Sprint 5 — Progress
- progress;
- continue learning;
- streak;
- activity.

## Sprint 6 — FREE/PRO
- access control;
- ProGate;
- upgrade page.

## Sprint 7 — Payments
- Stripe;
- webhook;
- subscription sync.

## Sprint 8 — Learning
- hidden answer;
- quiz;
- recap.

## Sprint 9 — AI content
- PDF pipeline;
- draft generation;
- review.

## Sprint 10 — Polish
- animations;
- accessibility;
- performance;
- SEO;
- security;
- analytics.

---

# 38. Ce vom construi înainte de builder

Înainte să alegem tool-ul final, trebuie să avem:

1. acest document;
2. schema DB;
3. component inventory;
4. page map;
5. design direction;
6. MVP definition.

Acestea sunt acum definite la nivel suficient pentru alegerea tehnologiei.

---

# 39. Builder selection criteria

Orice builder / AI coding tool trebuie evaluat după:

1. suport TypeScript/React;
2. Supabase;
3. GitHub;
4. export/control asupra codului;
5. posibilitate de a continua manual;
6. calitatea componentelor;
7. debugging;
8. context management;
9. cost;
10. limite de utilizare;
11. deployment;
12. compatibilitate cu Stripe;
13. capacitate de a lucra incremental;
14. posibilitatea de a folosi mai multe AI-uri;
15. lipsa lock-in-ului.

Criteriul principal nu este „cât de repede generează homepage-ul”.

---

# 40. Strategia de construcție recomandată

Nu vom folosi un prompt unic.

Vom avea:

### Prompt 0
Context + reguli + arhitectură.

### Prompt 1
Foundation.

### Prompt 2
Database/Auth.

### Prompt 3
Admin content.

### Prompt 4
Student catalog.

### Prompt 5
Lesson experience.

### Prompt 6
Progress.

### Prompt 7
FREE/PRO.

### Prompt 8
Payments.

### Prompt 9
Learning.

### Prompt 10
Polish.

Fiecare pas este verificat înainte de următorul.

---

# 41. Conținutul inițial

După ce CMS-ul funcționează, importăm întâi:

## Istorie
Materialele existente → capitole → lecții → blocuri.

## Română
Materialele existente → opere → eseuri → lecții → blocuri.

Conținutul este verificat manual înainte de publicare.

---

# 42. Principiul de calitate a conținutului

AI-ul poate accelera structurarea, dar:

**acuratețea educațională este responsabilitatea proiectului.**

Pentru informații de Bac:
- verificare umană;
- păstrarea sensului materialului original;
- evitarea „halucinațiilor” AI;
- atenție la formulări și barem.

---

# 43. Decizii asumate pentru a putea avansa

Pentru a nu rămâne blocați în „mai vedem”, următoarele sunt decizii de lucru:

- MVP = Română + Istorie.
- Backend = Supabase, ca direcție.
- Database = PostgreSQL.
- Frontend = React + TypeScript.
- UI = Tailwind + component library proprie/reutilizabilă.
- GitHub = source control.
- Stripe = direcție pentru abonamente.
- Lecția = blocuri modulare.
- Admin = CMS ierarhic.
- Dashboard = progres + profil, fără pagini separate.
- Catalog = include căutarea.
- Learning system = după fundația MVP.
- AI content = după CMS.
- Builderul final = se alege după comparație.

---

# 44. Următorul document tehnic

Următoarea versiune nu trebuie să mai fie o descriere de produs.

Trebuie să fie:

**TECHNICAL IMPLEMENTATION SPEC**

cu:
- SQL / schema PostgreSQL;
- RLS policies;
- TypeScript types;
- JSON schema pentru fiecare Lesson Block;
- route map;
- component API;
- state management;
- storage policies;
- auth flows;
- Stripe webhook flow;
- environment variables;
- deployment checklist.

Acesta va fi documentul pe care îl dăm AI-ului care construiește efectiv aplicația.

---

# 45. Starea proiectului după V3

## Avem

- viziunea;
- structura produsului;
- structura conținutului;
- Admin;
- Dashboard;
- Catalog;
- Lesson UX;
- design direction;
- monetizare;
- learning direction;
- arhitectura conceptuală;
- modelul bazei de date;
- workflow-ul de dezvoltare;
- MVP definition.

## Mai rămâne înainte de cod

1. Technical Implementation Spec.
2. Design tokens finale.
3. Alegerea builderului.
4. Repository.
5. Implementarea Foundation.

Acesta este punctul în care proiectul poate trece de la **idee** la **specificație tehnică executabilă**.

---

# 46. Criterii de Acceptare Canonice (Acceptance Criteria)

1. **Guest → `/catalog`**: Acces refuzat (DENIED) / Redirecționare automată către `/login`.
2. **Guest → `/catalog/:subject`**: Acces refuzat (DENIED) / Redirecționare automată către `/login`.
3. **Guest → `/lesson/:lessonId`**: Acces refuzat (DENIED) / Redirecționare automată către `/login`.
4. **Guest → Direct API Query**: Refuzat la nivel de bază de date de politicile Supabase RLS (DENIED).
5. **Authenticated Student → FREE Lesson**: Stare `ACCESSIBLE` (acces complet la metadata și blocurile de conținut).
6. **Authenticated Student → PRO Lesson**: Stare `PRO_REQUIRED` (vede metadata lecției + PRO Gate Banner / Upgrade CTA; blocurile sunt ascunse de RLS).
7. **PRO User → PRO Lesson**: Stare `ACCESSIBLE` (acces complet la metadata, blocuri și media PRO).
8. **Unpublished Lesson**: Indisponibilă pentru studenți (`NOT_FOUND` / 404).
9. **Reviewer → Unpublished Content**: Acces `SELECT` (read-only) pentru revizuire conținut.
10. **Reviewer → Modify Content**: Refuzat (`INSERT`, `UPDATE`, `DELETE` nepermise de RLS).
