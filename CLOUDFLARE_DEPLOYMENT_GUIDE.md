# ☁️ বরিশাল রক্ত - Cloudflare D1 ও Pages ডিপ্লয়মেন্ট গাইড (Deployment Guide)

এই প্রজেক্টটি **Cloudflare D1 Serverless SQL Database** এবং **Cloudflare Pages / Workers Functions**-এর মাধ্যমে গ্লোবাল এজ নেটওয়ার্কে সম্পূর্ণ প্রস্তুত অবস্থায় ডিপ্লয় করার উপযোগী করা হয়েছে।

---

## 🚀 দ্রুত ৩-ধাপে Cloudflare ডিপ্লয়মেন্ট (Quick Start)

### ধাপ ১: Cloudflare CLI (Wrangler) লগইন করুন
```bash
npx wrangler login
```
*(আপনার ব্রাউজারে Cloudflare অ্যাকাউন্ট অথোরাইজেশন পেজ খুলবে এবং এক্সেস অনুমোদন দিন)*

---

### ধাপ ২: Cloudflare D1 ডেটাবেস তৈরি করুন
```bash
npm run d1:create
# অথবা:
npx wrangler d1 create barishal-rokto-d1
```
টার্মিনালে আপনি একটি `database_id` আউটপুট দেখতে পাবেন, যেমন:
```
✅ Successfully created DB 'barishal-rokto-d1' with ID '9f1a23b4-56c7-88d9-0e1f-23456789abcd'
```
এই ID-টি `wrangler.jsonc` এবং `wrangler.toml` ফাইলের `database_id` ফিল্ডে বসিয়ে দিন।

---

### ধাপ ৩: D1 স্কিমা ও প্রাথমিক ডেটা মাইগ্রেশন চালান
```bash
# স্কিমা টেবিল তৈরি (Users, Donors, Requests, Hospitals, etc.)
npm run d1:migrate:remote

# প্রাথমিক ডেটা ও হাসপাতাল তালিকা সিড (Seed) করুন
npm run d1:seed:remote
```

---

### ধাপ ৪: Cloudflare R2 মিডিয়া বাকেট তৈরি করুন (ছবি ও অ্যালবামের জন্য)
```bash
npx wrangler r2 bucket create barishal-rokto-media
```

---

### ধাপ ৫: Cloudflare Pages-এ প্রোডাকশন ডিপ্লয় করুন
```bash
npm run deploy:cf
```
অভিনন্দন! আপনার অ্যাপটি `https://barishal-rokto.pages.dev`-এ সফলভাবে লাইভ হয়ে যাবে।

---

## 🛠️ ফাইল ও আর্কিটেকচার স্ট্রাকচার (Architecture Overview)

| ফাইল/ডিরেক্টরি | ভূমিকা ও বিবরণ |
|---|---|
| `wrangler.jsonc` | Cloudflare Pages & D1 কনফিগারেশন (D1 database binding `DB` এবং R2 bucket binding) |
| `wrangler.toml` | Wrangler TOML সংস্করণ |
| `migrations/0001_d1_schema.sql` | Cloudflare D1 সার্ভারলেস এসকিউএল স্কিমা (২৩টি টেবিল ও ইনডেক্স) |
| `migrations/0002_d1_seed.sql` | প্রাথমিক ডেটাবেস সিড স্ক্রিপ্ট (বরিশাল বিভাগীয় হাসপাতাল, রক্তদাতা ও এডমিন একাউন্ট) |
| `functions/api/[[route]].ts` | Cloudflare Pages Functions এজ হ্যান্ডলার যা সরাসরি Cloudflare D1 `env.DB` কুয়েরি করে |
| `public/_routes.json` | Cloudflare Pages এজ রাউটিং রুল (স্ট্যাটিক অ্যাসেট সরাসরি CDN থেকে এবং `/api/*` এজ ফাংশনে) |
| `public/_headers` | সিকিউরিটি হেডার, CORS পলিসি এবং এজ ক্যাশিং রুল |

---

## ⚡ GitHub CI/CD অটোমেশন (Cloudflare Pages Dashboard)
আপনি যদি GitHub রিপোজিটরি ক্লাউডফ্লেয়ার ড্যাশবোর্ডে কানেক্ট করতে চান:
1. **Cloudflare Dashboard** > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git** সিলেক্ট করুন।
2. বিল্ড সেটিংস:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. **Settings** > **Functions** > **D1 database bindings**:
   - Variable name: `DB`
   - D1 Database: `barishal-rokto-d1` সিলেক্ট করুন।
4. **Settings** > **Functions** > **R2 bucket bindings**:
   - Variable name: `R2_BUCKET`
   - R2 Bucket: `barishal-rokto-media` সিলেক্ট করুন।
5. Save and Deploy!

---

## 🔍 লোকাল টেস্টিং (Local Testing with Wrangler)
```bash
# লোকাল D1 ডেটাবেসে মাইগ্রেশন টেস্ট:
npm run d1:migrate:local

# Wrangler Pages লোকাল এমুলেশন:
npm run cf:preview
```

---

## 🛡️ ডিফল্ট এডমিন এক্সেস (Default Admin Credentials)
- **Super Admin Username**: `superadmin`
- **Phone**: `01700000000`
- **Password**: `admin1234`
