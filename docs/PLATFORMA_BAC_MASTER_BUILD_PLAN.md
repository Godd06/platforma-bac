# PLATFORMĂ-BAC — MASTER BUILD & IMPROVEMENT PLAN
## Versiunea 1.0 — 18 august 2026

> Scop: document unic de lucru pentru finalizarea platformei-bac. Fiecare etapă trebuie verificată în cod, nu presupusă din existența unui fișier sau buton.
>
> Workflow: Antigravity este agentul/IDE-ul principal de implementare. GitHub este sursa de adevăr pentru codul versionat; workspace-ul local permite Antigravity să inspecteze, modifice, ruleze, testeze și să facă commit.
>
> Regulă: nu se declară o funcție „gata” până când nu este implementată, integrată, testată și verificată pe desktop + mobile, inclusiv stările loading/empty/error/permission.

---

# 0. REGULI DE EXECUȚIE

- Păstrăm React + TypeScript + Vite + Supabase.
- Nu schimbăm arhitectura fără motiv documentat.
- MASTER_PROJECT_SPECIFICATION_Bac_V3.md rămâne sursa canonică pentru regulile de produs deja stabilite.
- Educational content requires authentication: guest/anon nu accesează catalogul, lecțiile sau datele educaționale; RLS trebuie să aplice aceeași regulă.
- Nu folosim AI pentru a umple platforma cu conținut generic. Conținutul educațional trebuie să fie original, verificat și util.
- Antigravity trebuie să lucreze în bucle: inspect → plan → implement → typecheck/build/test → inspect diff → commit.
- Nicio modificare DB destructivă fără backup și confirmare.
- Nicio cheie secretă în client.
- Nicio funcție de securitate considerată protejată doar prin UI; autorizarea trebuie impusă server-side/RLS.
- După fiecare milestone: `pnpm typecheck`, `pnpm build`, apoi testare manuală relevantă.

---

# 1. BASELINE ȘI INVENTAR EXACT

## 1.1 Freeze baseline
- [ ] Notează SHA-ul commitului de pornire.
- [ ] Creează branch dedicat pentru audit/fix.
- [ ] Rulează install curat.
- [ ] Rulează typecheck.
- [ ] Rulează build.
- [ ] Notează erorile existente înainte de modificări.

## 1.2 Inventar cod
- [ ] Inventariază fiecare fișier din root.
- [ ] Inventariază fiecare fișier din `src/`.
- [ ] Inventariază fiecare migration Supabase.
- [ ] Inventariază fiecare document din `docs/`.
- [ ] Inventariază `public/`.
- [ ] Detectează fișiere neimportate.
- [ ] Detectează importuri către fișiere inexistente.
- [ ] Detectează componente declarate dar nefolosite.
- [ ] Detectează funcții TODO/FIXME/placeholder.
- [ ] Detectează mock data/hardcoded demo data.
- [ ] Detectează cod duplicat.
- [ ] Detectează dead code.
- [ ] Detectează feature-uri descrise în documentație dar inexistente în cod.

---

# 2. REPARAȚII CRITICE IMEDIATE

## 2.1 Admin authorization — CRITIC
- [ ] Repară `AdminProtectedRoute`: verificare reală `user` + rol admin/staff.
- [ ] Nu te baza pe UI pentru securitate.
- [ ] Verifică redirect pentru user normal.
- [ ] Verifică redirect pentru guest.
- [ ] Verifică acces pentru editor/reviewer/super_admin conform politicii.
- [ ] Ascunde linkul AdminCMS pentru utilizatorii fără rol.
- [ ] Verifică direct `/admin`, `/admin/content` etc., nu doar navigarea din UI.
- [ ] Confirmă că RLS rămâne ultima linie de apărare.
- [ ] Adaugă teste pentru fiecare rol.

