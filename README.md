# Fyneeds Transcript Frontend

Frontend Next.js App Router untuk merender transcript ticket yang diterima dari backend.

## Deploy ke Vercel

Project ini sudah siap dideploy sebagai project Next.js di Vercel.

Environment variable yang wajib diisi di Vercel:

- `NEXT_PUBLIC_BACKEND_URL`: URL public backend transcript, contoh `https://transcript-api.example.com`.
- `BACKEND_INTERNAL_URL`: opsional. Kosongkan jika backend tidak punya URL internal khusus.

Jangan upload `.env` asli ke repository atau Vercel. Gunakan dashboard Vercel untuk mengisi environment variable.

## Menjalankan

Gunakan Node.js 20.9 atau lebih baru.

```bash
cp .env.example .env.local
npm install
npm run build
npm start
```

Hosting harus menggunakan Node.js server karena halaman transcript mengambil data dari backend secara dinamis.
