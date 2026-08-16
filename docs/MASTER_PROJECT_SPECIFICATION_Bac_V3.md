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

## 9.1. Modelul de Date `lesson_progress`

`lesson_progress` este sursa principală și unică de adevăr pentru progresul unui utilizator la nivel de lecție.

- id
- user_id
- lesson_id
- status (`not_started`, `in_progress`, `completed`)
- progress_percent (integer 0–100)
- last_block_id (uuid nullable)
- started_at (timestamptz nullable)
- completed_at (timestamptz nullable)
- updated_at (timestamptz)

Statusuri canonice:
- `not_started`: lecția nu a fost începută de elev;
- `in_progress`: elevul a început efectiv parcurgerea conținutului educațional;
- `completed`: elevul a parcurs conținutul relevant până la final și a finalizat lecția.

Reguli de actualizare a progresului & Validare Server-Side:
- Utilizatorul autentic își poate citi și transmite propriul progres (`user_id = auth.uid()`), dar server-side se validează strict:
  1. `user_id = auth.uid()`;
  2. `lesson_id` aparține unei lecții existente și accesibile;
  3. `progress_percent` este valid (0–100);
  4. Tranzițiile de status sunt canonice (`not_started` $\rightarrow$ `in_progress` $\rightarrow$ `completed`);
  5. `last_block_id` aparține lecției respective;
  6. `completed_at` este setat doar la finalizarea validă a conținutului.
- Simpla deschidere a paginii lecției **NU** marchează lecția ca fiind `completed`.
- Clientul **NU** poate falsifica o lecție completată printr-un request arbitrar (`status = 'completed'`, `progress_percent = 100`) fără validarea contextului pe server.
- Utilizatorul **NU** poate modifica sau citi progresul altui utilizator.

## 9.2. Progress Global — Regulă Canonică și Formulă

Progresul Global reflectă parcursul complet al elevului în raport cu întregul curriculum publicat pe platformă.

**Formula Canonică:**
$$\text{Global Progress (\%)} = \left( \frac{\text{Număr lecții publicate completate}}{\text{Total lecții publicate pe platformă}} \right) \times 100$$

> [!IMPORTANT]
> **REGULĂ DE AUR: TOATE LECȚIILE PUBLICATE (FREE + PRO) INTRĂ ÎN DENOMINATOR**
> Atât lecțiile `FREE`, cât și lecțiile `PRO` publicate sunt incluse în numitorul formulei. Un utilizator cu cont `FREE` **NU** va primi un procentaj artificial calculat doar din lecțiile pe care le poate deschide.
>
> *Exemplu:* Dacă există 50 de lecții publicate în total pe platformă (30 FREE și 20 PRO), iar un elev a completat 17 lecții, Progresul Global este:
> $$\frac{17}{50} \times 100 = 34\%$$
>
> **Rol Pedagogic și de Orientare:** Această regulă oferă o imagine clară, realistă și transparentă asupra întregii materii de Bacalaureat și conștientizează valoarea parcursului complet PRO, fără manipulare.
>
> **Securitate & RLS:** Indicatorul de Progres Global este un calcul strict vizual / informativ și **NU modifică regulile de autorizare RLS**. Lecțiile PRO rămân strict protejate la nivel de server.

## 9.3. Progress pe Materie (Progress by Subject) — Regulă și Formulă

Progresul pentru o anumită materie (Subject) se calculează relativ la TOATE lecțiile publicate din acea materie.

**Formula Canonică:**
$$\text{Subject Progress (\%)} = \left( \frac{\text{Număr lecții publicate completate din materie}}{\text{Total lecții publicate din acea materie}} \right) \times 100$$

Și la nivel de materie:
- **FREE + PRO** sunt ambele incluse în numitor (`total published lessons in subject`).
- *Exemplu Română:* 12 lecții completate dintr-un total de 40 de lecții publicate = $30\%$.
- Elevul vede progresul real prin programa materiei chiar dacă o parte din lecții sunt PRO.
- Nu se acordă acces la conținutul PRO prin calculul procentual.

## 9.4. PRO Progression / Conversion UX