## 2.2 Auth hardening
- [ ] Activează leaked-password protection.
- [ ] Verifică reset-password anti-enumeration.
- [ ] Verifică expirarea și consumarea reset links.
- [ ] Verifică sesiuni după schimbarea parolei.
- [ ] Verifică email/account change re-authentication.
- [ ] Verifică sign-out și revocarea sesiunilor.
- [ ] Verifică redirect allow-list.
- [ ] Verifică rate limiting/abuse protections disponibile prin Supabase.
- [ ] Verifică MFA ca funcție viitoare pentru admin.

## 2.3 SECURITY DEFINER / RPC
- [ ] Auditează fiecare SECURITY DEFINER.
- [ ] Revocă EXECUTE unde nu este necesar.
- [ ] Setează `search_path` explicit.
- [ ] Verifică owner și privilegiile funcțiilor.
- [ ] Testează `record_lesson_progress` cu user normal, alt user și fără autentificare.
- [ ] Verifică toate tranzacțiile și race conditions.

---

# 3. SUPABASE / DATABASE

## 3.1 Schema
- [ ] Compară schema actuală cu V3.
- [ ] Verifică toate FK.
- [ ] Verifică unique constraints.
- [ ] Verifică CHECK constraints.
- [ ] Verifică NOT NULL unde este necesar.
- [ ] Verifică cascade/delete behavior.
- [ ] Verifică indexes.
- [ ] Verifică timestamp conventions.
- [ ] Verifică timezone handling.

## 3.2 RLS
Pentru fiecare tabel:
- [ ] RLS enabled.
- [ ] SELECT policy.
- [ ] INSERT policy.
- [ ] UPDATE policy.
- [ ] DELETE policy.
- [ ] Test guest.
- [ ] Test student.
- [ ] Test PRO.
- [ ] Test editor.
- [ ] Test reviewer.
- [ ] Test super_admin.
- [ ] Test cross-user access.
- [ ] Test unpublished content leakage.
- [ ] Test lesson_blocks leakage.

## 3.3 Storage
- [ ] Audit buckets.
- [ ] Private/public decision pentru fiecare bucket.
- [ ] Upload policies.
- [ ] Download policies.
- [ ] Delete policies.
- [ ] MIME allow-list.
- [ ] File-size limits.
- [ ] Filename normalization.
- [ ] SVG safety.
- [ ] Image dimension validation.
- [ ] Signed URL expiration.
- [ ] PRO media protection.

---

# 4. STUDENT AUTHENTICATED EXPERIENCE

## 4.1 Login/Register
- [ ] Loading.
- [ ] Validation.
- [ ] Server errors.
- [ ] Password visibility.
- [ ] Password strength.
- [ ] Keyboard navigation.
- [ ] Focus states.
- [ ] Mobile.
- [ ] Rate/abuse UX.
- [ ] Session persistence.

## 4.2 Dashboard
- [ ] Verify every card against real DB data.
- [ ] Verify zero-state.
- [ ] Verify first-user state.
- [ ] Verify completed-user state.
- [ ] Verify PRO state.
- [ ] Verify streak rollover.
- [ ] Verify recent activity.
- [ ] Verify progress calculation.
- [ ] Verify mobile hierarchy.
- [ ] Remove any decorative telemetry that has no real meaning.

## 4.3 Catalog
- [ ] Verify search.
- [ ] Verify subject loading.
- [ ] Verify chapter/lesson expansion.
- [ ] Verify published filtering.
- [ ] Verify FREE/PRO labels.
- [ ] Verify empty state.
- [ ] Verify no content leakage.
- [ ] Verify mobile drawer/accordion.
- [ ] Verify keyboard navigation.

## 4.4 Lesson
- [ ] Verify every block.
- [ ] Verify access gate.
- [ ] Verify progress persistence.
- [ ] Verify completion.
- [ ] Verify previous/next.
- [ ] Verify audio.
- [ ] Verify video.
- [ ] Verify PDF/file.
- [ ] Verify images.
- [ ] Verify rich text.
- [ ] Verify focus mode.
- [ ] Verify scroll progress.
- [ ] Verify mobile.
- [ ] Verify direct URL access.
- [ ] Verify error states.

---

# 5. LESSON BLOCK SYSTEM

