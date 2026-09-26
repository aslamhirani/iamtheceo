# Data dictionary — 2026-27 education master data

One row = one young person (hr_id is unique). 20,943 rows, ages 0–25, academic year 2026-27.
Counts below are from the September 2026 extract. Re-run `load_data.py profile` if the file changes.

Items marked **(inferred)** are interpretations drawn from the data patterns. They have not been
confirmed by the data owner. When one of these drives an answer, say so in a short note.

## Contents
1. Geography & center
2. Person & socio-economic
3. Data provenance & eligibility
4. School fields
5. College / tertiary fields
6. Consolidated status (the key column)
7. Assessment programmes
8. Data-quality traps

---

## 1. Geography & center

| Column | Meaning | Values |
|---|---|---|
| Cluster Region | Top-level cluster | ROI 14,531 · SAU 6,412 (inferred: ROI = Rest of India, SAU = Saurashtra) |
| Current_Region | Region where the person lives now | WI, NS, NEG, SI, SS, CNEI |
| Current_Local_Board | Local board (25) | North Mumbai, Hyderabad, Ahmedabad, Rajkot, Secunderabad, Surendranagar-Botad, South Mumbai, Surat, Vapi-Sanjan, Pune, Nagpur, Kutch, … |
| Current_Center | Center / jamatkhana (361) | free text names |
| Home_Region / Home_Local_Board / Home_Center | Registered "home" location | Home_Region uses **different codes**: WIN, NSA, NEG, SIN, SSA, CNEI. Map WIN↔WI, NSA↔NS, SIN↔SI, SSA↔SS before comparing current vs home |
| AK vicinity | Nearest Aga Khan institution if close by | `#NON AK VICINITY` (14,480) or institution name, e.g. DJHS-Hyderabad, AKS Kompally (proposed), AKP Surendranagar, DJHS-Mumbai, AKP Botad, AKA Hyderabad, Outreach-Fidai girls |
| Center Type | | CMC 15,393 · Non-CMC 4,253 · Hostel 1,297 |

Region codes (inferred): WI = Western India, NS = Northern Saurashtra, NEG = North-East Gujarat,
SI = Southern India, SS = Southern Saurashtra, CNEI = Central/North/East India.
Default to **Current_*** columns for "where" questions. Use Home_* only when the user asks about home or migration.
Comparing Current_Local_Board with Home_Local_Board shows internal movement.

## 2. Person & socio-economic