Afișarea progresului comunică valoarea accesului PRO într-un mod elegant, organic și discret:
- Elevul vede: *Română: 30% (12 / 40 lecții completate)*.
- Se afișează un indicator contextual discret: *"X lecții sunt disponibile cu planul PRO"* alături de un CTA clar: *"Devino PRO"*.
- Dashboard-ul rămâne un spațiu de învățare calm și util pedagogic, fără tactici agresive de vânzare.

---

# 10. Activity

## 10.1. Modelul de Date `user_activity`

Tabela `user_activity` înregistrează acțiunile relevante de învățare pentru analytics, istoricul utilizatorului și afișarea în UI.

- id
- user_id
- activity_type
- lesson_id (nullable)
- metadata_json (jsonb)
- created_at (timestamptz)

Tipuri de activități canonice:
- `lesson_completed` (completarea unei lecții)
- `quiz_completed` (finalizarea unui quiz de verificare)
- `lesson_started` / `lesson_progress` (progres semnificativ într-o lecție)
- `hidden_answer_revealed` / `self_assessment` (interacțiuni de autoevaluare: „Știam” / „Mai trebuie să repet”)
- `audio_played` / `video_played` (audierea/vizionarea materialelor multimedia)
- `lesson_opened` (deschiderea paginii de lecție — păstrat intern pentru telemetrie)

## 10.2. Reguli de Securitate și Dashboard (Recent Activity)

- **Securitate & RLS:**
  - Studentul poate **CITI DOAR propriile activități** (`SELECT WHERE user_id = auth.uid()`);
  - Studentul **NU poate face INSERT direct din client** în `user_activity`;
  - Studentul **NU poate face UPDATE sau DELETE** pe înregistrările de activitate;
  - Evenimentele `user_activity` sunt generate **exclusiv pe server / trusted flow** în urma validării unei acțiuni educaționale reale (ex: finalizare lecție, trimitere răspuns quiz). Clientul nu poate trimite evenimente falsificate.
- **Filtrare UI:**
  - Dashboard-ul afișează **doar activitățile cu valoare pedagogică reală**, ordonate descrescător după `created_at DESC` (limitat la ultimele 5–10 evenimente).
  - **Ierarhia de prioritizare în UI:**
    1. `lesson_completed`
    2. `quiz_completed`
    3. `lesson_progress` / milestone de învățare
    4. `hidden_answer` / autoevaluare relevantă
  - `lesson_opened` este un eveniment intern de telemetrie și este **filtrat din fluxul Recent Activity** de pe Dashboard pentru a nu polua interfața.
  - Nu se colectează date la fiecare secundă de citire; stream-ul rămâne optimizat și concentrat pe acțiuni semnificative.

---

# 11. Streak

## 11.1. Modelul de Date `user_streaks`

Tabela `user_streaks` monitorizează constanța învățării zilnice a elevului.

- user_id (uuid PK, FK către auth.users)
- current_streak (integer, default 0)
- longest_streak (integer, default 0)
- last_activity_date (date nullable)
- updated_at (timestamptz)

## 11.2. Reguli de Securitate și Calcul Canonic pentru Streak

- **Securitate & RLS:**
  - Studentul poate **CITI DOAR propriul streak** (`SELECT WHERE user_id = auth.uid()`);
  - Studentul **NU poate face INSERT, UPDATE sau DELETE direct din client** în `user_streaks`;
  - Tabela `user_streaks` este gestionată și actualizată **exclusiv server-side de către Streak Engine**, în urma procesării unei activități educaționale eligibile validate.
  - Clientul **NU poate manipula sau falsifica** `current_streak`, `longest_streak` sau `last_activity_date`.

Streak-ul reprezintă **continuitatea activității reale de învățare**, nu simpla autentificare sau deschidere a platformei.

**Ce NU contează pentru Streak:**
- Autentificarea (login);
- Deschiderea aplicației;
- Deschiderea Dashboard-ului;
- Simpla navigare prin pagini;
- Deschiderea Catalogului sau a unei materii.

