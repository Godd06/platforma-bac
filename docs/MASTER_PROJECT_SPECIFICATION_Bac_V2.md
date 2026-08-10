# MASTER PROJECT SPECIFICATION — Platformă web pentru Bacalaureat

**Versiune:** V2 — specificație extinsă  
**Data:** 10 august 2026  
**Status:** document de lucru / sursă principală a proiectului

> Acest document centralizează deciziile, ideile și direcțiile stabilite până acum. Nu toate elementele sunt definitive. Pentru a evita confuzia, fiecare zonă este marcată după statut.

## Legendă

- **DECIS** — stabilit în discuțiile proiectului.
- **PROPUNERE** — recomandare de design/implementare care poate fi acceptată, modificată sau respinsă.
- **DE DECIS** — încă nu există o decizie finală.

---

# 1. Viziunea produsului

## 1.1. Concept — DECIS

Aplicație web premium pentru elevii de liceu care se pregătesc pentru Bacalaureat.

Platforma va centraliza materiale de învățare structurate pe materii, capitole/opere și lecții. Conținutul nu va fi prezentat ca simple PDF-uri, ci va fi transformat în lecții interactive, ușor de parcurs și de memorat.

Materii vizate inițial:
- Limba și literatura română
- Istorie
- Logică
- Geografie
- Biologie
- alte materii ulterior

Există deja materiale PDF pentru Istorie și Română, care vor reprezenta o sursă importantă pentru construirea primului volum de conținut.

## 1.2. Obiectivul pentru elev — DECIS

Experiența trebuie să transmită:

> „Intru, văd imediat de unde am rămas și pot începe să învăț în câteva secunde.”

Nu vrem un site care doar depozitează informații. Vrem o platformă de învățare.

## 1.3. Obiectivul pentru administrator — DECIS

Administratorul trebuie să poată transforma rapid materialele brute în lecții bine structurate și premium, fără să scrie cod.

> „Material brut → lecție structurată → verificare → publicare.”

---

# 2. Principii generale de produs

## DECIS

1. Experiență simplă pentru elev.
2. Admin puternic și ușor de folosit.
3. Conținut modular.
4. Design modern, premium și memorabil.
5. Mobile-first.
6. Lectura și învățarea au prioritate față de efectele vizuale.
7. Arhitectură extensibilă.
8. Cost minim în faza de construcție.
9. AI-ul ajută la construcție și conținut, dar nu trebuie lăsat să decidă singur arhitectura.
10. Se construiește incremental, nu printr-un singur prompt gigantic.

## PROPUNERE

Păstrăm permanent un „source of truth” al proiectului. Orice AI care lucrează la cod trebuie să respecte acest document și să nu schimbe arhitectura fundamentală fără o decizie explicită.

---

# 3. Arhitectura generală a aplicației

## 3.1. Pagini publice — DECIS

- Landing Page
- Login
- Register
- Pagina de prezentare / upgrade PRO
- eventual pagini juridice

## 3.2. Zona elevului — DECIS

- Dashboard
- Catalog
- Materie
- Capitol / Operă
- Lecție
- Setări
- Upgrade / PRO

Nu se dorește:
- pagină separată de căutare;
- pagină separată „Progresul meu”;
- pagină separată de profil.

Profilul și progresul fac parte din Dashboard.

## 3.3. Admin — DECIS

- Dashboard
- Conținut
- Media
- Quiz-uri
- Utilizatori
- Abonamente
- Analytics
- Setări

Editorul unei lecții nu apare ca secțiune principală separată. Se intră în el din ierarhia Conținutului.

---

# 4. Ierarhia fundamentală a conținutului

## DECIS

Modelul principal:

```text
Materie
  └── Capitol / Operă
        └── Lecție
              └── Blocuri
```

Exemplu Istorie:

```text
Istorie
  └── România postbelică
        ├── Instaurarea comunismului
        ├── Gheorghe Gheorghiu-Dej
        ├── Nicolae Ceaușescu
        └── Revoluția din 1989
```

Exemplu Română:

```text
Română
  └── Liviu Rebreanu — Ion
        ├── Particularitățile operei
        ├── Construcția personajului
        └── Relația dintre personaje
```

Această ierarhie trebuie păstrată și în Admin.

---

# 5. Dashboard elev

## DECIS

Dashboard-ul este centrul personal al aplicației.

