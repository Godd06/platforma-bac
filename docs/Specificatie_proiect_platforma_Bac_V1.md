# Platformă web pentru pregătirea Bacalaureatului --- Document de proiect

**Versiune:** V1 --- concept și arhitectură inițială\
**Data:** 10 august 2026

------------------------------------------------------------------------

## 1. Viziunea produsului

Aplicație web modernă pentru elevii de liceu care se pregătesc pentru
Bacalaureat.

Scopul este să ofere într-un singur loc materiale de învățare
structurate, clare și ușor de parcurs pentru materiile de Bac, cu o
experiență mai apropiată de o platformă modernă de learning decât de un
simplu site cu PDF-uri.

Materii planificate inițial: - Limba și literatura română - Istorie -
Logică - Geografie - Biologie - alte materii pot fi adăugate ulterior

Conținutul existent include deja materiale PDF pentru Istorie și Română.
Acestea vor fi transformate în capitole, opere și lecții separate.

Produsul trebuie să fie construit astfel încât administratorul să poată
adăuga și modifica conținut fără să programeze.

------------------------------------------------------------------------

# 2. Principii de produs

1.  **Simplu pentru elev.** Navigarea trebuie să fie intuitivă.
2.  **Eficient pentru administrator.** Conținutul trebuie să poată fi
    creat și modificat rapid.
3.  **Premium, dar nu obositor.** Designul poate fi spectaculos, însă
    lectura trebuie să rămână prioritară.
4.  **Mobile-first.** O parte importantă dintre elevi vor folosi
    telefonul.
5.  **Modular.** Lecțiile trebuie construite din blocuri reutilizabile.
6.  **Extensibil.** Arhitectura trebuie să permită ulterior quiz-uri,
    sistem de învățare, AI, mai multe materii și mai mulți
    administratori.
7.  **Cost minim în faza inițială.** Se preferă servicii cu planuri
    gratuite și evitarea cheltuielilor înainte ca acestea să fie
    necesare.
8.  **AI ca instrument, nu ca arhitect autonom.** AI-ul trebuie să
    implementeze specificații clare, nu să inventeze arhitectura
    proiectului.

------------------------------------------------------------------------

# 3. Structura principală a aplicației

## Partea publică

-   Landing Page
-   Login
-   Register
-   Pagina publică de prezentare PRO / prețuri

## Partea elevului

-   Dashboard
-   Catalog
    -   Căutare integrată
    -   Materie
    -   Capitol / Operă
    -   Lecție
-   Setări
-   Upgrade / PRO

Nu se dorește: - pagină separată pentru căutare; - pagină separată
pentru „Progresul meu"; - pagină separată pentru profil.

Profilul, progresul și informațiile personale sunt integrate în
Dashboard.

------------------------------------------------------------------------

# 4. Dashboard-ul elevului

Dashboard-ul este centrul personal al aplicației și trebuie să răspundă
rapid la trei întrebări:

1.  Unde am rămas?
2.  Cum mă descurc?
3.  Ce pot face în continuare?

Elemente principale:

### Salut / profil

-   avatar
-   numele elevului
-   acces rapid la profil / setări prin avatar

### Continuă de unde ai rămas

Card principal cu: - materia - capitolul / opera - lecția - progresul
lecției - buton „Continuă lecția"

### Streak

-   numărul de zile consecutive de învățare
-   reprezentare simplă a zilelor

### Statistici

Exemple: - lecții finalizate - timp de învățare - alte statistici
relevante

### Progres pe materii

Exemplu: - Română --- 72% - Istorie --- 54% - Biologie --- 21%

### Activitate recentă

Lista ultimelor lecții accesate / finalizate.

### Abonament

Status FREE / PRO și, dacă este cazul, informații despre abonament.

Nu se dorește supraîncărcarea Dashboard-ului cu grafice inutile.

------------------------------------------------------------------------

# 5. Catalog

Catalogul este biblioteca de conținut.

Fluxul principal:

**Catalog → Materie → Capitol / Operă → Lecție**

Catalogul trebuie să conțină: - carduri pentru materii; - progresul pe
materie; - numărul de capitole / lecții; - indicarea conținutului FREE /
PRO, unde este relevant.

