# Chat-Websocket-ExpressJS

Backend real-time menggunakan **Express.js** dan **Socket.io**, dijalankan dengan runtime **Bun**, serta **Prisma ORM** (adapter PostgreSQL) untuk database.

## ✨ Fitur

- REST API dasar untuk resource **User** (`/users`)
- Modul **Chat** real-time via **Socket.io** (`/chat`)
- Autentikasi/hash password dengan **bcrypt**
- **Prisma ORM** + adapter `@prisma/adapter-pg` untuk koneksi ke PostgreSQL
- Static file serving dari folder `public/`
- Ditulis penuh dengan **TypeScript**, dijalankan via **Bun**

## 🛠️ Tech Stack

| Kategori      | Teknologi                                         |
| ------------- | ------------------------------------------------- |
| Runtime       | [Bun](https://bun.com)                            |
| Web framework | Express 5                                         |
| Real-time     | Socket.io 4                                       |
| ORM           | Prisma 7 (`@prisma/client`, `@prisma/adapter-pg`) |
| Database      | PostgreSQL                                        |
| Auth/Hashing  | bcrypt                                            |
| Bahasa        | TypeScript                                        |

## 📁 Struktur Project

```
Websocket-ExpressJS/
├── prisma/              # Schema & migration Prisma
├── public/               # Static assets (dilayani via express.static)
├── src/
│   ├── user/              # Route/controller untuk resource user
│   │   └── user.controller.ts
│   └── chat/              # Route/controller + handler Socket.io untuk chat
│       └── chat.controller.ts
├── .env.example           # Contoh konfigurasi environment variable
├── index.ts               # Entry point aplikasi (setup Express + Socket.io server)
├── prisma.config.ts       # Konfigurasi Prisma
├── package.json
└── tsconfig.json
```

## 🚀 Cara Setup

### 1. Prasyarat

- [Bun](https://bun.com) versi terbaru (project ini dibuat dengan Bun v1.3.10)
- PostgreSQL (lokal atau remote) untuk database

### 2. Clone repository

```bash
git clone https://github.com/naraya-albani/Websocket-ExpressJS.git
cd Websocket-ExpressJS
```

### 3. Install dependencies

```bash
bun install
```

### 4. Konfigurasi environment variable

Salin `.env.example` menjadi `.env`, lalu sesuaikan isinya:

```bash
cp .env.example .env
```

Isi `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost/db_name
PORT=3000
```

- `DATABASE_URL` — connection string PostgreSQL untuk Prisma
- `PORT` — port server Express (default `3000`)

### 5. Setup database dengan Prisma

Generate Prisma client dan sinkronkan schema ke database:

```bash
bunx prisma generate
bunx prisma db push
```

### 6. Jalankan aplikasi

**Mode development** (auto-reload saat ada perubahan file):

```bash
bun --watch index.ts
```

atau

```bash
bun run dev
```

**Build untuk production:**

```bash
bun run build
```

**Jalankan hasil build:**

```bash
bun run start
```

Setelah server berjalan, kamu akan melihat log berikut di terminal:

```
Server jalan di http://localhost:3000
```

## 📡 Endpoint

| Method/Event | Path                    | Keterangan                                                                     |
| ------------ | ----------------------- | ------------------------------------------------------------------------------ |
| `*`          | `/users`                | Route untuk resource user (lihat `src/user/user.controller.ts`)                |
| `*`          | `/chat`                 | Route REST untuk chat (lihat `src/chat/chat.controller.ts`)                    |
| Socket.io    | `/` (default namespace) | Koneksi real-time untuk fitur chat, di-register lewat `registerChatSocket(io)` |

> Socket.io dikonfigurasi dengan CORS terbuka (`origin: "*"`) sehingga bisa diakses dari client mana pun selama development.

## 📜 Script yang Tersedia

| Script          | Perintah                                         | Keterangan                             |
| --------------- | ------------------------------------------------ | -------------------------------------- |
| `bun run dev`   | `bun --watch index.ts`                           | Menjalankan server dengan hot-reload   |
| `bun run build` | `bun build index.ts --outdir dist --target node` | Build project ke folder `dist/`        |
| `bun run start` | `node dist/index.js`                             | Menjalankan hasil build dengan Node.js |