**Ce CONTEAZĂ ca activitate eligibilă de Streak:**
- Înregistrarea de progres real într-o lecție (`progress_percent` actualizat prin parcurgerea conținutului);
- Completarea unei lecții (`lesson_completed`);
- Completarea unui quiz de verificare (`quiz_completed`);
- Interacțiuni de învățare activă în blocul `hidden_answer` (marcare „Știam” / „Mai trebuie să repet”).

**Algoritmul Canonic de Calcul și Actualizare (Server-Side):**
1. Când utilizatorul efectuează o activitate eligibilă la data curentă `today`:
   - Dacă `last_activity_date == today`: Activitatea de astăzi a fost deja contorizată. **NU se incrementează din nou** (mai multe activități în aceeași zi nu cresc streak-ul repetat).
   - Dacă `last_activity_date == yesterday` (ziua precedentă calendaristică): Streak-ul continuă fără întrerupere:
     - `current_streak = current_streak + 1`;
     - `longest_streak = max(longest_streak, current_streak)`;
     - `last_activity_date = today`.
   - Dacă `last_activity_date < yesterday` sau `last_activity_date IS NULL`: Seria a fost întreruptă sau începe acum:
     - `current_streak = 1`;
     - `longest_streak = max(longest_streak, 1)`;
     - `last_activity_date = today`.

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

## 19.1. Rolul Canonic al Dashboard-ului

Dashboard-ul (`/dashboard`) este centrul operațional și emoțional al experienței studentului pe platformă.

> [!IMPORTANT]
> **RUTE INTERZISE: FĂRĂ `/progress` ȘI FĂRĂ `/profile`**
> Nu se creează pagini separate `/progress` sau `/profile`.
> - Progresul global și pe materii este integrat direct în Dashboard.
> - Informațiile de profil și setările utilizatorului aparțin rutei `/settings` și componentei de profil din Dashboard.

## 19.2. Structura și Ierarhia Vizuală a Dashboard-ului

