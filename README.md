Monorepo modern: **React + TypeScript** (frontend) + **FastAPI Python** (backend).

**-- Frontend --
Masuk ke direktori frontend **
  cd frontend

**Install Dependensi**
  npm install

**Konfigurasi environement**
  cp .env.example .env

**Menjalankan server dev**
  npm run dev


**-- Backend --
Masuk ke direktori backend**
  cd backend

**Membuat virtual environment**
  python -m venv .venv

**Mengaktifkan virtual environment**
  Windows: .venv\Scripts\activate
  Mac/Linux: source .venv/bin/activate
**
Install dependensi**
  pip install -r requirements.txt

**Konfigurasi environment**
  cp .env.example .env

**Menjalankan server**
  uvicorn main:app --reload --port 8000