## 5.1 Current supported blocks
- [ ] heading
- [ ] rich_text
- [ ] important
- [ ] remember
- [ ] definition
- [ ] summary
- [ ] image
- [ ] video
- [ ] audio
- [ ] file_download
- [ ] quote

For every block:
- [ ] Type definition.
- [ ] Renderer.
- [ ] Admin creation.
- [ ] Admin editing.
- [ ] Sanitization.
- [ ] Mobile layout.
- [ ] Accessibility.
- [ ] Empty/invalid state.
- [ ] Persistence.
- [ ] Preview.
- [ ] Published rendering.

## 5.2 Missing V3 blocks
Decide and implement where valuable:
- [ ] gallery
- [ ] table
- [ ] timeline
- [ ] map
- [ ] quiz
- [ ] hidden_answer

Do not implement merely because they are possible. Each must have an educational use case.

---

# 6. RICH TEXT / HIGHLIGHTS — FULL REBUILD PASS

- [ ] Audit every highlight color.
- [ ] Make semantic colors visually distinct.
- [ ] Ensure dark/light contrast.
- [ ] Ensure editor and reader render identically.
- [ ] Ensure stored HTML preserves highlight semantics.
- [ ] Ensure sanitizer preserves only allowed highlight attributes.
- [ ] Ensure multiple highlights can coexist.
- [ ] Ensure nested formatting works.
- [ ] Ensure selection toolbar is usable on mobile.
- [ ] Ensure keyboard shortcuts.
- [ ] Ensure undo/redo.
- [ ] Ensure link validation.
- [ ] Ensure pasted HTML is sanitized.
- [ ] Test long paragraphs.
- [ ] Test headings/lists/quotes.
- [ ] Test print.
- [ ] Test accessibility.
- [ ] Remove visual ambiguity between important/remember/highlight styles.

---

# 7. ADMIN CMS

## 7.1 Content management
- [ ] Subjects CRUD.
- [ ] Chapters CRUD.
- [ ] Lessons CRUD.
- [ ] Blocks CRUD.
- [ ] Reorder.
- [ ] Duplicate.
- [ ] Bulk actions.
- [ ] Search.
- [ ] Filters.
- [ ] Draft/published workflow.
- [ ] Preview.
- [ ] Unsaved changes protection.
- [ ] Autosave only if safe and recoverable.
- [ ] Revision/history system.

## 7.2 Lesson Studio
- [ ] Visual editors for every supported block.
- [ ] JSON fallback only where necessary.
- [ ] Validation before save.
- [ ] Clear validation errors.
- [ ] Drag-and-drop reorder.
- [ ] Duplicate block.
- [ ] Keyboard navigation.
- [ ] Block templates.
- [ ] Preview mode matching student reader exactly.

## 7.3 Media
Build actual Media Library:
- [ ] Upload.
- [ ] Search.
- [ ] Filters.
- [ ] Preview.
- [ ] Copy URL/reference.
- [ ] Metadata.
- [ ] Alt text.
- [ ] Replace.
- [ ] Delete with dependency warning.
- [ ] Storage cleanup.
- [ ] File validation.

## 7.4 Users
Build actual admin user management:
- [ ] Search.
- [ ] Filter by role.
- [ ] Filter by subscription.
- [ ] View profile.
- [ ] Role management.
- [ ] Subscription status.
- [ ] Activity overview.
- [ ] Account disable/re-enable if supported safely.
- [ ] Audit log.

## 7.5 Subscriptions
- [ ] Actual subscription records.
- [ ] Status.
- [ ] Plan.
- [ ] Period.
- [ ] Cancellation.
- [ ] Failed payment state.
- [ ] Manual reconciliation.
- [ ] Audit trail.

## 7.6 Analytics
- [ ] Real events.
- [ ] Active users.
- [ ] lesson completion.
- [ ] retention.
- [ ] streaks.
- [ ] popular lessons.
- [ ] funnel: landing → register → first lesson → completion → PRO.
- [ ] Error tracking.
- [ ] Privacy-conscious analytics.

---

# 8. QUIZ / LEARNING FEATURES