Trebuie să răspundă rapid la:

1. Unde am rămas?
2. Cum mă descurc?
3. Ce pot face în continuare?

## Elemente

### Bun venit
- nume;
- avatar;
- acces rapid la profil / setări.

### Continuă de unde ai rămas
Card principal:
- materia;
- capitolul/opera;
- lecția;
- progres;
- buton „Continuă lecția”.

### Streak
- zile consecutive;
- reprezentare vizuală simplă.

### Statistici
Exemple:
- lecții finalizate;
- timp de învățare;
- alte statistici utile.

### Progres pe materii
Exemplu:
- Română — 72%
- Istorie — 54%
- Biologie — 21%

### Activitate recentă
Ultimele lecții accesate / finalizate.

### Status PRO
Dacă este FREE:
- acces limitat;
- CTA pentru upgrade.

Dacă este PRO:
- status activ;
- eventual data următoarei reînnoiri.

## PROPUNERE

Nu supraîncărcăm Dashboard-ul cu grafice. Prioritatea este acțiunea „Continuă să înveți”.

---

# 6. Catalog

## DECIS

Catalogul este biblioteca principală.

Flux:

**Catalog → Materie → Capitol / Operă → Lecție**

Catalogul poate afișa:
- materii;
- progres pe materie;
- număr capitole;
- număr lecții;
- indicator FREE/PRO.

## Căutare — DECIS

Căutarea este inclusă în Catalog, nu are pagină proprie.

Poate căuta:
- materii;
- capitole;
- opere;
- lecții;
- eventual termeni.

Exemplu:
`Ion` → opera și lecțiile asociate.

Exemplu:
`comunism` → lecții relevante.

---

# 7. Pagina materiei

## DECIS

Afișează:
- nume;
- descriere;
- identitate vizuală;
- progres;
- lista capitolelor / operelor.

Fiecare capitol este accesibil prin click.

## PROPUNERE

Cardurile capitolelor să arate:
- titlu;
- descriere scurtă;
- număr lecții;
- progres;
- durată estimată totală;
- indicator FREE/PRO.

---

# 8. Pagina capitolului

## DECIS

Afișează:
- titlu;
- descriere;
- cuprinsul lecțiilor;
- progres;
- durata estimată;
- acces la lecții.

Poate exista un buton „Continuă de unde ai rămas”.

---

# 9. Istorie — structură de conținut

## DECIS

Pentru Istorie:

### Capitol
Are o descriere scurtă.

### Lecție
Conține informația propriu-zisă, explicată și structurată.

Poate include:
- text;
- „De reținut”;
- scheme;
- imagini;
- hărți;
- cronologii;
- alte elemente vizuale;
- audio;
- video.

### Rezumat / Ce trebuie să știi
O secțiune foarte scurtă care concentrează lucrurile pe care elevul trebuie să le țină minte.

## PROPUNERE

Rezumatul să fie un bloc special, vizual distinct, care poate fi parcurs independent înainte de recapitulare.

---

# 10. Română — structură de conținut

## DECIS

Româna va avea o organizare diferită de Istorie.

Ordinea poate separa conținutul în zone precum:
- proză;
- liric;
- alte categorii.

Nu este obligatoriu ca acestea să fie tratate ca o clasificare formală; sunt în primul rând o organizare a capitolelor.

## Opera

Titlul capitolului va avea forma:

**Autorul — Opera — tipul operei**

Exemplu conceptual:

**Liviu Rebreanu — Ion — roman realist obiectiv**

## Lecții pentru o operă

În funcție de caz:

1. Particularitățile operei
2. Construcția personajului
3. Relația dintre cele două personaje

Acolo unde o categorie nu se aplică, nu apare.

## Eseuri

Fiecare lecție conține eseul relevant.

Eseul este structurat în ordinea elementelor cerute în barem.

Se păstrează sistemul modular de blocuri.

---

# 11. Blocurile de lecție

## DECIS

Lecția este compusă din blocuri independente, nu dintr-un singur câmp mare de text.

Tipuri de blocuri planificate:

- Text
- Titlu / subtitlu
- De reținut
- Important pentru Bac
- Definiție
- Imagine
- Hartă
- Tabel
- Cronologie
- Casetă informativă
- Audio
- Video
- Ce trebuie să știi
- Recapitulare
- Quiz / întrebare

## Funcții