## Căutarea

Căutarea este integrată direct în pagina Catalog.

Poate căuta: - materii; - capitole; - lecții; - opere; - eventual
concepte / termeni.

Exemple: - „comunism" → lecții relevante din Istorie; - „Ion" → opera și
lecțiile asociate din Română.

Căutarea este o scurtătură, nu înlocuiește ierarhia Catalog → Materie →
Capitol → Lecție.

------------------------------------------------------------------------

# 6. Structura unei materii

O materie are: - titlu; - descriere; - imagine / icon / identitate
vizuală; - ordine în catalog; - capitole / opere; - progres calculat pe
baza lecțiilor.

Exemplu Istorie:

1.  România modernă
2.  România interbelică
3.  România postbelică

------------------------------------------------------------------------

# 7. Structura unui capitol

Un capitol are: - titlu; - descriere scurtă; - eventual imagine; -
ordine; - lecții; - statut / acces FREE sau PRO, dacă este necesar.

Pagina capitolului afișează: - descriere; - cuprinsul lecțiilor; -
progres; - durata estimată; - buton de continuare de unde a rămas
elevul.

------------------------------------------------------------------------

# 8. Lecții --- Istorie

Structura stabilită pentru Istorie:

### 1. Capitol

Descriere scurtă.

### 2. Lecție

Conținutul propriu-zis, explicat și structurat clar, pe baza
materialelor existente.

În lecție pot exista: - text structurat; - blocuri „De reținut"; -
scheme; - imagini; - hărți; - cronologii; - alte elemente vizuale; -
materiale audio; - materiale video.

### 3. Rezumat / Ce trebuie să știi

O secțiune foarte scurtă cu informațiile esențiale pe care elevul
trebuie să le rețină.

Structura poate fi îmbunătățită ulterior, fără a schimba principiul.

------------------------------------------------------------------------

# 9. Lecții --- Română

Pentru Română, organizarea este diferită.

Conținutul poate fi ordonat pe zone precum: - proză; - liric; - alte
categorii relevante.

Nu este obligatoriu ca acestea să fie prezentate ca o clasificare
formală; sunt în primul rând o modalitate de organizare a capitolelor.

Formatul unei opere:

**Autorul --- Opera --- tipul operei**

Exemplu conceptual: **Liviu Rebreanu --- Ion --- roman realist
obiectiv**

Pentru o operă pot exista lecții diferite, în funcție de cerințele de
Bac:

1.  Particularitățile operei
2.  Construcția personajului
3.  Relația dintre cele două personaje, acolo unde este cazul

Fiecare lecție conține eseul corespunzător, structurat în ordinea
elementelor cerute de barem.

Și aici se păstrează sistemul de blocuri.

------------------------------------------------------------------------

# 10. Sistemul de blocuri pentru lecții

Lecțiile nu trebuie tratate ca un singur câmp mare de text.

Ele sunt construite din blocuri independente.

Tipuri de blocuri planificate: - Text - Titlu / subtitlu - De reținut -
Important pentru Bac - Definiție - Imagine - Hartă - Tabel -
Cronologie - Casetă informativă - Audio - Video - Ce trebuie să știi -
Recapitulare - Întrebare / Quiz

Blocurile trebuie: - adăugate; - editate; - șterse; - duplicate; -
reordonate prin drag & drop; - eventual ascunse temporar.

Tipurile de blocuri pot fi extinse ulterior.

------------------------------------------------------------------------

# 11. Sistemul „Învață"

Există planul pentru un sistem de învățare bazat pe text ascuns /
memorare activă.

Sistemul nu este definit complet în V1.

Ideea este ca elevul să poată învăța activ, nu doar să citească lecția.

Va fi proiectat ulterior ca sistem clar, reutilizabil în lecții și
eventual conectat cu quiz-uri și progres.

------------------------------------------------------------------------

# 12. Pagina unei lecții --- UX

Pagina lecției trebuie să conțină:

-   titlul lecției;
-   conținutul modular;
-   progresul în lecție;
-   navigare către lecția anterioară;
-   navigare către lecția următoare;
-   aceleași butoane de navigare și sus, și jos;
-   sistemul „Învață", când va fi implementat;
-   recapitulare;
-   eventual quiz;
-   audio / video dacă există.

