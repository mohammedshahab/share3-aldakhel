# شارع الداخل — Share3 al-Dakhel

وكالة أخبار عراقية احترافية. موقع كامل بالعربية (RTL) مع لوحة تحكم لإدارة ونشر الأخبار.

## المميزات

### الموقع العام
- صفحة رئيسية كاملة: شريط العاجل المتحرك، هيدر ثابت، قسم الخبر الرئيسي (Hero)، شبكة الأخبار، قسم "الأكثر قراءة"، قسم أخبار بالفيديو، فوتر مع روابط التواصل الاجتماعي
- صفحة الخبر الكاملة مع شريط تقدم، قائمة الأخبار ذات الصلة، أزرار المشاركة، شريط جانبي
- صفحة التصنيف مع ترقيم الصفحات والفرز
- صفحة البحث
- دعم RTL كامل، خطوط Cairo و Tajawal من Google Fonts
- الوقت النسبي بالعربية (منذ 3 ساعات، قبل يومين...)
- تصميم متجاوب كامل (موبايل، تابلت، ديسكتوب)

### لوحة التحكم
- مصادقة JWT كاملة (تسجيل دخول/إنشاء حساب/خروج) مع كلمات مرور مُعمّاة (bcrypt)
- لوحة إحصائيات مع رسم بياني (SVG خفيف) لآخر 30 يوم
- محرر نصوص غني (TipTap) مع شريط أدوات: **B** *I* H2 H3 قوائم اقتباسات روابط صور Undo/Redo
- صفحة نشر خبر متكاملة: تحميل صورة (Drag & Drop)، وسوم، معاينة SEO، حفظ تلقائي كل 60 ثانية، عداد كلمات
- إدارة الأخبار: بحث/فلترة/تحديد جماعي/حذف
- إدارة المحررين (Admin فقط): تبديل الدور، تعليق الحساب
- صلاحيات: المشرف يستطيع حذف أي خبر، المحرر يحذف أخباره فقط

## التشغيل محلياً

```bash
# تثبيت الحزم
npm install

# وضع التطوير
npm run dev
# → http://localhost:3000

# الإنتاج
npm run build && npm start
```

عند أول تشغيل، يتم إنشاء قاعدة بيانات SQLite تلقائياً في `./data/app.db` مع بيانات تجريبية.

### حسابات تجريبية

| البريد | كلمة المرور | الدور |
|-------|------------|-------|
| `admin@share3.iq` | `admin1234` | مشرف (Admin) |
| `editor@share3.iq` | `editor1234` | محرر (Editor) |

## Stack التقني

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4 (مع دعم RTL ومتغيرات CSS للألوان)
- **الخطوط:** Cairo, Tajawal (Google Fonts via `next/font`)
- **قاعدة البيانات:** SQLite (better-sqlite3)
- **المصادقة:** JWT (jose) + bcryptjs
- **المحرر:** TipTap
- **الأيقونات:** Lucide React

## البنية

```
src/
  app/
    (public)/             # الموقع العام (homepage, article, category, search)
    (auth)/               # login, register
    (dashboard)/
      dashboard/          # dashboard home + articles + users + settings
    api/                  # REST API routes
      articles/
      auth/
      categories/
      stats/
      upload/
      users/
  components/
    Logo, Header, Footer, Hero, NewsCard, ...
    dashboard/
      Sidebar, Topbar, ArticleEditor, ArticleForm, ArticlesTable, ...
  lib/
    db.ts                 # SQLite setup + seeding
    auth.ts               # JWT + bcrypt
    articles.ts           # queries
    users.ts              # queries
    utils.ts              # relative time (ar), formatters
    types.ts
```

## الهوية البصرية

| الاسم | القيمة | الاستخدام |
|-----|-------|----------|
| `--color-black` | `#1A1A1A` | الخلفيات الرئيسية |
| `--color-red` | `#E63946` | العاجل والأزرار والإشعارات |
| `--color-gray` | `#4A4A4A` | النصوص الثانوية |
| `--color-gold` | `#C9A84C` | اللمسة العراقية المميزة |
| `--color-white` | `#F5F5F5` | النصوص على الخلفية الداكنة |

## ملاحظات

- يتم تجاهل قاعدة البيانات `data/` ومجلد الرفع `public/uploads/` في git (يتم إنشاؤهما تلقائياً).
- للإنتاج: غيّر `AUTH_SECRET` عبر متغير البيئة، وانقل التخزين إلى PostgreSQL + S3.
