from __future__ import annotations

import os
import re
from typing import Optional, Union

import numpy as np
import pandas as pd
from sqlalchemy import create_engine, text



DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "investasi_jatim")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "diva21")


def build_db_url() -> str:
    if DATABASE_URL:
        # heroku-style: postgres:// -> postgresql://
        if DATABASE_URL.startswith("postgres://"):
            return DATABASE_URL.replace("postgres://", "postgresql://", 1)
        return DATABASE_URL
    return f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


engine = create_engine(build_db_url(), pool_pre_ping=True)

RAW_TABLE = "public.investasi_jatim"
CLEAN_TABLE = "public.investasi_jatim_clean"



def ping_db() -> None:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1;"))


def normalize_column_names(df_raw: pd.DataFrame) -> pd.DataFrame:
    df = df_raw.copy()
    df.columns = (
        df.columns.astype(str)
        .str.strip()
        .str.replace(r"\s+", "_", regex=True)
        .str.replace(r"[()$.]", "", regex=True)
        .str.replace("__+", "_", regex=True)
    )

    # alias kolom investasi
    rename_map = {
        "Nilai_Investasi_Rp_Juta": "NilaiInvestasiRpJuta",
        "Nilai_Investasi_US_Juta": "NilaiInvestasiUSJuta",
        "Nilai_Investasi_Rp_Juta_": "NilaiInvestasiRpJuta",
        "Nilai_Investasi_US_Juta_": "NilaiInvestasiUSJuta",
    }
    df = df.rename(columns=rename_map)
    return df


def normalize_tahun(df: pd.DataFrame) -> None:
    if "Tahun" not in df.columns:
        return
    df["Tahun"] = (
        df["Tahun"]
        .astype(str)
        .str.extract(r"(\d{4})", expand=False)
    )
    df["Tahun"] = pd.to_numeric(df["Tahun"], errors="coerce").astype("Int64")


def normalize_status(df: pd.DataFrame) -> None:
    if "Status" not in df.columns:
        return
    df["Status"] = (
        df["Status"]
        .astype(str)
        .str.strip()
        .str.upper()
        .str.replace("PMDN.*", "PMDN", regex=True)
        .str.replace("PMA.*", "PMA", regex=True)
        .str.replace("PENANAMAN MODAL DALAM NEGERI", "PMDN", regex=False)
        .str.replace("PENANAMAN MODAL ASING", "PMA", regex=False)
    )


def _normalisasi_sektor_single(s: Optional[str]) -> Optional[str]:
    if not isinstance(s, str):
        return s
    s = s.strip()
    s = re.sub(r",\s*dan", " dan", s, flags=re.IGNORECASE)
    s = re.sub(r"\s+", " ", s)
    s = (
        s.replace("Ind.", "Industri")
         .replace("Lainnya", "Lain")
         .replace("Komunikasi", "Telekomunikasi")
         .replace("Dan", "dan")
    )
    return s.title().strip()


def normalize_sektor(df: pd.DataFrame) -> None:
    if "Sektor" not in df.columns:
        return
    df["Sektor"] = (
        df["Sektor"]
        .astype(str)
        .str.strip()
        .str.replace("&", "dan", regex=False)
        .str.replace(r"\s+", " ", regex=True)
        .str.title()
    )
    df["Sektor"] = df["Sektor"].apply(_normalisasi_sektor_single)