Build only after defining educational behavior:
- [ ] Quiz schema.
- [ ] Question types.
- [ ] Answer validation.
- [ ] Scoring.
- [ ] Attempts.
- [ ] Explanations.
- [ ] Progress integration.
- [ ] Review wrong answers.
- [ ] Admin quiz editor.
- [ ] Student quiz renderer.
- [ ] Accessibility.
- [ ] Anti-cheating only where relevant.
- [ ] Analytics.

Potential signature features:
- [ ] „De ce este corect?” explanation after answer.
- [ ] „Mai încearcă peste X zile” spaced repetition.
- [ ] confidence rating.
- [ ] weak-topic detection.
- [ ] personalized revision queue.

---

# 9. LEARNING EXPERIENCE — DIFFERENTIATION

The goal is to feel like a product designed by educators, not an AI-generated LMS.

## 9.1 Learning layer
- [ ] Smart Continue.
- [ ] Daily 10-minute revision.
- [ ] „Ce să repeți azi”.
- [ ] Weak points.
- [ ] Spaced repetition.
- [ ] Interleaving across subjects.
- [ ] Exam countdown.
- [ ] Session goal.
- [ ] End-of-lesson recap.
- [ ] Confidence self-rating.
- [ ] Mastery score separate from completion percentage.

## 9.2 Bac-specific features
- [ ] Essay planning mode.
- [ ] Argument builder.
- [ ] Character/theme/opera relationship maps.
- [ ] History chronology trainer.
- [ ] Cause → event → consequence cards.
- [ ] „Confuzi mereu X cu Y” cards.
- [ ] Common mistakes.
- [ ] Examiner perspective.
- [ ] Scoring rubric.
- [ ] Timed exam mode.
- [ ] simulated Bac sessions.
- [ ] answer review.

## 9.3 Human feel
- [ ] Editorial voice.
- [ ] Human-written microcopy.
- [ ] Real examples.
- [ ] Romanian-specific visual language.
- [ ] Occasional handwritten/annotation-inspired elements where useful.
- [ ] Avoid generic SaaS phrases.
- [ ] Avoid excessive gradients/glass everywhere.
- [ ] Avoid unnecessary AI badges.
- [ ] Add author/editor attribution for educational content.
- [ ] Content review date.
- [ ] „Verificat pentru Bac 2026” where truthful.

---

# 10. DESIGN SYSTEM / UI POLISH

Create one global UI audit.

## 10.1 Foundations
- [ ] Typography hierarchy.
- [ ] Spacing scale.
- [ ] Border radius.
- [ ] Shadows.
- [ ] Surface hierarchy.
- [ ] Icon sizes.
- [ ] Button heights.
- [ ] Input heights.
- [ ] Focus rings.
- [ ] Motion.
- [ ] Light theme.
- [ ] Dark theme.

## 10.2 Components
Audit every:
- [ ] Button.
- [ ] Input.
- [ ] Select.
- [ ] Checkbox.
- [ ] Radio.
- [ ] Toggle.
- [ ] Modal.
- [ ] Drawer.
- [ ] Tooltip.
- [ ] Dropdown.
- [ ] Tabs.
- [ ] Accordion.
- [ ] Card.
- [ ] Badge.
- [ ] Toast.
- [ ] Skeleton.
- [ ] Empty state.
- [ ] Error state.
- [ ] Pagination if introduced.

## 10.3 States
Every interactive element:
- [ ] default
- [ ] hover
- [ ] active
- [ ] focus
- [ ] disabled
- [ ] loading
- [ ] error
- [ ] success

## 10.4 Responsive
Test:
- [ ] 320px
- [ ] 360px
- [ ] 390px
- [ ] 430px
- [ ] tablet
- [ ] 1366px
- [ ] 1440px
- [ ] 1920px

---

# 11. ACCESSIBILITY