## Drawer lateral

În partea stângă există un drawer cu cuprinsul lecției.

Pe desktop poate fi sidebar. Pe mobil se deschide peste conținut.

Drawer-ul este similar conceptual cu lista de conversații din aplicația
ChatGPT pe telefon.

Conține: - cuprinsul lecției; - secțiunea curentă evidențiată; - progres
/ stare pe secțiuni, unde este relevant.

Sub cuprins pot exista:

### Audio

Player audio compact, doar dacă lecția are audio.

### Video

Acces la video, doar dacă lecția are video.

Dacă nu există audio sau video, secțiunea respectivă nu apare deloc.

Pentru video, pe mobil se preferă deschiderea într-o zonă principală /
modală, nu un player înghesuit în drawer.

------------------------------------------------------------------------

# 13. Navigarea între lecții

Buton: - Lecția anterioară - Lecția următoare

Trebuie să existe: - sus, înainte / în timpul conținutului; - jos, la
finalul lecției.

Scopul este ca elevul să poată continua fără să revină în catalog sau
drawer.

------------------------------------------------------------------------

# 14. Design și identitate vizuală

Direcția dorită:

**modernă + premium + elegantă + ușor futuristă**

Elemente vizuale: - glow; - orbs de culoare; - gradient-uri; - pattern
cu puncte / pătrățele; - forme geometrice; - elemente 3D subtile; -
blur; - glassmorphism discret; - animații și micro-interacțiuni; - hover
effects; - tranziții fluide; - progres animat.

Designul nu trebuie să devină excesiv.

Principiu: **„Wow" vizual, dar foarte ușor de folosit.**

În paginile de explorare (Landing, Dashboard, Catalog) efectele pot fi
mai pronunțate.

În pagina de lecție, designul trebuie să fie mai calm, pentru a nu obosi
la citire.

Textul rămâne prioritar.

------------------------------------------------------------------------

# 15. Identitatea vizuală a materiilor

Materiile pot avea accente vizuale proprii, dar controlate.

Exemple conceptuale: - Română - Istorie - Biologie - Geografie

Culorile nu trebuie folosite excesiv. Designul general trebuie să rămână
coerent.

------------------------------------------------------------------------

# 16. Responsive / Mobile

Aplicația trebuie proiectată mobile-first.

Pe mobil: - drawer-ul devine overlay; - navigarea poate avea bottom
navigation; - Dashboard-ul se reorganizează vertical; - cardurile se
adaptează; - video nu trebuie înghesuit în sidebar; - textul lecțiilor
trebuie să fie foarte ușor de citit.

Pe desktop: - sidebar / drawer; - layout mai larg; - carduri și
coloane; - spațiu mai mare pentru conținut.

Nu se dorește un desktop design „micșorat" artificial pentru telefon.

------------------------------------------------------------------------

# 17. FREE vs PRO

Modelul comercial:

### FREE

-   câteva lecții de test;
-   acces limitat la conținut.

### PRO

-   deblochează tot conținutul relevant;
-   abonament lunar.

Limitele exacte FREE/PRO se vor stabili ulterior.

Important: accesul PRO trebuie verificat și în backend, nu doar ascuns
în interfața frontend.

În lecțiile blocate: - se afișează clar că sunt PRO; - există CTA
„Devino PRO".

------------------------------------------------------------------------

# 18. Admin --- principiu general

Admin-ul trebuie să funcționeze ca un CMS educațional.

Principiul fundamental:

**Admin → Conținut → Materie → Capitol / Operă → Lecție → Blocuri**

Nu se dorește un Admin „plat" în care Materii, Capitole și Lecții sunt
trei secțiuni independente.

Ierarhia trebuie păstrată și să poată fi editată natural.

------------------------------------------------------------------------

# 19. Admin --- meniul principal

Structura aprobată:

-   Dashboard
-   Conținut
-   Media
-   Quiz-uri
-   Utilizatori
-   Abonamente
-   Analytics
-   Setări

Editorul de lecții NU este o secțiune separată în meniul principal.

El se deschide atunci când creezi / editezi o lecție.

------------------------------------------------------------------------

