# OMR Ujian

Aplikasi web untuk pemrosesan **Optical Mark Recognition (OMR)** pada lembar ujian. Dibangun dengan [Next.js](https://nextjs.org) dan dapat dijalankan lokal maupun menggunakan Docker.

## Fitur

- Scan dan koreksi jawaban OMR dari gambar
- Kelola kunci jawaban dan template lembar ujian
- Manajemen hasil scan dan laporan

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Node.js 20
- **Database**: SQLite (via Prisma ORM)
- **Styling**: Tailwind CSS v4
- **Docker**: Node.js 20 Alpine + vips-dev

## Prasyarat

- [Node.js](https://nodejs.org/) >= 20 (untuk local dev)
- [Docker](https://www.docker.com/) & Docker Compose (untuk Docker)
- [npm](https://www.npmjs.com/) atau [pnpm](https://pnpm.io/)

## Jalankan dengan Docker (Direkomendasikan)

1. **Clone repository**

   ```bash
   git clone https://github.com/bimadevs/omr-ujian.git
   cd omr-ujian
   ```

2. **Build & jalankan container**

   ```bash
   docker compose up --build -d
   ```

3. **Akses aplikasi**

   Buka browser ke: [http://localhost:3323](http://localhost:3323)

4. **Stop container**

   ```bash
   docker compose down
   ```

### Catatan Docker

- Port default: **3323**
- Database SQLite disimpan di `./data/dev.db` (dipersist dengan Docker volume)
- Upload file disimpan di `./public/uploads/`
- Prisma migrate otomatis berjalan saat container start

## Jalankan Secara Lokal (Local Dev)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Generate Prisma Client & Migrate**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

3. **Jalankan development server**

   ```bash
   npm run dev
   ```

4. **Akses aplikasi**

   Buka browser ke: [http://localhost:3323](http://localhost:3323)

## Skrip npm

| Perintah          | Keterangan                              |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Jalankan server dev di port `3323`      |
| `npm run build`   | Build aplikasi untuk production         |
| `npm run start`   | Jalankan server production              |
| `npm run lint`    | Jalankan ESLint                         |

## Environment Variables

| Variabel          | Default                  | Keterangan          |
| ----------------- | ------------------------ | ------------------- |
| `PORT`            | `3323`                   | Port server         |
| `DATABASE_URL`    | `file:./data/dev.db`     | Path SQLite database|
| `NEXT_TELEMETRY_DISABLED` | `1`              | Matikan telemetry   |

## Struktur Direktori

```
.
├── app/                # Next.js App Router
│   ├── api/            # API Routes
│   ├── results/        # Halaman hasil scan
│   ├── scan/           # Halaman scan OMR
│   └── templates/      # Halaman template lembar
├── components/         # React Components
├── context/            # React Context
├── hooks/              # Custom React Hooks
├── lib/                # Utility & logic OMR
├── prisma/             # Prisma schema & migrations
├── data/               # SQLite database (volume)
├── public/uploads/     # File uploads (volume)
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Lisensi

[MIT](LICENSE)