def normalize_negara(df: pd.DataFrame) -> None:
    if "Negara" not in df.columns:
        return

    s = (
        df["Negara"]
        .astype(str)
        .str.replace("\xa0", " ", regex=False)
        .str.strip()
        .str.lower()
        .str.replace(r"\s+", " ", regex=True)
    )

    alias_map = {
        "indonesia": "Indonesia",
        "indoneisa": "Indonesia",
        "amerika serikat": "Amerika Serikat",
        "amerika serika": "Amerika Serikat",
        "usa": "Amerika Serikat",
        "u.s.a": "Amerika Serikat",
        "u.s.a.": "Amerika Serikat",
        "united states of america": "Amerika Serikat",
        "uni emirat arab": "Uni Emirat Arab",
        "uae": "Uni Emirat Arab",
        "u.a.e": "Uni Emirat Arab",
        "u.a.e.": "Uni Emirat Arab",
        "r.r. tiongkok": "Tiongkok",
        "rrt": "Tiongkok",
        "tiongkok": "Tiongkok",
        "china": "Tiongkok",
        "people's republic of china": "Tiongkok",
        "people republic of china": "Tiongkok",
        "hongkong, rrt": "Hong Kong",
        "hong kong": "Hong Kong",
        "hongkong": "Hong Kong",
        "philipina": "Filipina",
        "philippine": "Filipina",
        "filipina": "Filipina",
        "swaziland": "Eswatini",
        "brazil": "Brasil",
        "brasil": "Brasil",
        "samoa barat": "Samoa Barat",
        "singapore": "Singapura",
        "irland": "Irlandia",
        "irlandia": "Irlandia",
        "afghanistan": "Afghanistan",
        "albania": "Albania",
        "algeria": "Aljazair",
        "andorra": "Andorra",
        "angola": "Angola",
        "antigua and barbuda": "Antigua dan Barbuda",
        "argentina": "Argentina",
        "armenia": "Armenia",
        "australia": "Australia",
        "austria": "Austria",
        "azerbaijan": "Azerbaijan",
        "bahamas": "Bahama",
        "bahrain": "Bahrain",
        "bangladesh": "Bangladesh",
        "barbados": "Barbados",
        "belarus": "Belarus",
        "belgium": "Belgia",
        "belize": "Belize",
        "benin": "Benin",
        "bhutan": "Bhutan",
        "bolivia": "Bolivia",
        "bosnia and herzegovina": "Bosnia dan Herzegovina",
        "botswana": "Botswana",
        "brazil": "Brasil",
        "brunei": "Brunei Darussalam",
        "bulgaria": "Bulgaria",
        "burkina faso": "Burkina Faso",
        "burundi": "Burundi",
        "cambodia": "Kamboja",
        "cameroon": "Kamerun",
        "canada": "Kanada",
        "cape verde": "Tanjung Verde",
        "central african republic": "Republik Afrika Tengah",
        "chad": "Chad",
        "chile": "Chili",
        "china": "Tiongkok",
        "colombia": "Kolombia",
        "comoros": "Komoro",
        "congo": "Kongo",
        "costa rica": "Kosta Rika",
        "croatia": "Kroasia",
        "cuba": "Kuba",
        "cyprus": "Siprus",
        "czech republic": "Republik Ceko",
        "denmark": "Denmark",
        "djibouti": "Djibouti",
        "dominica": "Dominika",
        "dominican republic": "Republik Dominika",
        "ecuador": "Ekuador",
        "egypt": "Mesir",
        "el salvador": "El Salvador",
        "equatorial guinea": "Guinea Khatulistiwa",
        "eritrea": "Eritrea",
        "estonia": "Estonia",
        "eswatini": "Eswatini",
        "ethiopia": "Ethiopia",
        "fiji": "Fiji",
        "finland": "Finlandia",
        "france": "Prancis",
        "gabon": "Gabon",
        "gambia": "Gambia",
        "georgia": "Georgia",
        "germany": "Jerman",
        "ghana": "Ghana",
        "greece": "Yunani",
        "grenada": "Grenada",
        "guatemala": "Guatemala",
        "guinea": "Guinea",
        "guinea-bissau": "Guinea-Bissau",
        "guyana": "Guyana",
        "haiti": "Haiti",
        "honduras": "Honduras",
        "hungary": "Hungaria",
        "iceland": "Islandia",
        "india": "India",
        "indonesia": "Indonesia",
        "iran": "Iran",
        "iraq": "Irak",
        "ireland": "Irlandia",
        "israel": "Israel",
        "italy": "Italia",
        "jamaica": "Jamaika",
        "japan": "Jepang",
        "jordan": "Yordania",
        "kazakhstan": "Kazakhstan",
        "kenya": "Kenya",
        "kiribati": "Kiribati",
        "kuwait": "Kuwait",
        "kyrgyzstan": "Kirgizstan",
        "laos": "Laos",
        "latvia": "Latvia",
        "lebanon": "Lebanon",
        "lesotho": "Lesotho",
        "liberia": "Liberia",
        "libya": "Libya",
        "liechtenstein": "Liechtenstein",
        "lithuania": "Lituania",
        "luxembourg": "Luksemburg",
        "madagascar": "Madagaskar",
        "malawi": "Malawi",
        "malaysia": "Malaysia",
        "maldives": "Maladewa",
        "mali": "Mali",
        "malta": "Malta",
        "marshall islands": "Kepulauan Marshall",
        "mauritania": "Mauritania",
        "mauritius": "Mauritius",
        "mexico": "Meksiko",
        "micronesia": "Mikronesia",
        "moldova": "Moldova",
        "monaco": "Monako",
        "mongolia": "Mongolia",
        "montenegro": "Montenegro",
        "morocco": "Maroko",
        "mozambique": "Mozambik",
        "myanmar": "Myanmar",
        "namibia": "Namibia",
        "nauru": "Nauru",
        "nepal": "Nepal",
        "netherlands": "Belanda",
        "new zealand": "Selandia Baru",
        "nicaragua": "Nikaragua",
        "niger": "Niger",
        "nigeria": "Nigeria",
        "north korea": "Korea Utara",
        "north macedonia": "Makedonia Utara",
        "norway": "Norwegia",
        "oman": "Oman",
        "pakistan": "Pakistan",
        "palau": "Palau",
        "panama": "Panama",
        "papua new guinea": "Papua Nugini",
        "paraguay": "Paraguay",
        "peru": "Peru",
        "philippines": "Filipina",
        "poland": "Polandia",
        "portugal": "Portugal",
        "qatar": "Qatar",
        "romania": "Rumania",
        "russia": "Rusia",
        "rwanda": "Rwanda",
        "saint kitts and nevis": "Saint Kitts dan Nevis",
        "saint lucia": "Saint Lucia",
        "saint vincent and the grenadines": "Saint Vincent dan Grenadines",
        "samoa": "Samoa",
        "san marino": "San Marino",
        "saudi arabia": "Arab Saudi",
        "senegal": "Senegal",
        "serbia": "Serbia",
        "seychelles": "Seychelles",
        "sierra leone": "Sierra Leone",
        "singapore": "Singapura",
        "slovakia": "Slowakia",
        "slovenia": "Slovenia",
        "solomon islands": "Kepulauan Solomon",
        "somalia": "Somalia",
        "south africa": "Afrika Selatan",
        "south sudan": "Sudan Selatan",
        "spain": "Spanyol",
        "sri lanka": "Sri Lanka",
        "sudan": "Sudan",
        "suriname": "Suriname",
        "sweden": "Swedia",
        "switzerland": "Swiss",
        "syria": "Suriah",
        "tajikistan": "Tajikistan",
        "tanzania": "Tanzania",
        "thailand": "Thailand",
        "timor-leste": "Timor Leste",
        "togo": "Togo",
        "tonga": "Tonga",
        "trinidad and tobago": "Trinidad dan Tobago",
        "tunisia": "Tunisia",
        "turkey": "Turki",
        "turkmenistan": "Turkmenistan",
        "tuvalu": "Tuvalu",
        "uganda": "Uganda",
        "ukraine": "Ukraina",
        "united arab emirates": "Uni Emirat Arab",
        "united kingdom": "Inggris",
        "united states": "Amerika Serikat",
        "uruguay": "Uruguay",
        "uzbekistan": "Uzbekistan",
        "vanuatu": "Vanuatu",
        "vatican city": "Vatikan",
        "venezuela": "Venezuela",
        "vietnam": "Vietnam",
        "yemen": "Yaman",
        "zambia": "Zambia",
        "zimbabwe": "Zimbabwe"
    }

    def _norm_single(x: str) -> str:
        key = str(x).strip().lower()
        key = re.sub(r"\s+", " ", key)
        if key in alias_map:
            return alias_map[key]
        return key.title()

    df["Negara"] = s.apply(_norm_single)