Fiecare bloc poate fi:
- adăugat;
- editat;
- șters;
- duplicat;
- mutat;
- reordonat prin drag & drop.

## DE DECIS

Lista finală de tipuri de blocuri și proprietățile exacte ale fiecăruia.

---

# 12. Pagina lecției

## DECIS

Pagina lecției conține:
- titlu;
- conținut;
- cuprins;
- audio/video, dacă există;
- sistem „Învață”, ulterior;
- recapitulare;
- eventual quiz;
- navigare către lecția anterioară;
- navigare către lecția următoare.

## Navigare lecții — DECIS

Butoanele:
- „Lecția anterioară”
- „Lecția următoare”

apar:
- sus;
- jos, la finalul lecției.

Scopul este continuitatea fără revenire în Catalog.

---

# 13. Drawer-ul lecției

## DECIS

În partea stângă există un drawer cu cuprinsul lecției.

Pe desktop:
- sidebar / drawer.

Pe mobil:
- drawer/overlay care se deschide peste conținut.

Conținut:
- cuprins;
- secțiunea activă evidențiată;
- eventual stare/progres pe secțiuni.

Sub cuprins:

### Audio
Apare numai dacă lecția are audio.

### Video
Apare numai dacă lecția are video.

Dacă nu există media respectivă, zona nu apare.

## PROPUNERE

Playerul din drawer trebuie să fie compact. Pe mobil, video-ul poate fi mutat într-o zonă principală sau modală pentru o experiență mai bună.

---

# 14. Sistemul „Învață”

## DECIS — direcție

Va exista un sistem de învățare activă bazat, printre altele, pe text ascuns.

Ideea:
- elevul nu doar citește;
- anumite informații pot fi ascunse;
- elevul încearcă să le reproducă;
- apoi dezvăluie răspunsul.

## DE DECIS

Sistemul complet:
- moduri de exercițiu;
- scor;
- repetare;
- intervale;
- integrarea cu quiz;
- integrarea cu progres.

Nu trebuie implementat în prima versiune dacă ar întârzia lansarea MVP.

---

# 15. Audio și video

## DECIS

Anumite lecții pot avea:
- eseu audio;
- explicații audio;
- animații;
- video;
- alte materiale multimedia.

Media apare numai când există.

Exemplu Română:
- eseul poate avea o versiune audio pentru ascultare / repetare.

---

# 16. Design system

## Direcție — DECIS

Design:
- modern;
- premium;
- elegant;
- ușor futurist;
- cu glow;
- elemente 3D subtile;
- animații.

## Fundal

Idei discutate:
- orbs colorate;
- gradient-uri;
- pattern cu pătrățele / puncte;
- particule;
- forme geometrice.

## Efecte

- glow;
- blur;
- glassmorphism discret;
- hover;
- micro-interacțiuni;
- tranziții fluide;
- progres animat.

## Regula principală — DECIS

Designul trebuie să fie spectaculos, dar să nu afecteze învățarea.

Landing / Dashboard / Catalog:
- pot avea efecte mai pronunțate.

Lecția:
- mai calmă;
- focus pe text;
- contrast bun;
- spațiere generoasă;
- fără animații care distrag.

---

# 17. Identitatea vizuală a materiilor

## PROPUNERE

Fiecare materie poate avea un accent cromatic și/sau element vizual distinct.

Exemplu conceptual:
- Română;
- Istorie;
- Biologie;
- Geografie.

Dar toate trebuie să rămână în același design system.

Nu se dorește un aspect de „curcubeu”.

---

# 18. Responsive / Mobile

## DECIS

Aplicația este mobile-first.

Pe mobil:
- drawer overlay;
- carduri stivuite;
- Dashboard vertical;
- text ușor de citit;
- video adaptat;
- controale accesibile cu degetul.

Pe desktop:
- layout larg;
- sidebar/drawer;
- coloane;
- carduri.

Nu se construiește întâi un desktop și apoi se „micșorează”.

---

# 19. FREE și PRO

## DECIS

### FREE
- câteva lecții de test;
- acces limitat.

### PRO
- deblochează conținutul premium;
- abonament lunar.

## Securitate — DECIS

Regula FREE/PRO trebuie verificată în backend, nu doar în UI.

Frontend-ul nu trebuie să fie singura protecție pentru conținutul PRO.

## DE DECIS