Target WCAG 2.2 AA:
- [ ] semantic HTML.
- [ ] keyboard-only navigation.
- [ ] visible focus.
- [ ] logical tab order.
- [ ] accessible names.
- [ ] aria only when necessary.
- [ ] color contrast.
- [ ] reduced motion.
- [ ] screen-reader testing.
- [ ] form labels.
- [ ] error association.
- [ ] live regions for important async feedback.
- [ ] modal focus trap.
- [ ] drawer focus management.
- [ ] skip link.
- [ ] captions/transcripts for media where applicable.
- [ ] touch target sizing.
- [ ] no information conveyed only by color.

---

# 12. PERFORMANCE

Measure before optimizing.

## Core Web Vitals
- [ ] LCP.
- [ ] INP.
- [ ] CLS.

## App
- [ ] Code splitting by route.
- [ ] Lazy-load admin.
- [ ] Lazy-load heavy editor.
- [ ] Lazy-load media.
- [ ] Optimize images.
- [ ] Modern image formats.
- [ ] Explicit dimensions.
- [ ] Avoid layout shift.
- [ ] Reduce unnecessary Supabase queries.
- [ ] Cache stable data.
- [ ] Abort stale requests.
- [ ] Avoid duplicate fetches.
- [ ] Virtualize large lists if needed.
- [ ] Debounce search.
- [ ] Bundle analysis.
- [ ] Remove unused dependencies.

---

# 13. SECURITY — OWASP ASVS PASS

Use OWASP ASVS 5 as the verification checklist.

- [ ] Input validation.
- [ ] Output encoding.
- [ ] HTML sanitization.
- [ ] URL protocol/domain allow-list.
- [ ] SSRF-sensitive URL validation.
- [ ] SVG sanitization.
- [ ] File upload security.
- [ ] Auth.
- [ ] Session management.
- [ ] Authorization.
- [ ] Secrets.
- [ ] Secure communication.
- [ ] Security headers.
- [ ] Error handling.
- [ ] Logging.
- [ ] Rate limiting.
- [ ] CSRF/CORS analysis according to actual architecture.
- [ ] XSS tests.
- [ ] IDOR/cross-user tests.
- [ ] privilege escalation tests.
- [ ] storage access tests.

---

# 14. SEO

Important architectural decision:
Educational content currently requires authentication. Do not expose private lessons merely for SEO.

Public SEO should focus on:
- [ ] Landing.
- [ ] public product pages.
- [ ] public subject/category information if permitted by V3.
- [ ] blog/resources.
- [ ] legal/trust pages.
- [ ] public educational previews where intentionally allowed.

Technical:
- [ ] title templates.
- [ ] meta descriptions.
- [ ] canonical URLs.
- [ ] robots.txt.
- [ ] sitemap.xml.
- [ ] favicon/site icons.
- [ ] Open Graph.
- [ ] Twitter/X cards.
- [ ] structured data where eligible.
- [ ] breadcrumbs.
- [ ] semantic headings.
- [ ] image alt text.
- [ ] 404.
- [ ] redirects.
- [ ] Search Console.
- [ ] Bing Webmaster if useful.
- [ ] monitor index coverage.

Do NOT build an FAQ strategy solely for FAQ rich results; Google removed that rich-result documentation in 2026.

For AI search:
- [ ] publish unique, non-commodity educational content.
- [ ] make content genuinely useful to students.
- [ ] add clear authorship/editorial context.
- [ ] use structured data correctly.
- [ ] monitor Search Console generative-AI reporting when available.
- [ ] never mass-generate low-value SEO pages.

---

# 15. CONTENT ENGINE / EDITORIAL QUALITY

- [ ] Define curriculum hierarchy.
- [ ] Define canonical lesson template.
- [ ] Create content style guide.
- [ ] Define terminology.
- [ ] Define educational difficulty.
- [ ] Define examples.
- [ ] Define image rules.
- [ ] Define citation/source rules.
- [ ] Define review workflow.
- [ ] Add reviewer status.
- [ ] Add content version.
- [ ] Add last-reviewed date.
- [ ] Add curriculum year.
- [ ] Add author/editor.
- [ ] Build content QA checklist.
- [ ] No duplicated/generated filler.
- [ ] Check Romanian grammar and diacritics.
- [ ] Verify Bac syllabus alignment.

---