Dashboard-ul conține 6 module esențiale:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Header: Salut personalizat + Avatar + Status Plan (FREE / PRO)         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. CONTINUE LEARNING (Card Principal de Acțiune)                       │
├──────────────────────────────────┬─────────────────────────────────────┤
│ 2. GLOBAL PROGRESS & STREAK      │ 3. PRO STATUS / UPGRADE BANNER      │
│ - Inel / Bară progres global     │ - Detalii plan curent               │
│ - Zile consecutive (Streak)      │ - Beneficii & CTA Upgrade           │
├──────────────────────────────────┴─────────────────────────────────────┤
│ 4. PROGRESS BY SUBJECT (Progres pe Materii: Română, Istorie, etc.)     │
│ - Carduri interactive cu procentaj total (FREE + PRO în denominator)   │
├────────────────────────────────────────────────────────────────────────┤
│ 5. RECENT ACTIVITY (Istoric Acțiuni Relevante de Învățare)             │
│ - Lista ultimelor activități pedagogice (lecții, quiz-uri, repetiții)  │
└────────────────────────────────────────────────────────────────────────┘
```

## 19.3. Modulul 1: Continue Learning (Continuă de unde ai rămas)

**Regula Canonică de Selecție:**
`Continue Learning` selectează **cea mai recentă lecție `in_progress` a utilizatorului**, ordonată strict după:
$$\text{SELECT * FROM lesson\_progress WHERE user\_id = auth.uid() AND status = 'in\_progress' ORDER BY updated\_at DESC LIMIT 1}$$

- **Dacă există o lecție `in_progress`:**
  - Afișează materia (Subject name & badge);
  - Afișează capitolul / opera literară;
  - Afișează titlul lecției;
  - Afișează procentul curent (`progress_percent`) și bara de progres;
  - Indică ultimul punct de reper parcurs (`last_block_id`);
  - CTA principal de navigare: `Continuă lecția` (navighează direct la `/lesson/:lessonId`).
- **Dacă NU există nicio lecție `in_progress` (Stare Empty / Utilizator Nou):**
  - **NU se afișează un card gol sau spart.**
  - **NU se selectează arbitrar prima lecție din catalog ca fallback.**
  - Se afișează un **Empty State Premium**, cald și motivant (ex: *"Ești gata să începi pregătirea pentru Bac? Alege o materie și începe prima ta lecție."*).
  - CTA primar: `Explorează Catalogul` (navighează la `/catalog`).

## 19.4. Modulul 2: Global Progress & Streak

### Global Progress
- Afișat ca `ProgressRing` sau `ProgressBar` de impact;
- Calculat cu formula canonică: $\frac{\text{completate}}{\text{total publicate}} \times 100$;
- **FREE + PRO** sunt incluse în denominator;
- Oferă transparență totală asupra traseului către nota 10 la Bac.

### Streak Engine
- Afișează numărul de zile consecutive de învățare activă (`current_streak`);
- Indicator vizual dinamic (flacără / icon de streak activ);
- Evidențiază cel mai bun record (`longest_streak`);
- Alimentat exclusiv de activități pedagogice eligibile (progres real, lecție completată, quiz completat, autoevaluare).

## 19.5. Modulul 3: Progress by Subject

- Carduri dedicate pentru fiecare materie publicată (`Română`, `Istorie` etc.);
- Afișează procentul de acoperire al materiei: $\frac{\text{completate în materie}}{\text{total publicate în materie}} \times 100$;
- Afișează raportul numeric (ex: `12 / 40 lecții completate`);
- Indicator discret de conversie PRO: *"X lecții disponibile cu PRO"* + CTA *"Devino PRO"*;
- Click pe card redirecționează către materia respectivă (`/catalog/:subject`).

## 19.6. Modulul 4: Recent Activity

- Afișează ultimele 5–10 activități semnificative pedagogic;
- Ordonare `created_at DESC`;
- Iconițe și etichete clare pentru:
  - Lecție finalizată (`lesson_completed`);
  - Quiz finalizat cu scor (`quiz_completed`);
  - Reper de progres atins (`lesson_progress`);
  - Autoevaluare `hidden_answer` („Știam” / „Mai trebuie să repet”);
- Telemetria de navigare (`lesson_opened`) este ascunsă pentru a menține lista curată și relevantă.
- Pentru un utilizator fără activitate: Empty State discret *"Activitățile tale recente vor apărea aici pe măsură ce înveți."*.

## 19.7. Modulul 5: PRO Status & Monetizare

- **Pentru utilizatori FREE:**
  - Card elegant de status: `Plan Gratuit`;
  - Prezentare sintetică a beneficiilor PRO (toate eseurile, sintezele audio, quiz-urile complete);
  - CTA distinct: `Treci la PRO` (navighează la `/pro`).
- **Pentru utilizatori PRO:**
  - Card de confirmare status: `Student PRO Activ` cu badge auriu / accent;
  - Recunoașterea accesului nelimitat.
- *Notă de implementare:* Stripe Checkout, Billing Portal și Webhooks sunt rezervate pentru milestone-ul dedicat plăților. În Milestone 3 se construiește doar cardul informativ de stare.

## 19.8. Skeleton Loading — Cerință Oficială Obligatorie

> [!IMPORTANT]
> **SKELETON LOADING ESTE O CERINȚĂ STRICTĂ PENTRU DASHBOARD**
> Este strict interzisă utilizarea unui simplu spinner pe ecran alb/gol în timpul încărcării datelor.

În timpul preluării datelor asincrone din Supabase, interfața trebuie să afișeze o structură skeleton fidelă layout-ului final:
1. **Header Skeleton:** placeholder pentru avatar, titlu și badge;
2. **Continue Learning Skeleton:** card mare cu pulse animation pentru titlu, progres și buton;
3. **Progress & Streak Skeleton:** placeholder circular/bară pentru progres și cutie pentru streak;
4. **Subject Progress Skeleton:** grid de 2 carduri de materii cu bare de progres scheletice;
5. **Recent Activity Skeleton:** listă de 3–4 rânduri scheletice cu icon și text placeholders;
6. **PRO Card Skeleton:** container dreptunghiular cu pulse subtil.

Tranziții de stare:
- `Skeleton` $\rightarrow$ `Loaded (Normal / Success)`
- `Skeleton` $\rightarrow$ `Empty (pentru secțiuni fără date)`
- `Skeleton` $\rightarrow$ `Error (cu ErrorState și buton de reîncercare)`

## 19.9. State Design pe Dashboard

Dashboard-ul tratează exhaustiv toate stările posibile:
- **Loading State:** Skeleton-uri complete pe toate modulele;
- **Empty State (Utilizator Nou):**
  - Continue Learning: card primitor cu îndrumare spre Catalog;
  - Progress: inel la 0% cu încurajare;
  - Streak: 0 zile cu mesaj explicativ („Finalizează o lecție pentru a începe seria”);
  - Recent Activity: mesaj liniștit de debut;
- **Error State:** componentă `ErrorState` integrată, cu mesaj prietenos și buton de `Reîncearcă`;
- **Success / Normal State:** toate datele agregate și afișate coerent;
- **Locked / PRO State:** diferențierea nativă a cardurilor între FREE și PRO.

## 19.10. Responsive Design & Ergonomie

- **Pe Mobile (< 768px):**
  - Layout pe o singură coloană verticală;
  - Păstrarea exactă a aceleiași ierarhii (Header $\rightarrow$ Continue Learning $\rightarrow$ Progress/Streak $\rightarrow$ Subjects $\rightarrow$ Recent Activity $\rightarrow$ PRO);
  - Carduri full-width cu padding adaptat (16px);
  - Touch targets de minimum 44x44px pentru toate butoanele și acțiunile.
- **Pe Desktop (≥ 1024px):**
  - Layout compus pe grid armonios cu spațiere generoasă (gap 24–32px);
  - Ierarhie vizuală clară: acțiunea principală (Continue Learning) este vizibilă imediat without excessive scrolling;
  - Design calm, orientat spre studiu, fără animații obositoare.

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
- Skeleton
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
- GlobalProgressCard
- StreakCard
- ProgressSubjectCard
- RecentActivityList
- ProStatusCard
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
- vedea conținutul permis (metadata tuturor lecțiilor publicate, conținutul lecțiilor FREE);
- modifica propriul profil;
- citi și transmite propriul progres (`lesson_progress`, cu validare strictă server-side);
- citi propriul streak (`user_streaks`, read-only pentru client);
- citi propriul istoric de activitate (`user_activity`, read-only pentru client);
- vedea propriul abonament.

Nu poate:
- insera, modifica sau șterge direct înregistrări în `user_streaks` sau `user_activity` (gestionate exclusiv server-side);
- falsifica progresul sau finalizarea lecțiilor fără validare pe server;
- modifica lecții sau conținut educațional;
- accesa sau modifica progresul, streak-ul sau activitatea altui utilizator;
- accesa date admin sau roluri;
- accesa conținut PRO fără abonament activ.

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
5. explora operele/capitolele din pagina materiei și poate deschide lecțiile asociate;
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

# 37. Ordinea efectivă de dezvoltare (Canonical Roadmap)

## Pasul 1 — Foundation
- repository, environment, project setup, design tokens, routing de bază.

## Pasul 2 — Auth + Security
- Supabase Auth, profiles, user_roles, securitate și protecție rute.

## Pasul 3 — Lesson Engine
- schema lecții, blocuri de conținut (`lesson_blocks`), lesson renderer, audio/video drawer, navigare adiacentă.

## Pasul 4 — Catalog
- pagina `/catalog`, pagina materiei `/catalog/:subject`, structură opere/capitole în format Accordion, acces `FREE` / `PRO 🔒`.

## Pasul 5 — Dashboard + Progress + Streak + Activity (Milestone 3)
- Dashboard centralizat `/dashboard`;
- Modul `Continue Learning` (cea mai recentă lecție `in_progress`);
- Modul `Global Progress` (procentaj din toate lecțiile publicate FREE + PRO);
- Modul `Progress by Subject` (procentaj din toate lecțiile materiei FREE + PRO);
- Modul `Streak Engine` (zile consecutive bazate exclusiv pe activitate reală de învățare);
- Modul `Recent Activity` (filtrare evenimente pedagogice relevante);
- Modul `PRO Status` (card informativ stadiu plan FREE / PRO);
- `Skeleton Loading` obligatoriu pe toate modulele;
- Gestionare completă a stărilor (Loading, Empty, Error, Success, Locked).

## Pasul 6 — Quiz Engine
- quizzes, quiz_questions, quiz_options, quiz_attempts, autoevaluare interactivă.

## Pasul 7 — Stripe / PRO subscriptions
- integrare Stripe Checkout, webhook serverless, sincronizare tabele abonamente, portal client.

## Pasul 8 — Admin CMS
- panou administrativ `/admin`, editor vizual de blocuri pe 3 coloane, flux Draft -> Review -> Publish, media library.

## Pasul 9 — AI content pipeline
- pipeline extracție PDF, propunere structură blocuri, asistență umană pentru conținut.

## Pasul 10 — Final Polish / Launch
- microanimații, accesibilitate, optimizare performanță, SEO, audit GDPR/legal, lansare publică.

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
Auth + Security.

### Prompt 3
Lesson Engine.

### Prompt 4
Catalog.

### Prompt 5
Dashboard + Progress + Streak + Activity (Milestone 3).

### Prompt 6
Quiz Engine.

### Prompt 7
Stripe / PRO subscriptions.

### Prompt 8
Admin CMS.

### Prompt 9
AI content pipeline.

### Prompt 10
Final Polish / Launch.

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

## 46.1. Content & Access Control (Milestones 1 & 2)

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

## 46.2. Dashboard, Progress, Streak & Activity (Milestone 3)

1. **Authenticated Student Dashboard Access**: Un elev autentificat poate accesa `/dashboard` și vizualiza toate datele sale agregate.
2. **Guest Dashboard Protection**: Un vizitator neautentificat (Guest) este refuzat și redirecționat automat către `/login`.
3. **Continue Learning Selection**: Cardul afișează cea mai recentă lecție `in_progress` a utilizatorului (`ORDER BY updated_at DESC LIMIT 1`).
4. **New User Empty State**: Un utilizator fără lecții `in_progress` primește un Empty State premium cu îndrumare clară către `/catalog`.
5. **Global Progress Total Denominator**: Progresul Global include în numitor TOATE lecțiile publicate pe platformă (atât `FREE` cât și `PRO`).
6. **Subject Progress Total Denominator**: Progresul pe materie include în numitor TOATE lecțiile publicate din materia respectivă (`FREE` + `PRO`).
7. **Progress Lifecycle**: Parcurgerea conținutului actualizează `last_block_id` și `progress_percent`; finalizarea marchează lecția ca fiind `completed`.
8. **Streak Learning Eligibility**: Numai activitățile reale de învățare (progres real în lecție, completare lecție, quiz, autoevaluare) sunt eligibile pentru streak; vizitarea paginilor/login nu se contorizează.
9. **Streak Daily Idempotency**: Activitățile multiple efectuate în aceeași zi calendaristică NU cresc streak-ul de mai multe ori.
10. **Recent Activity Relevant Feed**: Lista afișează doar acțiunile pedagogice semnificative (`lesson_completed`, `quiz_completed`, progres, autoevaluare); telemetria internă `lesson_opened` este filtrată din UI.
11. **PRO Status Accuracy**: Cardul de status reflectă starea reală de abonament a contului (FREE vs PRO) fără a declanșa încă fluxul complet Stripe.
12. **Mandatory Skeleton Loading**: În timpul încărcării datelor, Dashboard-ul afișează skeleton-uri complete reprezentative pentru fiecare modul (fără spinner central pe ecran gol).
13. **State Matrix Coverage**: Dashboard-ul tratează corect toate stările: Loading (Skeleton), Empty (New user), Error (Retry), Normal/Success, Locked/PRO.
14. **Data Isolation / RLS Security**: Utilizatorul poate citi doar propriile date (progres, streak, activitate); transmiterea progresului (`lesson_progress`) este validată strict server-side, în timp ce `user_streaks` și `user_activity` sunt scrise și actualizate exclusiv server-side.
15. **Responsive Consistency**: Interfața este complet fluidă și adaptată atât pe mobile (o coloană, carduri full-width, touch targets mari), cât și pe desktop (layout spațiat, clar, orientat spre învățare).