# 20. Admin Dashboard

Trebuie să ofere o imagine rapidă asupra platformei.

### Conținut

-   număr materii;
-   număr capitole;
-   număr lecții;
-   număr audio;
-   număr video.

### Utilizatori

-   total;
-   activi;
-   PRO.

### Elemente care necesită atenție

Exemple: - lecții nepublicate; - lecții fără imagine; - media cu
probleme.

### Activitate recentă

Exemple: - lecții modificate; - lecții publicate.

------------------------------------------------------------------------

# 21. Admin --- Conținut

Conținutul este centrul administrării.

Pagina principală poate afișa materiile.

Exemplu:

**Română** - număr opere / lecții; - buton „Editează materia".

**Istorie** - număr capitole / lecții; - buton „Editează materia".

Există: - căutare; - adăugare materie.

------------------------------------------------------------------------

# 22. Editarea unei materii

Administratorul poate modifica individual:

-   numele;
-   descrierea;
-   icon / imagine;
-   ordinea în catalog;
-   vizibilitatea;
-   statutul Free / PRO, dacă este relevant;
-   capitolele.

Capitolele pot fi reordonate prin drag & drop.

------------------------------------------------------------------------

# 23. Editarea unui capitol

Administratorul poate modifica individual:

-   titlul;
-   descrierea;
-   imaginea;
-   ordinea;
-   accesul;
-   lecțiile.

Lecțiile pot fi reordonate prin drag & drop.

------------------------------------------------------------------------

# 24. Editarea unei lecții

Editorul de lecții trebuie să permită:

-   titlu;
-   descriere;
-   imagine / copertă;
-   materie;
-   capitol;
-   acces FREE/PRO;
-   durată estimată;
-   blocuri;
-   audio;
-   video;
-   quiz;
-   sistem „Învață";
-   status;
-   previzualizare.

------------------------------------------------------------------------

# 25. Editorul de lecții

Conceptual, layout:

### Stânga

Structura lecției.

### Centru

Conținutul și blocurile.

### Dreapta

Proprietățile lecției.

Acțiuni: - Preview; - Save; - Publish.

Editorul trebuie să fie simplu, vizual și să nu necesite cod.

------------------------------------------------------------------------

# 26. Template-uri de lecții

Pentru conținut repetitiv, trebuie să existe șabloane.

Exemple:

### Română

-   Eseu --- Particularitățile operei
-   Eseu --- Construcția personajului
-   Eseu --- Relația dintre personaje

### Istorie

-   Lecție Istorie

La crearea unei lecții:

**Alege un șablon**

Editorul creează automat structura, iar administratorul înlocuiește
conținutul.

Lecțiile existente trebuie să poată fi și duplicate.

Acest lucru este foarte important pentru volumul mare de conținut.

------------------------------------------------------------------------

# 27. Preview

Editorul trebuie să aibă Preview.

Administratorul trebuie să poată vedea lecția cât mai aproape de
experiența elevului înainte de publicare.

Ideal: **Editare \| Preview**

------------------------------------------------------------------------

# 28. Status conținut

Flux dorit:

**Draft → În verificare → Publicat**

Nu doar Publicat / Nepublicat.

Acest lucru previne publicarea accidentală.

------------------------------------------------------------------------

# 29. Media Library

Admin → Media

Bibliotecă centrală pentru: - imagini; - audio; - video; - hărți; -
documente.

Funcții: - upload; - căutare; - reutilizare; - ștergere / gestionare; -
atașare la lecții.

Același fișier trebuie să poată fi folosit în mai multe lecții fără
reîncărcare.

------------------------------------------------------------------------

# 30. Quiz-uri

V1 poate avea: - alegere multiplă; - adevărat / fals; - răspuns liber.

O întrebare are: - enunț; - variante, dacă este cazul; - răspuns
corect; - explicație.

Quiz-urile trebuie să poată fi reutilizate ulterior de sistemul
„Învață".

------------------------------------------------------------------------

# 31. Utilizatori

Admin poate vedea: - utilizator; - plan; - activitate; - data
înregistrării; - progres; - lecții finalizate; - streak; - abonament.

Nu se stochează / afișează parole.

------------------------------------------------------------------------