# 16. MARKETING / GROWTH

## Landing
- [ ] Clear value proposition.
- [ ] Demonstrate actual lesson experience.
- [ ] Show product rather than generic claims.
- [ ] Explain Free vs PRO.
- [ ] Social proof only when real.
- [ ] Trust signals.
- [ ] FAQ/objection handling where useful.
- [ ] strong CTA.
- [ ] mobile-first conversion.

## Funnel
Track:
- [ ] visit.
- [ ] CTA click.
- [ ] register.
- [ ] first login.
- [ ] first lesson.
- [ ] first completion.
- [ ] return next day.
- [ ] PRO page.
- [ ] checkout.
- [ ] purchase.
- [ ] retention.

## Content marketing
Build:
- [ ] 5 initial SEO articles.
- [ ] Bac guides.
- [ ] common mistakes.
- [ ] essay guides.
- [ ] exam strategy.
- [ ] free sample lessons.
- [ ] shareable revision resources.

## Social
- [ ] reusable content pipeline.
- [ ] TikTok/Reels hooks.
- [ ] lesson snippets.
- [ ] before/after learning examples.
- [ ] common mistake series.
- [ ] countdown content.
- [ ] UTM tracking.

---

# 17. ANALYTICS / PRODUCT INTELLIGENCE

- [ ] Define event taxonomy.
- [ ] Avoid collecting unnecessary personal data.
- [ ] Track feature adoption.
- [ ] Track lesson completion.
- [ ] Track block interactions.
- [ ] Track search terms.
- [ ] Track failed searches.
- [ ] Track PRO conversion.
- [ ] Track churn/cancel.
- [ ] Track performance errors.
- [ ] Track broken media.
- [ ] Build admin dashboards only from real data.

High-value unique metric:
- [ ] „Mastery velocity”: improvement over time, not just activity.

---

# 18. RELIABILITY / ERROR UX

- [ ] Central error boundary.
- [ ] Friendly error pages.
- [ ] Retry buttons.
- [ ] Offline/network detection.
- [ ] Failed Supabase request handling.
- [ ] Media load failures.
- [ ] Broken image fallback.
- [ ] Audio/video error state.
- [ ] Save failure recovery.
- [ ] Unsaved editor changes warning.
- [ ] Error logging.
- [ ] Correlation/request IDs where appropriate.

---

# 19. PWA / MOBILE PRODUCT

Evaluate after core stability:
- [ ] Installable PWA.
- [ ] app icon.
- [ ] splash/manifest.
- [ ] offline lesson cache only for content the user is authorized to access.
- [ ] resume session.
- [ ] mobile audio behavior.
- [ ] safe-area support.
- [ ] touch-friendly controls.
- [ ] no horizontal overflow.

Do not add offline storage that creates authorization/content leakage.

---

# 20. POLISH / DETAILS THAT MAKE IT FEEL HUMAN

- [ ] Consistent Romanian microcopy.
- [ ] No awkward AI-style prose.
- [ ] No excessive exclamation marks.
- [ ] No generic „Unlock your potential” copy.
- [ ] Real empty-state explanations.
- [ ] Contextual tooltips only where they help.
- [ ] Subtle motion.
- [ ] Meaningful illustrations/diagrams.
- [ ] Editorial visual hierarchy.
- [ ] Deliberate whitespace.
- [ ] Consistent icon vocabulary.
- [ ] Consistent terminology everywhere.
- [ ] Real loading messages where useful.
- [ ] Micro-interactions tied to learning actions, not decoration.

---

# 21. SIGNATURE FEATURES — SELECTIVELY IMPLEMENT

Candidates to evaluate:

1. **Bac Mission Control**
   - exam date
   - current mastery
   - weak topics
   - next recommended action

2. **10-minute Daily Drill**
   - automatically generated from weak areas.

3. **Memory Map**
   - visual map connecting author → work → theme → characters → motifs → essay.

4. **History Timeline Trainer**
   - interactive chronological practice.

5. **Essay Builder**
   - thesis → arguments → examples → conclusion.

6. **Mistake Bank**
   - stores recurring mistakes and schedules them for review.

