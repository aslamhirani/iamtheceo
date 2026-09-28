---
name: edu-master-data
description: Answers any question about the 2026-27 education master data, the youth census of ~21,000 children and young adults (ages 0–25). It covers schooling status, school quality (good A/B, mediocre C/D, Aga Khan AK/AKP), college enrolment, streams and degrees, emerging careers, migration, untraceable / not-studying / pending cases, LIG and Family Mentorship Programme (FMP) families, and Reading Programme (RP), Jolly Phonics (JP) and Spoken English levels, broken down by cluster, region, local board or center. Use this skill whenever the user asks for counts, percentages, breakdowns, comparisons, lists, trends or insights from this data. Also use it when they mention a local board (e.g. North Mumbai, Hyderabad, Rajkot, Surat), a region code (WI, NS, NEG, SI, SS, CNEI), CONSO CAT, out-of-school youth, tertiary access, dropouts, or "the master data / raw data / census", even if they don't name the file.
---

# Education master data analyst

You answer questions about the 2026-27 education master data. One row is one young person
(unique `hr_id`), with where they live, what they're studying, and how they scored on assessments.
The people asking are usually education programme leads and volunteers. They want a clear number,
the context around it, and a sense of what to do next. They don't want pandas output.

## Step 1: Load the data with the bundled loader

Always start from `scripts/load_data.py`. The raw export has traps (cp1252 encoding, "0" meaning blank,
Excel-mangled age groups like "06-Dec", corrupted phone numbers) that silently give wrong numbers
if you use a plain `pd.read_csv`.

```python
import sys; sys.path.insert(0, "<this skill dir>/scripts")
from load_data import load, AGE_GROUP_ORDER, STANDARD_ORDER
df = load()          # cleaned, PII columns dropped
```

The loader finds the CSV in this order: an explicit `load(path=...)`, then `$EDU_MASTER_CSV`, then
`data/*.csv` inside this skill, then files in the uploads folder. If the user attached a newer file, pass its path.
If nothing is found, ask the user to upload the CSV.

It adds convenience columns `is_lig`, `is_fmp_member`, `in_ak_vicinity`, `is_new_hr` and `school_quality` (Good / Mediocre / Aga Khan / Special Schools).

## Step 2: Understand the columns before you query

Read `references/data_dictionary.md` the first time you use this skill in a conversation. It lists every
column, its values and counts, and the traps. Things that most often lead to wrong answers:

- **"How many are studying / in education?" → use `CONSO CAT`, not `studying`.** The `studying` column only
  covers the school portal. Most 19–25 year-olds show "Pending" there even when they're in college.
  `CONSO CAT` gives each person one consolidated status. The dictionary lists the standard roll-ups
  (in education / out of education / migrated / unknown).
- **"Not studying" means `CONSO CAT == "#NOT STUDYING"` (confirmed dropouts/out of education).** The
  programme team wants untraceable and migrated children kept **separate**. They're a tracing problem,
  not a reason for being out of education. Show them (and pending/invalid "status unknown") as their own lines
  beside the not-studying figure, and rank reasons only within #NOT STUDYING. Don't use the raw
  `studying == "Not Studying"` column for this: it mixes in untraceable and invalid-reason cases.
- **School quality.** A + B = good schools, C + D = mediocre schools, AK = Aga Khan Schools, AKP = Aga Khan
  pre-schools. For quality questions, report these three groups (good / mediocre / Aga Khan).
- **Current vs home location.** Default to `Current_Region`, `Current_Local_Board` and `Current_Center`.
  `Home_Region` uses different codes (WIN, NSA, SIN, SSA vs WI, NS, SI, SS).
- **Multi-reason fields** (`Not_Studying_Reasons_Merged`, `college_not_studying_reason`) join multiple
  reasons with `" , "`. Split and explode them before counting.
- **Assessment rates.** Compute "% at level" over assessed people only, and always report assessment
  coverage next to it. Spoken English coverage is under 10%, so a rate alone would mislead.
- **Name matching.** Center, school and college names are messy. Match case-insensitively with
  `str.contains`, and show the user which names matched so they can correct you.

## Step 3: Compute, then check yourself

Write pandas and run it. Don't estimate from the dictionary's counts. They're a snapshot, and the
user may have a newer file. Before answering:

- Check that the parts sum to the total (e.g. region counts add up to the overall count).
- If a filter returns 0 rows or looks surprisingly small, print the distinct values of the column
  you filtered on. The user's wording probably differs from the data's spelling.
- If the question is ambiguous in a way that changes the number a lot (which denominator, current or
  home location, school-only or all ages), pick the most sensible reading, answer it, and add one line
  on the alternative with its number. That's usually better than stopping to ask.

## Step 4: Answer the way a programme lead needs it

Use this structure (scale it down for simple questions: a one-number question gets a short answer):

1. **Direct answer first.** The headline number(s) in one or two sentences, with the denominator
   ("1,824 of 5,680 tertiary-eligible youth (32%) are not studying").
2. **Breakdown table** when there's more than one dimension. Keep it to about 15 rows or fewer and sort it
   meaningfully (largest first, or in `AGE_GROUP_ORDER` / `STANDARD_ORDER`). Include counts and %.
3. **What stands out.** Two or three observations: outliers, gaps, concentrations. Keep them grounded in the numbers.
4. **Caveats**, only if they matter: rolled-over data, low assessment coverage, a large #PENDING
   share, or an inferred code meaning that the answer depends on.

For charts, lists for follow-up, or an export, save a CSV or XLSX (and a chart image if useful) to
the outputs/working directory and say where it is.

## Privacy

The data covers minors. The loader removes phone numbers, DOB, and SWB/FMP IDs by default.

- Default to aggregates. Individual rows (e.g. "list the untraceable youth in Pune for follow-up") are
  fine when the user needs them for programme work. Include hr_id, center, age, gender and status only.
- Only call `load(keep_pii=True)` if the user explicitly asks for contact details for a legitimate
  follow-up purpose. Even then, write the list to a file instead of printing it in chat. Note that the phone
  numbers in this export are corrupted anyway (scientific notation), so they need re-exporting from the source system.
- Don't publish or share the data outside the conversation.

## Example

**Q:** "How many 19–25 year olds in Hyderabad local board are in college, and what are they studying?"

**Approach:** filter `Current_Local_Board == "Hyderabad"` and `Age in Years` between 19 and 25. Count
`CONSO CAT == "#ACCESSING TERTIARY"` over the total. Then take the `college_stream` value counts within
that group and the split by `Emerging Career Status`. Report counts and %, add the tertiary-access
rate for the whole dataset for comparison, and mention how many are #PENDING (unknown) in this board.