- preț;
- perioadă de trial, dacă există;
- limite exacte FREE;
- eventuale reduceri;
- anulare;
- comportamentul după expirarea abonamentului.

---

# 20. Admin — filosofia generală

## DECIS

Admin-ul este un CMS educațional.

Ierarhia:

**Conținut → Materie → Capitol/Operă → Lecție → Blocuri**

Administratorul poate edita fiecare nivel individual.

Nu se dorește un meniu principal în care Materii, Capitole și Lecții sunt complet independente.

---

# 21. Admin — meniul

## DECIS

```text
Dashboard
Conținut
Media
Quiz-uri
Utilizatori
Abonamente
Analytics
Setări
```

---

# 22. Admin — Conținut

## DECIS

Pagina principală afișează materiile.

Exemplu:

```text
ROMÂNĂ
12 opere · 36 lecții
[Editează materia]

ISTORIE
8 capitole · 52 lecții
[Editează materia]
```

Există:
- căutare;
- adăugare materie.

---

# 23. Admin — Materie

## DECIS

Administratorul poate modifica:
- nume;
- descriere;
- icon / imagine;
- ordine;
- vizibilitate;
- acces;
- capitole.

Capitolele pot fi reordonate prin drag & drop.

---

# 24. Admin — Capitol

## DECIS

Administratorul poate modifica:
- titlu;
- descriere;
- imagine;
- ordine;
- acces;
- lecții.

Lecțiile pot fi reordonate prin drag & drop.

---

# 25. Admin — Lecție

## DECIS

Administratorul poate modifica:
- titlu;
- descriere;
- copertă;
- materia;
- capitolul;
- acces FREE/PRO;
- durata;
- blocurile;
- audio;
- video;
- quiz;
- sistem „Învață”;
- status.

Acțiuni:
- Save;
- Preview;
- Publish.

---

# 26. Editorul de lecții

## DECIS — direcție

Editor vizual modular.

Conceptual:
- stânga: structură / blocuri;
- centru: conținut;
- dreapta: proprietăți.

Se va putea adăuga un bloc nou și apoi modifica conținutul lui.

## Funcții planificate

- drag & drop;
- duplicare;
- ștergere;
- editare;
- preview;
- salvare;
- publicare.

## DE DECIS

- autosave;
- undo/redo;
- shortcut-uri;
- versiuni;
- colaborare simultană.

---

# 27. Template-uri

## DECIS

Pentru conținut repetitiv trebuie să existe template-uri.

Exemple Română:
- Particularitățile operei;
- Construcția personajului;
- Relația dintre personaje.

Exemplu Istorie:
- Lecție Istorie.

Template-ul creează structura inițială, iar editorul completează conținutul.

Lecțiile existente trebuie să poată fi duplicate.

---

# 28. Preview și publicare

## DECIS

Flux:

**Draft → În verificare → Publicat**

Admin trebuie să poată vedea lecția înainte de publicare în modul cât mai apropiat de experiența elevului.

---

# 29. Media Library

## DECIS

Admin → Media

Tipuri:
- imagini;
- audio;
- video;
- hărți;
- documente.

Funcții:
- upload;
- căutare;
- reutilizare;
- gestionare;
- atașare la lecții.

Un fișier trebuie să poată fi reutilizat în mai multe lecții fără reîncărcare.

---

# 30. Quiz-uri

## DECIS — direcție

Tipuri inițiale:
- alegere multiplă;
- adevărat/fals;
- răspuns liber.

Întrebarea poate avea:
- enunț;
- variante;
- răspuns corect;
- explicație.

Quiz-urile vor putea fi folosite ulterior de sistemul „Învață”.

## DE DECIS

- algoritmul de punctare;
- feedback;
- statistici;
- repetare;
- întrebări randomizate.

---

# 31. Utilizatori

## DECIS

Admin poate vedea:
- utilizator;
- plan;
- activitate;
- data înregistrării;
- progres;
- lecții finalizate;
- streak;
- abonament.

Parolele nu sunt vizibile în Admin.

---

# 32. Roluri Admin

## DECIS — direcție

### Super Admin
Acces complet.

### Editor
Poate administra conținutul.

### Reviewer
Poate verifica / aproba conținutul.

## DE DECIS

Permisiunile exacte pentru fiecare acțiune.

---

# 33. Abonamente în Admin

## DECIS

Admin → Abonamente