| Column | Meaning |
|---|---|
| Age in Years / Age in Months | Integer age (0–25) |
| Age group | 0-2, 3-5, 6-12, 13-15, 16-18, 19-21, 22-25 (loader fixes Excel's "06-Dec"/"03-May") |
| gender | M 10,941 · F 10,002 |
| IS LIG → `is_lig` | LIG = Low Income Group (3,041) |
| is_fmp → `is_fmp_member` | FMP 1,803 (inferred: a family/financial-support programme membership) |
| dob, phone_number_1, father_mobile_number, swb_pid, FMP Member ID | **PII — removed by the loader.** Phones are also corrupted (scientific notation like 9.19E+11) |

## 3. Data provenance & eligibility

| Column | Values / notes |
|---|---|
| Data Category | Data collection 14,981 · Data Rolled over 5,238 (carried forward from last year, not freshly verified) · Data collection - New HR 724 |
| Eligible pop 1 | ELIGIBLE 19,089 / NOT ELIGIBLE 1,854 |
| Eligible Pop part 2 | ELIGIBLE 17,493 / NOT ELIGIBLE 3,450 |
| Eligible Pop part 3 | ELIGIBLE 5,680: only ages 19–25 (inferred: tertiary-age cohort eligible for tertiary tracking) |
| Eligible Flag | 1 = 17,311 · 0 = 3,632. The **headline denominator** for coverage/KPI percentages (inferred). If the user doesn't specify, report on all rows and mention the Eligible-Flag=1 figure too |
| academic_year | Always 2026-27 |

## 4. School fields (mostly ages 2–18)

| Column | Notes |
|---|---|
| studying | School-portal status: Studying 9,802 · Pending 9,142 · Not Studying 1,264 · Not Reachable 735. **Not a population-wide "is in education" flag**: most 19–25s show "Pending" because they're tracked on the college side |
| School_name / School_ID | 1,969 names. Group by School_ID when possible, since names have spelling variants |
| curriculum | State Board, CBSE, ICSE, Pre-School, IGCSE, IB, College, Private Coaching, Special Schools |
| medium | English 9,614 · Gujarati 199 |
| school_category | A, B, C, D, AK, AKP, Special Schools (inferred: quality tier of school. A = top-tier, D = lowest; AK = Aga Khan school; AKP = Aga Khan pre-school) |
| standard | Current grade: Play Group, Nursery, JR.Kg, SR.Kg, 1st–12th, F.Y./S.Y./T.Y. Degree College, Diploma (Yr 1–3). Use `STANDARD_ORDER` in the loader for sorting |
| Not_Studying_Reasons_Merged | Reason if not studying. Multi-reasons are joined by `" , "`. Split on that before counting reasons. Top: Too Young, Migrated Abroad, Migrated within the country, Untraceable, Contact Number Not Available, Completed Studies - Working, Dropout - Working |
| ed_school_remarks | Free-text notes |
| Highest_standard | Last standard completed, for non-studying |
| Ed_created_at / ed_updated_at | Record dates (parsed to datetime) |

## 5. College / tertiary fields (ages 16–25)

| Column | Notes |
|---|---|
| college_studying | Studying 3,223 · Not Studying 3,524 · blank otherwise |
| College | College name (messy, sometimes duplicated text) |
| college_degree | 88 values: BBA 724, B.Com 655, BA 217, BCA 207, B.Tech 178, BSC.IT 143, BMS 131, B.Sc 108, MBA 75, MBBS 62, … |
| college_stream | Business Study, General Commerce, Computer Science/IT, Engineering, General Arts, Finance, General Science, Medicine/healthcare, Nursing, Arts and Designs, Pharmacy, Law, … |
| college_not_studying_reason / college_remarks | As for school |
| Degree Year | 2, 3, 4, 5, Last Year, Graduated, blank |
| Emerging Career Status | EMERGING 1,634 / NON EMERGING 1,609. EMERGING = STEM, health, finance, law, design, etc. NON EMERGING = mainly Business Study, General Commerce, General Arts |
| Tertiary_Category_Final | #ACCESSING TERTIARY 3,262, #NOT STUDYING 1,824, #MIGRATED ABROAD 1,355, #PENDING 794, #UNTRACEABLE 386, #INVALID REASON 207, #MIGRATED 162, #NOT APPLICABLE (under-age) |

## 6. CONSO CAT — consolidated status (use this first)

One status per person, combining school and tertiary outcomes. Use it for
"how many are studying / out of school / migrated / untraced" questions.

| Value | Count | Meaning |
|---|---|---|
| A / B / C / D / AK / AKP / Special Schools | 4,463 / 252 / 2,702 / 1,642 / 644 / 80 / 4 | In school, by school category |
| #ACCESSING TERTIARY | 3,262 | In college / diploma |
| #ACCESSING SCHOOL | 10 | 22–25 year-olds still in school |
| #PENDING | 2,248 | Data not yet collected / verified |
| #NOT STUDYING | 2,114 | Out of education |
| #MIGRATED ABROAD | 1,547 | |
| #MIGRATED | 344 | Moved within India |
| #UNTRACEABLE | 591 | |
| #INVALID REASON | 1,011 | Reason given isn't accepted (e.g. "Too Young" for a school-age child). A data-quality bucket |
| #NOT ON PORTAL | 25 | |
| #NOT APPLICABLE | 5 | |

Useful roll-ups:
- **In education** = school categories + #ACCESSING SCHOOL + #ACCESSING TERTIARY (13,058)
- **Out of education** = #NOT STUDYING
- **Unknown / data gap** = #PENDING + #UNTRACEABLE + #INVALID REASON + #NOT ON PORTAL
- **Migrated** = #MIGRATED + #MIGRATED ABROAD

When you compute a rate, state the denominator you used (all rows, Eligible Flag = 1, or
known-status only excluding migrated/unknown). Different denominators give very different percentages.

## 7. Assessment programmes

| Column | Values (age range) | Notes |
|---|---|---|
| RP Level | Grade Level 1,362, Foundation Level 805, Below Grade Level 174, Assessment Not Done 1,576, Not Eligible, Not Applicable (ages 6–12 assessed) | Inferred: reading/literacy programme |
| RP Actual Level | At Level 1,362 / Below Level 979 (= Foundation + Below Grade) | Use for % at-level |
| JP Level | Outstanding 114, Proficient 204, Beginner 152, Needs strengthening 351, Assessment not done 576 | Inferred: a younger-years/junior programme |
| JP Actual Level | At Level 318 / Below Level 503 / Assessment not done 345 | |
| JP Enrolled | Enrolled 1,346 / Not Enrolled 1,189 (ages 2–19; Not Enrolled is ages 3–5) | |
| Spoken English Level | At Level 186 · Below Level 343 · Assessment not done 5,538 | Coverage is very low. Say so |

For "% at level", default denominator = assessed only (At + Below). Also give assessment coverage
(assessed ÷ (assessed + not done)), because low coverage makes the rate unreliable.

## 8. Data-quality traps (the loader handles 1–5)

1. File is **cp1252** encoded, not UTF-8.
2. `"0"`, `"0-Jan-00"`, `"NULL"`, `"-"` mean blank in detail columns.
3. Age group labels "06-Dec" = 6–12, "03-May" = 3–5 (Excel date mangling).
4. Some college_created_at values are Excel serial numbers (e.g. 45804.8).
5. Phone numbers are corrupted to scientific notation, so don't use them.
6. School and college names have spelling variants and duplicated text. Use `str.contains(..., case=False)` and show the matched names to the user.
7. `studying = Pending` for most adults is expected (see §4). Don't report it as "9,142 pending cases" without explaining.
8. 5,238 rows are "Data Rolled over" (not re-verified this year). Mention this for questions about data freshness or accuracy.