def _to_float_safe(x: Union[str, int, float, None]) -> Optional[float]:
    if x is None or (isinstance(x, float) and np.isnan(x)):
        return None

    if isinstance(x, (int, float, np.integer, np.floating)):
        try:
            return float(x)
        except Exception:
            return None

    s = str(x).strip()
    if s == "":
        return None

    negative = False
    if re.fullmatch(r"\(.*\)", s):
        negative = True
        s = s[1:-1].strip()

    s = s.replace("\xa0", " ").replace("−", "-").strip()

    s = re.sub(r"(Rp|IDR|rupiah|USD|\$|usd|dollar)", "", s, flags=re.IGNORECASE).strip()
    s = re.sub(r"[^0-9,.\-]", "", s)

    if s in {"", "-", ".", ","}:
        return None

    s = re.sub(r"(?<!^)-", "", s)

    if "." in s and "," in s:
        s = s.replace(".", "").replace(",", ".")
    elif "," in s and "." not in s:
        s = s.replace(",", ".")
    else:
        pass

    if negative and not s.startswith("-"):
        s = "-" + s

    try:
        return float(s)
    except ValueError:
        return None


def normalize_juta_with_report(df: pd.DataFrame, col: str = "NilaiInvestasiRpJuta") -> None:
    if col not in df.columns:
        df[col] = pd.NA
        return
    df[col] = df[col].apply(_to_float_safe)