# 32. Roluri Admin

Planificate:

### Super Admin

Acces complet.

### Editor

Poate: - crea / modifica lecții; - modifica materii / capitole; -
încărca media; - publica, dacă i se acordă permisiunea.

Nu poate modifica zone administrative critice precum plăți sau
utilizatori, dacă nu i se acordă explicit permisiunea.

### Reviewer

Poate verifica / aproba conținut.

Rolurile pot fi extinse ulterior.

------------------------------------------------------------------------

# 33. Abonamente Admin

Admin → Abonamente

Informații: - FREE; - PRO; - abonamente active; - abonamente anulate; -
plăți eșuate; - venituri; - conversie.

Plățile efective vor fi integrate ulterior.

------------------------------------------------------------------------

# 34. Analytics

V1: - utilizatori activi; - lecții accesate; - lecții finalizate; - timp
de învățare; - conținut popular; - conversie FREE → PRO.

Analytics trebuie să rămână simplu inițial.

------------------------------------------------------------------------

# 35. Setări Admin

Categorii: - Site; - conținut; - abonamente; - administratori /
roluri; - setări generale.

------------------------------------------------------------------------

# 36. Import PDF și AI --- funcție planificată

Deoarece există deja PDF-uri cu materialele de Istorie și Română, pe
termen mediu se dorește un flux de tip:

**PDF → AI → propunere de lecție → verificare → Draft → Preview →
Publish**

Exemplu de propunere AI:

-   Introducere
-   Context
-   De reținut
-   Cronologie
-   Conținut
-   Important pentru Bac
-   Ce trebuie să știi
-   Recapitulare

AI-ul nu trebuie să publice automat.

Administratorul trebuie să poată verifica și modifica tot.

Această funcție poate fi implementată după ce CMS-ul și editorul
funcționează.

------------------------------------------------------------------------

# 37. Arhitectură conceptuală a conținutului

Modelul central:

``` text
Materie
  └── Capitol / Operă
        └── Lecție
              └── Blocuri
                    ├── text
                    ├── imagine
                    ├── audio
                    ├── video
                    ├── tabel
                    ├── cronologie
                    ├── quiz
                    └── alte tipuri
```

Modelul utilizatorului:

``` text
User
  ├── progres
  ├── streak
  ├── activitate
  ├── lecții finalizate
  └── abonament
```

------------------------------------------------------------------------

# 38. Stack tehnic --- direcție inițială

Nu este încă o decizie definitivă.

Direcția discutată:

### Frontend

-   React
-   TypeScript
-   Tailwind CSS
-   shadcn/ui

### Backend / Database

-   Supabase
-   PostgreSQL
-   Supabase Auth
-   Supabase Storage

### Hosting

-   Vercel

### Versionare

-   GitHub

### Plăți

-   Stripe

### AI

-   OpenAI API, ulterior, dacă este necesar.

### Vibe-coding

Lovable a fost propus ca opțiune, dar nu este obligatoriu. Se poate
compara cu alte soluții înainte de începerea construcției.

------------------------------------------------------------------------

# 39. Obiectiv de cost

Prioritatea este ca faza inițială să coste cât mai aproape de 0 €.

Principiul: - folosirea planurilor gratuite cât timp sunt suficiente; -
nu plătim servicii înainte să fie necesare; - construim întâi MVP-ul; -
decidem ulterior ce servicii trebuie plătite.

Nu se dorește o strategie de ocolire a limitelor prin conturi multiple
sau încălcarea regulilor serviciilor. Dacă un serviciu limitează
utilizarea gratuită, trebuie respectate condițiile lui.

Costurile probabile pe termen lung: - domeniu; - hosting / backend după
depășirea limitelor gratuite; - storage / video; - comisioane procesare
plăți; - AI API dacă este folosit intensiv.

------------------------------------------------------------------------

# 40. Strategia de dezvoltare cu AI

Experiența anterioară cu v0 și Bolt a arătat că un prompt foarte mare
dat direct unui builder nu produce rezultate suficient de bune.

Strategia dorită:

1.  Definim arhitectura.
2.  Definim baza de date.
3.  Definim design system.
4.  Construim incremental.
5.  Verificăm fiecare etapă.
6.  Modificăm doar ce este necesar.
7.  Păstrăm o specificație principală a proiectului.
8.  Nu lăsăm AI-ul să reinventeze arhitectura la fiecare prompt.
9.  Folosim prompturi precise și mici.
10. Păstrăm proiectul în GitHub.

Exemplu de regulă de debugging:

Nu: „Nu merge, repară."

Ci: „După ultima modificare, X funcționa. Acum Y nu mai funcționează. Nu
modifica X. Identifică cauza și repară doar Y."

------------------------------------------------------------------------

# 41. Utilizarea mai multor AI-uri

Se ia în calcul folosirea mai multor instrumente / modele pentru
eficiență.

Roluri conceptuale:

### AI principal / arhitect

-   arhitectură;
-   UX;
-   specificații;
-   prompturi;
-   debugging;
-   verificarea deciziilor.

### AI builder

-   implementarea efectivă a codului.

### AI secundar

-   second opinion;
-   analiză;
-   verificare;
-   alternative.

Nu trebuie ca un singur AI să fie responsabil simultan de arhitectură și
implementare.

Folosirea mai multor conturi trebuie făcută numai în limitele regulilor
serviciilor respective.

------------------------------------------------------------------------

# 42. Etapele propuse pentru MVP

## Etapa 1 --- Fundația

-   repository;
-   structura proiectului;
-   design system;
-   navigare;
-   layout responsive;
-   Landing;
-   Login / Register.

## Etapa 2 --- Database + autentificare

-   Supabase;
-   utilizatori;
-   roluri;
-   materii;
-   capitole;
-   lecții;
-   blocuri.

## Etapa 3 --- Admin

-   Admin Dashboard;
-   Conținut;
-   Materie;
-   Capitol;
-   Lecție;
-   editor modular;
-   template-uri;
-   preview;
-   draft / review / published.

## Etapa 4 --- Experiența elevului

-   Dashboard;
-   Catalog;
-   Materie;
-   Capitol;
-   Lecție;
-   drawer;
-   navigare lecții.

## Etapa 5 --- Progres

-   lecții accesate;
-   lecții finalizate;
-   progres;
-   streak;
-   activitate recentă.

## Etapa 6 --- Media

-   imagini;
-   audio;
-   video;
-   player;
-   Media Library.

## Etapa 7 --- FREE / PRO

-   permisiuni;
-   blocarea conținutului PRO;
-   pagina Upgrade.

## Etapa 8 --- Plăți

-   Stripe;
-   abonament lunar;
-   webhook;
-   sincronizare statut PRO.

## Etapa 9 --- Îmbunătățirea sistemului de învățare

-   „Învață";
-   text ascuns;
-   recapitulare;
-   quiz;
-   memorare activă.

## Etapa 10 --- AI pentru conținut

-   import PDF;
-   structurare asistată;
-   generare quiz;
-   propuneri de blocuri;
-   verificare umană.

## Etapa 11 --- Polish

-   animații;
-   glow;
-   optimizări;
-   accesibilitate;
-   SEO;
-   performanță;
-   securitate;
-   testare.

------------------------------------------------------------------------

# 43. Ce NU este încă definit

Următoarele rămân decizii pentru etapa de implementare:

-   numele aplicației;
-   logo-ul;
-   paleta exactă;
-   fonturile;
-   prețul PRO;
-   limitele exacte FREE;
-   materiile exacte din prima lansare;
-   structura finală a sistemului „Învață";
-   furnizorul final pentru video;
-   builderul final de vibe-coding;
-   schema exactă PostgreSQL;
-   politicile juridice / GDPR;
-   analytics exact;
-   notificările;
-   eventual Google login;
-   domeniul.

Acestea nu trebuie inventate prematur.

------------------------------------------------------------------------

# 44. Principiul central al proiectului

Aplicația trebuie să fie:

**„Un loc în care elevul intră, vede imediat de unde a rămas și poate
începe să învețe în câteva secunde."**

Iar administratorul trebuie să poată:

**„Lua un material brut și să-l transforme rapid într-o lecție premium,
structurată și publicabilă, fără să scrie cod."**

Aceste două obiective trebuie să ghideze toate deciziile ulterioare.
