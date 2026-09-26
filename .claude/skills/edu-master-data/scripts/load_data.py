#!/usr/bin/env python3
"""Load and clean the 2026-27 education master data (youth census) CSV.

Usage as a library (preferred):
    import sys; sys.path.insert(0, "<skill_dir>/scripts")
    from load_data import load
    df = load()                 # cleaned, PII removed
    df = load(keep_pii=True)    # only if the user explicitly needs contact fields

Usage as a CLI:
    python load_data.py profile              # shape + value counts of key columns
    python load_data.py deidentify OUT.csv   # write a PII-free copy (used to bundle data)
    python load_data.py path                 # show which file would be loaded

Why this exists: the raw export has several traps that silently produce wrong
numbers (cp1252 encoding, "0"/"0-Jan-00"/"NULL" used as blanks, Excel-mangled
age-group labels, phone numbers in scientific notation). Cleaning once here
keeps every answer consistent.
"""
import glob
import os
import sys

import pandas as pd

SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Columns that identify or contact a person. Dropped by default.
PII_COLS = ["phone_number_1", "father_mobile_number", "dob", "swb_pid", "FMP Member ID"]

# Excel turned "6-12" into "06-Dec" and "3-5" into "03-May".
AGE_GROUP_FIX = {"06-Dec": "6-12", "03-May": "3-5"}
AGE_GROUP_ORDER = ["0-2", "3-5", "6-12", "13-15", "16-18", "19-21", "22-25"]

STANDARD_ORDER = [
    "Play Group", "Nursery", "JR.Kg", "SR.Kg",
    "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th",
    "F.Y.Degree College", "S.Y.Degree College", "T.Y.Degree College",
    "Diploma (Yr 1)", "Diploma (Yr 2)", "Diploma (Yr 3)",
]

# Values that mean "blank / not filled" in free-text and detail columns.
BLANK_TOKENS = {"0", "", "NULL", "0-Jan-00", "-", "nan"}

# Columns where a literal "0" means blank (not a real value).
ZERO_IS_BLANK = [
    "School_name", "School_ID", "curriculum", "medium", "school_category", "standard",
    "Not_Studying_Reasons_Merged", "ed_school_remarks", "Highest_standard",
    "College", "college_degree", "college_stream", "college_not_studying_reason",
    "college_remarks", "college_studying", "Degree Year",
    "Ed_created_at", "ed_updated_at", "college_created_at", "college_updated_at",
]

SCHOOL_QUALITY = {"A": "Good (A/B)", "B": "Good (A/B)", "C": "Mediocre (C/D)", "D": "Mediocre (C/D)",
                  "AK": "Aga Khan (AK/AKP)", "AKP": "Aga Khan (AK/AKP)", "Special Schools": "Special Schools"}

DATE_COLS = ["Ed_created_at", "ed_updated_at", "college_created_at", "college_updated_at"]


def find_csv(path=None):
    """Locate the data file. Order: explicit path, $EDU_MASTER_CSV, skill data/, uploads."""
    candidates = []
    if path:
        candidates.append(path)
    if os.environ.get("EDU_MASTER_CSV"):
        candidates.append(os.environ["EDU_MASTER_CSV"])
    candidates += sorted(glob.glob(os.path.join(SKILL_DIR, "data", "*.csv")))
    candidates += sorted(glob.glob(os.path.expanduser("~/.claude/uploads/**/*master_data*.csv"), recursive=True))
    candidates += sorted(glob.glob("/mnt/user-data/uploads/*master*data*.csv"))
    for c in candidates:
        if c and os.path.exists(c):
            return c
    raise FileNotFoundError(
        "Master data CSV not found. Pass a path, set EDU_MASTER_CSV, "
        f"or place the file in {os.path.join(SKILL_DIR, 'data')}/"
    )


def _read(path):
    for enc in ("utf-8", "cp1252", "latin-1"):
        try:
            return pd.read_csv(path, dtype=str, keep_default_na=False, encoding=enc)
        except UnicodeDecodeError:
            continue
    raise ValueError(f"Could not decode {path}")


def _parse_date(s):
    # Dates look like "20-Jun-26"; a few college_created_at values are Excel serials (e.g. 45804.8).
    out = pd.to_datetime(s, format="%d-%b-%y", errors="coerce")
    serial = pd.to_numeric(s, errors="coerce")
    mask = out.isna() & serial.between(30000, 60000)
    fixed = (pd.to_datetime("1899-12-30") + pd.to_timedelta(serial[mask], unit="D")).dt.floor("s")
    return out.astype("datetime64[ns]").where(~mask, fixed)


def load(path=None, keep_pii=False):
    df = _read(find_csv(path))
    df.columns = [c.strip() for c in df.columns]
    for c in df.columns:
        df[c] = df[c].str.strip()

    df["Age group"] = df["Age group"].replace(AGE_GROUP_FIX)
    df["Age group"] = pd.Categorical(df["Age group"], categories=AGE_GROUP_ORDER, ordered=True)

    for c in ZERO_IS_BLANK:
        if c in df.columns:
            df[c] = df[c].where(~df[c].isin(BLANK_TOKENS), pd.NA)

    for c in DATE_COLS:
        if c in df.columns:
            df[c] = _parse_date(df[c])

    for c in ["Age in Months", "Age in Years", "Eligible Flag"]:
        df[c] = pd.to_numeric(df[c], errors="coerce").astype("Int64")

    # Convenience booleans (keep the original string columns too).
    df["is_lig"] = df["IS LIG"].eq("LIG")
    df["is_fmp_member"] = df["is_fmp"].eq("FMP")
    df["in_ak_vicinity"] = df["AK vicinity"].ne("#NON AK VICINITY")
    df["is_new_hr"] = df["Data Category"].eq("Data collection - New HR")
    # Confirmed by data owner: A/B = good, C/D = mediocre, AK/AKP = Aga Khan school / pre-school.
    df["school_quality"] = df["school_category"].map(SCHOOL_QUALITY)

    if not keep_pii:
        df = df.drop(columns=[c for c in PII_COLS if c in df.columns])
    return df


def profile(df):
    print(f"Rows: {len(df):,}  Columns: {df.shape[1]}")
    for c in ["Cluster Region", "Current_Region", "Center Type", "Age group", "gender",
              "studying", "college_studying", "CONSO CAT", "Data Category", "Eligible Flag"]:
        print(f"\n== {c}")
        print(df[c].value_counts(dropna=False).to_string())


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "profile"
    if cmd == "path":
        print(find_csv())
    elif cmd == "deidentify":
        out = sys.argv[2]
        raw = _read(find_csv(sys.argv[3] if len(sys.argv) > 3 else None))
        raw.drop(columns=[c for c in PII_COLS if c in raw.columns]).to_csv(out, index=False, encoding="utf-8")
        print(f"Wrote {out}")
    else:
        profile(load())