def normalize_usd_with_report(df: pd.DataFrame, col: str = "NilaiInvestasiUSJuta") -> None:
    if col not in df.columns:
        df[col] = pd.NA
        return
    df[col] = df[col].apply(_to_float_safe)


def normalize_tki(df: pd.DataFrame) -> None:
    if "TKI" not in df.columns:
        return
    s = df["TKI"].astype(str).str.strip()
    s = (
        s.str.replace(".", "", regex=False)
         .str.replace(",", "", regex=False)
         .str.replace(r"[^\d\-]", "", regex=True)
    )
    df["TKI"] = pd.to_numeric(s, errors="coerce").astype("Int64")


def create_triliun_and_verify(
    df: pd.DataFrame,
    col_juta: str = "NilaiInvestasiRpJuta",
    col_triliun: str = "NilaiInvestasiRpTriliun",
) -> None:
    if col_juta not in df.columns:
        df[col_juta] = pd.NA
    df[col_triliun] = pd.to_numeric(df[col_juta], errors="coerce") / 1_000_000


def clean_kab_kota(df: pd.DataFrame) -> None:
    if "Kab/Kota" not in df.columns:
        return
    df["Kab/Kota"] = (
        df["Kab/Kota"]
        .astype(str)
        .str.replace(r"^Kab\.", "Kabupaten", regex=True)
        .str.replace(r"^Kota\.", "Kota", regex=True)
        .str.replace(r"\s+", " ", regex=True)
        .str.strip()
    )