Afișează:
- FREE;
- PRO;
- active;
- anulate;
- plăți eșuate;
- venituri;
- conversie.

---

# 34. Analytics

## DECIS — V1 simplu

- utilizatori activi;
- lecții accesate;
- lecții finalizate;
- timp de învățare;
- conținut popular;
- conversie FREE → PRO.

Nu se dorește analytics excesiv în prima versiune.

---

# 35. Setări

## DECIS

Categorii:
- Site;
- conținut;
- abonamente;
- administratori / roluri;
- setări generale.

---

# 36. AI pentru conținut

## DIRECȚIE — DECISĂ

Pe termen mediu:

**PDF → AI → propunere de structură → verificare umană → Draft → Preview → Publish**

AI poate propune:
- titlu;
- introducere;
- secțiuni;
- „De reținut”;
- cronologie;
- „Important pentru Bac”;
- recapitulare;
- quiz.

AI nu publică automat.

---

# 37. Stack tehnic — direcție

## PROPUNERE, NU DECIZIE FINALĂ

### Frontend
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Supabase
- PostgreSQL
- Auth
- Storage

### Hosting
- Vercel

### Versionare
- GitHub

### Plăți
- Stripe

### AI
- OpenAI API, ulterior, dacă este necesar.

### Vibe-coding
Lovable a fost discutat, dar builderul final rămâne de ales.

Înainte de decizie trebuie comparate:
- cost;
- limite;
- calitatea codului;
- suport pentru Supabase;
- GitHub;
- control asupra codului;
- posibilitatea de a continua proiectul în alt IDE;
- limitele utilizării AI.

---

# 38. Strategie de cost

## DECIS

Obiectivul este cost cât mai apropiat de 0 € în faza de dezvoltare.

Preferințe:
- planuri gratuite;
- open-source;
- servicii care nu necesită plată înainte de lansare;
- amânarea serviciilor premium.

Nu se dorește ocolirea limitelor prin încălcarea regulilor serviciilor sau prin conturi multiple folosite pentru a evita restricțiile.

## Probabile costuri viitoare

- domeniu;
- hosting/backend după limite;
- storage;
- video;
- procesare plăți;
- AI API;
- eventual servicii email.

---

# 39. Strategie de vibe-coding

## Lecția din încercările anterioare

Au existat încercări cu v0 și Bolt și prompturi generate de Gemini, iar rezultatul nu a fost satisfăcător.

Problema de evitat:
- prompt gigant;
- AI construiește tot;
- modificări succesive;
- apar regresii;
- arhitectura devine incoerentă.

## Strategia nouă

1. Specificație înainte de cod.
2. Arhitectură înainte de UI complex.
3. Implementare incrementală.
4. Verificare după fiecare etapă.
5. Prompturi precise.
6. Nu schimbăm mai multe sisteme simultan.
7. GitHub / versionare.
8. Debugging controlat.
9. Un document „source of truth”.
10. Orice schimbare importantă trebuie să respecte arhitectura existentă.

---

# 40. Posibilitatea de a folosi mai multe AI-uri

## PROPUNERE

Putem separa rolurile:

### AI arhitect / consultant
- specificații;
- UX;
- arhitectură;
- debugging;
- prompturi.

### AI builder
- scrie / modifică codul.

### AI secundar
- review;
- second opinion;
- analiză;
- găsirea problemelor.

Este posibil să folosim mai multe instrumente sau conturi doar în conformitate cu termenii fiecărui serviciu.

---

# 41. Reguli de modificare a codului

## PROPUNERE

AI-ul care modifică proiectul trebuie să respecte:

1. Nu rescrie componente funcționale fără motiv.
2. Nu creează o a doua versiune a unei funcții deja existente.
3. Nu schimbă schema DB fără migrare.
4. Nu schimbă design system-ul pentru o singură pagină.
5. Reutilizează componentele existente.
6. Nu introduce dependențe inutile.
7. Nu elimină funcționalități pentru a implementa o cerință nouă.
8. Verifică responsive după schimbări UI.
9. Verifică permisiunile după schimbări de date.
10. Menține compatibilitatea cu sursa principală a proiectului.

---

# 42. Regula de debugging

## PROPUNERE

Nu:

> „Nu merge, repară.”

Ci:

> „După ultima modificare, X funcționa. Acum Y nu mai funcționează. Nu modifica X. Identifică cauza și repară doar Y.”