7. **Exam Simulator**
   - timed, realistic, review after completion.

8. **Study Streak with substance**
   - streak is based on meaningful learning, not simply opening the app.

9. **Personal Revision Queue**
   - combines weak points, due reviews and exam proximity.

10. **„Explain it like I’m at Bac”**
   - controlled explanations using the platform's verified content, not unrestricted generative output.

Only ship features that improve learning or differentiation.

---

# 22. LEGAL / TRUST

Before launch:
- [ ] Terms.
- [ ] Privacy Policy.
- [ ] Cookie policy/consent if required by actual tracking.
- [ ] Subscription terms.
- [ ] Refund/cancellation policy.
- [ ] Contact information.
- [ ] Company/legal identity as applicable.
- [ ] Copyright/licensing review for educational material.
- [ ] Image/audio/video licensing.
- [ ] Data retention policy.
- [ ] Account deletion flow.

---

# 23. TESTING

## Static
- [ ] typecheck.
- [ ] build.
- [ ] lint if configured.

## Unit
- [ ] auth helpers.
- [ ] sanitizers.
- [ ] lesson access logic.
- [ ] progress calculations.
- [ ] block parsers.

## Integration
- [ ] Auth.
- [ ] Supabase policies.
- [ ] lesson access.
- [ ] progress.
- [ ] admin permissions.
- [ ] subscriptions.

## E2E
Minimum:
- [ ] register.
- [ ] login.
- [ ] logout.
- [ ] password reset.
- [ ] student opens catalog.
- [ ] student opens free lesson.
- [ ] student blocked from PRO lesson.
- [ ] admin login.
- [ ] admin CRUD.
- [ ] non-admin blocked from admin.
- [ ] progress saved.
- [ ] lesson completion.
- [ ] mobile navigation.

---

# 24. CI/CD

- [ ] GitHub Actions.
- [ ] install.
- [ ] typecheck.
- [ ] build.
- [ ] tests.
- [ ] optional lint.
- [ ] preview deployments.
- [ ] production deployment.
- [ ] migration discipline.
- [ ] environment separation.
- [ ] deployment rollback plan.

---

# 25. OBSERVABILITY

- [ ] Error tracking.
- [ ] Performance monitoring.
- [ ] Web vitals.
- [ ] Auth failures.
- [ ] API/database errors.
- [ ] failed content saves.
- [ ] broken links/media.
- [ ] payment errors.
- [ ] admin audit log.

---

# 26. FINAL QA MATRIX

For every feature verify:

| Area | Desktop | Mobile | Guest | Student | PRO | Admin | Error | Loading | Empty | Accessibility |
|---|---|---|---|---|---|---|---|---|---|---|
| Auth | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Dashboard | [ ] | [ ] | N/A | [ ] | [ ] | N/A | [ ] | [ ] | [ ] | [ ] |
| Catalog | [ ] | [ ] | per V3 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Lesson | [ ] | [ ] | per V3 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CMS | [ ] | [ ] | N/A | N/A | N/A | [ ] | [ ] | [ ] | [ ] | [ ] |
| PRO | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

---

# 27. LAUNCH GATE

Do NOT launch until:

- [ ] Admin authorization fixed.
- [ ] RLS audit passed.
- [ ] Storage audit passed.
- [ ] Auth hardening passed.
- [ ] Payment flow tested end-to-end.
- [ ] Webhooks verified.
- [ ] Real curriculum/content ready.
- [ ] Core lesson blocks stable.
- [ ] Mobile QA passed.
- [ ] Accessibility baseline passed.
- [ ] Core Web Vitals measured.
- [ ] SEO technical baseline passed.
- [ ] Legal pages live.
- [ ] Analytics verified.
- [ ] Error monitoring active.
- [ ] Backup/restore procedure known.
- [ ] CI/CD passes.
- [ ] Production smoke test passes.
- [ ] No P0/P1 issues remain.

---

# 28. ANTIGRAVITY EXECUTION PROTOCOL

For every task given to Antigravity:

1. Read relevant files first.
2. Identify existing architecture.
3. Do not create duplicate components.
4. Search for existing utilities/services before adding new ones.
5. State exact files to change.
6. Make the smallest coherent implementation.
7. Run typecheck.
8. Run build.
9. Run targeted tests.
10. Inspect the final diff.
11. Search for regressions/import issues.
12. Report:
    - changed files
    - what changed
    - tests
    - remaining issues
13. Commit with a meaningful message.

For large tasks:
- Split into milestones.
- Do not mix unrelated UI, DB and payment changes in one uncontrolled operation.
- After each milestone, verify the application in the browser.

---

# 29. DEFINITION OF DONE

A feature is DONE only when:

- [ ] code exists
- [ ] UI exists
- [ ] backend/data exists where required
- [ ] authorization exists
- [ ] validation exists
- [ ] loading state exists
- [ ] empty state exists
- [ ] error state exists
- [ ] mobile works
- [ ] desktop works
- [ ] keyboard/accessibility works
- [ ] persisted data works
- [ ] refresh/direct URL works
- [ ] no console errors
- [ ] no type errors
- [ ] build passes
- [ ] relevant tests pass
- [ ] documentation is updated if architecture changed
- [ ] Git diff reviewed

---

# 30. PRIORITY ORDER

## P0 — Security / correctness
1. Admin authorization.
2. RLS and authorization regression tests.
3. SECURITY DEFINER audit.
4. Auth hardening.
5. Storage security.
6. XSS/URL/file validation.
7. Data integrity.

## P1 — Core product
8. Full lesson/block QA.
9. Highlight/editor consistency.
10. CMS editor completion.
11. Dashboard/progress QA.
12. Mobile UX.
13. Error/loading/empty states.

## P2 — Product completeness
14. Admin Media.
15. Admin Users.
16. Admin Subscriptions.
17. Admin Analytics.
18. Admin Settings.
19. Quiz system.
20. Missing useful lesson blocks.

## P3 — Commercial
21. Payment provider.
22. Checkout.
23. Webhooks.
24. Subscription lifecycle.
25. PRO entitlement tests.

## P4 — Content
26. Romanian curriculum.
27. History curriculum.
28. Media.
29. Editorial QA.
30. Revision system.

## P5 — Growth
31. SEO.
32. Search Console.
33. Blog/content marketing.
34. Analytics.
35. Conversion funnel.
36. Social/UTM.

## P6 — Differentiation
37. Daily Drill.
38. Mistake Bank.
39. Memory Map.
40. Essay Builder.
41. History Timeline Trainer.
42. Exam Simulator.
43. Mastery engine.

## P7 — Final production
44. Performance.
45. Accessibility.
46. Testing.
47. CI/CD.
48. Observability.
49. Legal.
50. Production QA.
51. Launch.

---

# 31. EXTERNAL RESEARCH PRINCIPLES

This plan incorporates current guidance that should remain part of the implementation standard:

- Google currently emphasizes original, useful, people-first content for both classic Search and AI experiences; generic scaled AI content should not be used as an SEO shortcut.
- Google added guidance in 2026 for generative-AI Search visibility and has begun rolling out dedicated Search Console reporting for generative-AI visibility.
- Core Web Vitals remain LCP, INP and CLS.
- OWASP ASVS 5.0 provides the security verification framework for authentication, session management, authorization, file handling, sanitization, configuration and related areas.
- `llms.txt` is not required for Google Search; do not spend effort on it instead of actual content/technical SEO.
- Do not build an SEO strategy around FAQ rich results; Google's FAQ rich-result feature was deprecated in 2026.

---

# 32. MASTER PRINCIPLE

The final product should not win because it has the most features.

It should win because:

**the student immediately understands what to do, learns faster, remembers more, sees measurable progress, trusts the content, and enjoys using the platform.**

Every proposed feature must answer at least one of:

- Does it improve learning?
- Does it reduce friction?
- Does it increase trust?
- Does it improve retention?
- Does it improve discoverability?
- Does it make the product feel distinctly ours?

If the answer is no, do not add it.