def add_bakorwil(df: pd.DataFrame) -> None:
    bakorwil_map = {
        "Kabupaten Madiun": "Bakorwil I", "Kota Madiun": "Bakorwil I",
        "Kabupaten Magetan": "Bakorwil I", "Kabupaten Ngawi": "Bakorwil I",
        "Kabupaten Ponorogo": "Bakorwil I", "Kabupaten Trenggalek": "Bakorwil I",
        "Kabupaten Tulungagung": "Bakorwil I", "Kabupaten Pacitan": "Bakorwil I",
        "Kabupaten Kediri": "Bakorwil I", "Kota Kediri": "Bakorwil I",

        "Kabupaten Bojonegoro": "Bakorwil II", "Kabupaten Tuban": "Bakorwil II",
        "Kabupaten Lamongan": "Bakorwil II", "Kabupaten Gresik": "Bakorwil II",
        "Kabupaten Jombang": "Bakorwil II", "Kabupaten Mojokerto": "Bakorwil II",
        "Kota Mojokerto": "Bakorwil II", "Kabupaten Nganjuk": "Bakorwil II",

        "Kabupaten Malang": "Bakorwil III", "Kota Malang": "Bakorwil III",
        "Kota Batu": "Bakorwil III", "Kabupaten Pasuruan": "Bakorwil III",
        "Kota Pasuruan": "Bakorwil III", "Kabupaten Sidoarjo": "Bakorwil III",
        "Kabupaten Blitar": "Bakorwil III", "Kota Blitar": "Bakorwil III",
        "Kota Surabaya": "Bakorwil III",

        "Kabupaten Bangkalan": "Bakorwil IV", "Kabupaten Sampang": "Bakorwil IV",
        "Kabupaten Pamekasan": "Bakorwil IV", "Kabupaten Sumenep": "Bakorwil IV",

        "Kabupaten Probolinggo": "Bakorwil V", "Kota Probolinggo": "Bakorwil V",
        "Kabupaten Lumajang": "Bakorwil V", "Kabupaten Jember": "Bakorwil V",
        "Kabupaten Bondowoso": "Bakorwil V", "Kabupaten Situbondo": "Bakorwil V",
        "Kabupaten Banyuwangi": "Bakorwil V",
    }
    if "Kab/Kota" not in df.columns:
        return
    df["Bakorwil"] = df["Kab/Kota"].map(bakorwil_map).fillna("Tidak Terpetakan")


def add_perpres80(df: pd.DataFrame) -> None:
    perpres_80_groups = {
        "Gerbangkertosusila": [
            "Kabupaten Gresik", "Kabupaten Bangkalan", "Kabupaten Mojokerto",
            "Kota Mojokerto", "Kota Surabaya", "Kabupaten Sidoarjo",
            "Kabupaten Lamongan", "Kabupaten Tuban", "Kabupaten Bojonegoro",
            "Kabupaten Jombang",
        ],
        "BTS": [
            "Kabupaten Pasuruan", "Kota Pasuruan", "Kabupaten Probolinggo",
            "Kota Probolinggo", "Kabupaten Malang", "Kota Malang",
            "Kabupaten Lumajang", "Kota Batu",
        ],
        "Wilis": [
            "Kabupaten Kediri", "Kota Kediri", "Kabupaten Nganjuk",
            "Kabupaten Madiun", "Kota Madiun", "Kabupaten Ponorogo",
            "Kabupaten Trenggalek", "Kabupaten Tulungagung", "Kabupaten Pacitan",
            "Kabupaten Magetan", "Kabupaten Ngawi", "Kabupaten Blitar", "Kota Blitar",
        ],
        "Madura": [
            "Kabupaten Sampang", "Kabupaten Pamekasan", "Kabupaten Sumenep",
        ],
        "Ijen": [
            "Kabupaten Banyuwangi", "Kabupaten Bondowoso", "Kabupaten Situbondo", "Kabupaten Jember",
        ],
    }
    if "Kab/Kota" not in df.columns:
        return
    perpres_80_map = {kab: wilayah for wilayah, daftar in perpres_80_groups.items() for kab in daftar}
    df["WilayahPerpres80"] = df["Kab/Kota"].map(perpres_80_map).fillna("Tidak Terpetakan")


def load_raw() -> pd.DataFrame:
    sql = f"""
        SELECT
            "Deskripsi Sektor Utama",
            "Kode Sektor",
            "Sektor",
            "Tahun",
            "Nama Perusahaan",
            "Negara",
            "Nilai Investasi US Juta",
            "Nilai Investasi Rp Juta",
            "TKI",
            "Status",
            "Kab/Kota"
        FROM {RAW_TABLE};
    """
    with engine.connect() as conn:
        df_raw = pd.read_sql(text(sql), conn)
    return df_raw