Pentru bug-uri importante:
- reproducere;
- identificarea cauzei;
- modificare minimă;
- test;
- verificarea regresiilor.

---

# 43. Schema conceptuală a datelor

## DIRECȚIE

```text
User
 ├── Profile
 ├── Subscription
 ├── Progress
 ├── Activity
 └── Streak

Subject
 └── Chapter
      └── Lesson
           └── LessonBlock

Lesson
 ├── Media
 ├── Quiz
 └── Learning data
```

## DE DECIS

Schema PostgreSQL exactă:
- tabele;
- chei;
- relații;
- indexuri;
- RLS;
- politici;
- statusuri;
- tipuri de blocuri.

Aceasta trebuie definită înainte de implementarea serioasă a backend-ului.

---

# 44. Securitate

## DECIS — principii

- accesul PRO nu este protejat doar în frontend;
- datele utilizatorului trebuie protejate;
- rolurile Admin trebuie verificate server-side;
- storage-ul trebuie configurat cu permisiuni;
- conținutul privat nu trebuie expus prin URL-uri publice dacă nu este necesar.

## DE DECIS

- politici RLS;
- structura exactă a permisiunilor;
- protecția media;
- backup;
- audit log.

---

# 45. Etapele MVP

## Etapa 1 — Fundația
- repository;
- proiect;
- design system;
- navigare;
- responsive;
- Landing;
- Login/Register.

## Etapa 2 — Database + Auth
- Supabase;
- utilizatori;
- roluri;
- materii;
- capitole;
- lecții;
- blocuri.

## Etapa 3 — Admin
- Dashboard;
- Conținut;
- Materie;
- Capitol;
- Lecție;
- editor;
- template-uri;
- preview;
- statusuri.

## Etapa 4 — Elev
- Dashboard;
- Catalog;
- Materie;
- Capitol;
- Lecție;
- drawer;
- navigare.

## Etapa 5 — Progres
- lecții accesate;
- lecții finalizate;
- progres;
- streak;
- activitate.

## Etapa 6 — Media
- Media Library;
- imagini;
- audio;
- video;
- player.

## Etapa 7 — FREE/PRO
- permisiuni;
- UI de upgrade;
- conținut blocat.

## Etapa 8 — Plăți
- Stripe;
- abonament;
- webhook;
- sincronizare PRO.

## Etapa 9 — Learning System
- text ascuns;
- recapitulare;
- quiz;
- memorare activă.

## Etapa 10 — AI Content
- import PDF;
- structurare;
- quiz;
- propuneri de blocuri;
- verificare umană.

## Etapa 11 — Polish
- animații;
- accesibilitate;
- SEO;
- performanță;
- securitate;
- testare.

---

# 46. Ce NU este încă decis

- numele;
- logo;
- paleta exactă;
- fonturile;
- prețul PRO;
- limitele FREE;
- materiile din prima lansare;
- sistemul final „Învață”;
- furnizorul video;
- builderul final;
- schema exactă PostgreSQL;
- politica GDPR;
- analytics final;
- notificări;
- Google login;
- domeniul;
- email transactional;
- backup strategy.

Acestea nu trebuie inventate înainte de momentul potrivit.

---

# 47. Criteriul de succes

## Pentru elev

În câteva secunde:
1. intră;
2. vede unde a rămas;
3. apasă „Continuă”;
4. poate începe să învețe.

## Pentru administrator

În câteva minute:
1. creează o materie / capitol / lecție;
2. folosește un template;
3. adaugă blocuri;
4. atașează media;
5. verifică Preview;
6. publică.

## Pentru produs

Aplicația trebuie să fie suficient de bună încât:
- elevii să revină;
- progresul să fie vizibil;
- conținutul să poată crește rapid;
- costurile să rămână mici la început;
- arhitectura să permită dezvoltare ulterioară.

---

# 48. Următorul pas recomandat

Înainte de alegerea definitivă a builderului:

1. definitivăm schema de date;
2. definitivăm componentele UI principale;
3. definim design system-ul minim;
4. definim exact paginile și stările lor;
5. comparăm 2–4 opțiuni de vibe-coding după cost și capabilități;
6. alegem tool-ul;
7. creăm repository-ul;
8. construim Etapa 1.

**Nu se începe cu un prompt de tip „construiește toată aplicația”.**