def build_clean(df_raw: pd.DataFrame) -> pd.DataFrame:
    df = normalize_column_names(df_raw)

    if "Nilai_Investasi_Rp_Juta" in df.columns and "NilaiInvestasiRpJuta" not in df.columns:
        df = df.rename(columns={"Nilai_Investasi_Rp_Juta": "NilaiInvestasiRpJuta"})
    if "Nilai_Investasi_US_Juta" in df.columns and "NilaiInvestasiUSJuta" not in df.columns:
        df = df.rename(columns={"Nilai_Investasi_US_Juta": "NilaiInvestasiUSJuta"})

    normalize_tahun(df)
    normalize_status(df)
    normalize_sektor(df)
    normalize_negara(df)

    normalize_juta_with_report(df, col="NilaiInvestasiRpJuta")
    normalize_usd_with_report(df, col="NilaiInvestasiUSJuta")
    create_triliun_and_verify(df, col_juta="NilaiInvestasiRpJuta", col_triliun="NilaiInvestasiRpTriliun")
    normalize_tki(df)

    clean_kab_kota(df)
    add_bakorwil(df)
    add_perpres80(df)

    #tipe numerik 
    df["Tahun"] = pd.to_numeric(df.get("Tahun"), errors="coerce").astype("Int64")
    df["NilaiInvestasiRpJuta"] = pd.to_numeric(df.get("NilaiInvestasiRpJuta"), errors="coerce")
    df["NilaiInvestasiRpTriliun"] = pd.to_numeric(df.get("NilaiInvestasiRpTriliun"), errors="coerce")
    df["NilaiInvestasiUSJuta"] = pd.to_numeric(df.get("NilaiInvestasiUSJuta"), errors="coerce")

    # raw_id traceable
    df = df.reset_index(drop=True)
    df.insert(0, "raw_id", df.index + 1)
    rename_dash = {
        "Deskripsi_Sektor_Utama": "Deskripsi_Sektor_Utama",
        "Kode_Sektor": "Kode_Sektor",
        "Nama_Perusahaan": "Nama_Perusahaan",
    }
    df = df.rename(columns=rename_dash)

    return df



#  OVERWRITE TABLE CLEAN
def overwrite_clean_table(df_clean: pd.DataFrame) -> None:
    with engine.begin() as conn:
        conn.execute(text(f"DROP TABLE IF EXISTS {CLEAN_TABLE};"))

    df_clean.to_sql(
        name=CLEAN_TABLE.split(".")[-1],
        con=engine,
        schema=CLEAN_TABLE.split(".")[0],
        if_exists="replace",
        index=False,
        method="multi",
        chunksize=5000,
    )

    with engine.begin() as conn:
        conn.execute(text(f'CREATE INDEX IF NOT EXISTS idx_clean_tahun ON {CLEAN_TABLE} ("Tahun");'))
        conn.execute(text(f'CREATE INDEX IF NOT EXISTS idx_clean_status ON {CLEAN_TABLE} ("Status");'))
        conn.execute(text(f'CREATE INDEX IF NOT EXISTS idx_clean_kabkota ON {CLEAN_TABLE} ("Kab/Kota");'))


def verify_totals() -> pd.DataFrame:
    sql = f"""
        SELECT "Tahun" AS tahun,
               SUM("NilaiInvestasiRpTriliun") AS total_triliun
        FROM {CLEAN_TABLE}
        GROUP BY "Tahun"
        ORDER BY "Tahun";
    """
    with engine.connect() as conn:
        out = pd.read_sql(text(sql), conn)
    return out


if __name__ == "__main__":
    print("Ping DB...")
    ping_db()
    print("DB OK")

    print(f"Load RAW from {RAW_TABLE} ...")
    raw = load_raw()
    print(f"RAW rows: {len(raw):,}")
    print("RAW columns:", list(raw.columns))

    print("Build CLEAN (preprocessing benar)...")
    clean = build_clean(raw)
    print(f"CLEAN rows: {len(clean):,}")
    print("CLEAN columns:", list(clean.columns))

    print(f"Overwrite {CLEAN_TABLE} ...")
    overwrite_clean_table(clean)
    print("Overwrite done")

    print("\nVerify totals (Triliun) per tahun:")
    totals = verify_totals()
    print(totals.to_string(index=False))

    print("\nSelesai. Restart aplikasi Dash kamu biar reload data dari DB clean yang baru.")
