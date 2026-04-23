import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "node:path";
import fs from "node:fs";

declare global {
  var __sharea3_db__: Database.Database | undefined;
}

const DB_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
const DB_PATH = path.join(DB_DIR, "app.db");

function createDb() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  initSchema(db);
  seedIfEmpty(db);
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name_ar TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#e63946',
      icon TEXT NOT NULL DEFAULT '📰',
      description TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin','editor')) DEFAULT 'editor',
      avatar TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      content TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      category_id INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('published','draft','pending')) DEFAULT 'draft',
      is_breaking INTEGER NOT NULL DEFAULT 0,
      is_featured INTEGER NOT NULL DEFAULT 0,
      cover_image TEXT,
      image_caption TEXT,
      tags TEXT NOT NULL DEFAULT '',
      author_id INTEGER NOT NULL,
      views INTEGER NOT NULL DEFAULT 0,
      meta_description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      published_at TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (author_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
    CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
    CREATE INDEX IF NOT EXISTS idx_articles_is_breaking ON articles(is_breaking);
    CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured);

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      url TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'image',
      uploaded_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function seedIfEmpty(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) AS c FROM categories").get() as {
    c: number;
  };
  if (count.c > 0) return;

  const categories = [
    { slug: "politics", name_ar: "سياسة", color: "#e63946", icon: "🏛️", description: "آخر الأخبار والتطورات السياسية محلياً وعالمياً" },
    { slug: "economy", name_ar: "اقتصاد", color: "#22c55e", icon: "💰", description: "الأسواق، النفط، العملات، وأخبار الاقتصاد العراقي" },
    { slug: "local", name_ar: "محلية", color: "#3b82f6", icon: "🇮🇶", description: "أخبار المحافظات العراقية" },
    { slug: "world", name_ar: "دولية", color: "#a855f7", icon: "🌍", description: "أخبار العالم، الشرق الأوسط، وآخر المستجدات الدولية" },
    { slug: "sports", name_ar: "رياضة", color: "#f59e0b", icon: "⚽", description: "أسود الرافدين، الدوري، والرياضة العراقية والعالمية" },
    { slug: "culture", name_ar: "ثقافة", color: "#c9a84c", icon: "🎭", description: "ثقافة وفن وأدب" },
    { slug: "tech", name_ar: "تكنولوجيا", color: "#06b6d4", icon: "💻", description: "آخر أخبار التكنولوجيا" },
    { slug: "misc", name_ar: "منوعات", color: "#ec4899", icon: "✨", description: "أخبار منوعة" },
  ];

  const insertCat = db.prepare(
    "INSERT INTO categories (slug, name_ar, color, icon, description) VALUES (?, ?, ?, ?, ?)"
  );
  for (const c of categories) insertCat.run(c.slug, c.name_ar, c.color, c.icon, c.description);

  // Seed users — passwords hashed synchronously
  const adminHash = bcrypt.hashSync("admin1234", 10);
  const editorHash = bcrypt.hashSync("editor1234", 10);

  const insertUser = db.prepare(
    "INSERT INTO users (name, email, password_hash, role, avatar) VALUES (?, ?, ?, ?, ?)"
  );
  const adminId = Number(
    insertUser.run("المحرر المسؤول", "admin@share3.iq", adminHash, "admin", null).lastInsertRowid
  );
  const editorId = Number(
    insertUser.run("مراسل شارع الداخل", "editor@share3.iq", editorHash, "editor", null).lastInsertRowid
  );

  // Seed articles
  const placeholderImg = (seed: string) =>
    `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/630`;

  type Seed = {
    slug: string;
    title: string;
    subtitle?: string;
    content: string;
    excerpt: string;
    category: string;
    breaking?: boolean;
    featured?: boolean;
    tags: string[];
    hoursAgo: number;
    views: number;
    author: number;
  };

  const now = Date.now();
  const iso = (h: number) => new Date(now - h * 3600 * 1000).toISOString().replace("T", " ").slice(0, 19);

  const seeds: Seed[] = [
    {
      slug: "iraq-budget-2026-approved",
      title: "مجلس النواب يصادق على الموازنة الاتحادية لعام 2026 بأغلبية واسعة",
      subtitle: "الموازنة الجديدة ترصد مخصصات قياسية لقطاعات الكهرباء والصحة والإعمار",
      excerpt: "صوّت مجلس النواب العراقي خلال جلسته اليوم على قانون الموازنة الاتحادية لعام 2026 بأغلبية 225 نائباً من أصل 329، مع تخصيصات قياسية لمشاريع الإعمار.",
      content: `
<p>بغداد - شارع الداخل</p>
<p>صادق مجلس النواب العراقي اليوم الأربعاء على قانون الموازنة الاتحادية لعام 2026، وسط حضور رسمي موسع وترقب شعبي واسع لتفاصيل التخصيصات التي ستشمل مختلف القطاعات الحيوية في البلاد.</p>
<h2>أبرز تفاصيل الموازنة</h2>
<p>أوضح رئيس اللجنة المالية النيابية أن مجموع الإنفاق الكلي في الموازنة الجديدة بلغ 213 تريليون دينار عراقي، فيما قدرت الإيرادات بنحو 155 تريليون دينار، مع عجز مخطط له بقيمة 58 تريليون دينار.</p>
<p>وأكد رئيس المجلس في كلمته الافتتاحية أن الموازنة تمثل خارطة طريق اقتصادية شاملة تعكس حرص الحكومة على تحسين الخدمات وتوفير فرص العمل.</p>
<h2>مخصصات الكهرباء والإعمار</h2>
<p>حصل قطاع الكهرباء على تخصيصات بقيمة 14 تريليون دينار، تشمل إنشاء محطات جديدة وتأهيل الشبكة القديمة في المحافظات الجنوبية والوسطى.</p>
<blockquote>الموازنة الجديدة ستكون نقطة انطلاق لمشاريع استراتيجية طال انتظارها من قبل المواطن العراقي.</blockquote>
<p>كما خصصت 9 تريليونات دينار لصندوق إعمار المحافظات المحررة، فيما حصل قطاع الصحة على 11 تريليون دينار لبناء مستشفيات جديدة واستقدام كوادر طبية.</p>
<h3>ردود الفعل السياسية</h3>
<p>رحّبت الكتل السياسية المختلفة بالمصادقة، واعتبرتها خطوة مهمة نحو الاستقرار المالي، بينما طالب عدد من النواب بضرورة وضع آليات رقابة صارمة لضمان وصول التخصيصات إلى مستحقيها.</p>
      `.trim(),
      category: "politics",
      breaking: true,
      featured: true,
      tags: ["العراق", "الموازنة", "مجلس النواب", "اقتصاد"],
      hoursAgo: 1,
      views: 14320,
      author: adminId,
    },
    {
      slug: "oil-prices-surge",
      title: "أسعار النفط تقفز 3% بعد اتفاق أوبك+ على تمديد خفض الإنتاج",
      subtitle: "برنت يتجاوز 92 دولاراً والخام الأمريكي يصعد إلى 88 دولاراً",
      excerpt: "سجّلت أسعار النفط العالمية قفزة ملحوظة عقب إعلان تحالف أوبك+ تمديد اتفاقية خفض الإنتاج حتى نهاية الربع الثاني من العام القادم.",
      content: `
<p>فيينا - شارع الداخل</p>
<p>قفزت أسعار النفط في التداولات العالمية بأكثر من 3% خلال جلسة اليوم، بعد إعلان تحالف أوبك+ عن تمديد اتفاقية خفض الإنتاج الطوعي بمقدار 2.2 مليون برميل يومياً حتى نهاية يونيو/حزيران 2026.</p>
<h2>تفاصيل الاتفاق</h2>
<p>وصل سعر خام برنت إلى 92.40 دولاراً للبرميل، في حين ارتفع خام غرب تكساس الوسيط إلى 88.15 دولاراً، مسجلاً أعلى مستوى في خمسة أشهر.</p>
<p>ويأتي القرار وسط مخاوف من تباطؤ الطلب العالمي وارتفاع المخزونات الأمريكية، وقد وصفه المحللون بأنه "رسالة وحدة داخل التحالف" رغم التوترات الأخيرة حول الحصص.</p>
<h3>تأثير مباشر على العراق</h3>
<p>يُتوقع أن يسهم ارتفاع الأسعار في تعزيز الإيرادات النفطية العراقية، التي تمثل أكثر من 90% من الإيرادات العامة للدولة.</p>
      `.trim(),
      category: "economy",
      featured: true,
      tags: ["النفط", "أوبك", "الاقتصاد"],
      hoursAgo: 2,
      views: 9820,
      author: editorId,
    },
    {
      slug: "lions-win-gulf-cup",
      title: "أسود الرافدين يتوّجون بكأس الخليج بعد فوز مثير على المنتخب السعودي",
      subtitle: "هدف قاتل في الدقيقة 89 يمنح العراق اللقب الخامس في تاريخه",
      excerpt: "حقق المنتخب العراقي لكرة القدم إنجازاً تاريخياً بتتويجه بكأس الخليج للمرة الخامسة، بعد فوزه على نظيره السعودي بهدفين لهدف.",
      content: `
<p>الرياض - شارع الداخل</p>
<p>عاش الشارع العراقي ليلة استثنائية من الفرح بعد تتويج أسود الرافدين بكأس الخليج للمرة الخامسة في تاريخهم، في مباراة نهائية مثيرة جمعتهم بالمنتخب السعودي على ملعب الملك فهد الدولي.</p>
<h2>أحداث المباراة</h2>
<p>افتتح العراق التسجيل في الدقيقة 32 عبر المهاجم أيمن حسين، قبل أن يدرك السعودي التعادل في الدقيقة 67، ليأتي هدف الحسم في الدقيقة 89 عبر البديل زيدان إقبال الذي خطف قلوب الجماهير.</p>
<h3>احتفالات شعبية</h3>
<p>خرج الآلاف من العراقيين إلى شوارع بغداد والبصرة وأربيل والموصل للاحتفال باللقب، وسط إطلاق أعيرة نارية ورفع للأعلام العراقية.</p>
<blockquote>هذا اللقب مُهدى إلى كل عراقي صابر وجندي شريف ومواطن يحلم ببلد أفضل.</blockquote>
      `.trim(),
      category: "sports",
      breaking: true,
      tags: ["رياضة", "العراق", "كأس الخليج"],
      hoursAgo: 3,
      views: 31520,
      author: editorId,
    },
    {
      slug: "basra-smart-city-launch",
      title: "البصرة تطلق أولى مراحل مشروع المدينة الذكية بتعاون دولي",
      excerpt: "خطوة تاريخية لمدينة الفيحاء نحو التحوّل الرقمي الشامل على مدى 5 سنوات.",
      content: `
<p>البصرة - شارع الداخل</p>
<p>أعلنت محافظة البصرة عن انطلاق المرحلة الأولى من مشروع "البصرة الذكية"، الذي يهدف إلى تحويل المدينة إلى نموذج إقليمي في الخدمات الرقمية خلال خمس سنوات.</p>
<p>ويشمل المشروع تركيب أكثر من 4000 كاميرا ذكية للمراقبة المرورية، وبناء مركز قيادة وتحكم مركزي، وربط الدوائر الحكومية بمنصة خدمات إلكترونية موحدة.</p>
      `.trim(),
      category: "local",
      featured: true,
      tags: ["البصرة", "تكنولوجيا", "محلية"],
      hoursAgo: 5,
      views: 4120,
      author: adminId,
    },
    {
      slug: "mosul-heritage-reconstruction",
      title: "الانتهاء من ترميم جامع النوري ومئذنة الحدباء في الموصل",
      excerpt: "تدشين رسمي لإعادة افتتاح أحد أهم رموز المدينة القديمة بعد سنوات من العمل الدقيق.",
      content: `<p>شهدت مدينة الموصل اليوم مراسم تدشين رسمية لإعادة افتتاح جامع النوري الكبير ومئذنته الحدباء، بعد انتهاء أعمال الترميم التي استغرقت أربع سنوات من العمل الدقيق بإشراف منظمة اليونسكو.</p>`,
      category: "culture",
      tags: ["الموصل", "تراث", "ثقافة"],
      hoursAgo: 6,
      views: 2780,
      author: editorId,
    },
    {
      slug: "iraq-digital-id-launch",
      title: "إطلاق تطبيق الهوية الرقمية للعراقيين رسمياً",
      excerpt: "تطبيق جديد يتيح الوصول إلى أكثر من 40 خدمة حكومية من الهاتف.",
      content: `<p>أطلقت الحكومة العراقية اليوم تطبيق "هويتي" الرقمي على متجري تطبيقات آبل وغوغل، متضمناً أكثر من 40 خدمة حكومية يمكن الوصول إليها مباشرة من الهاتف المحمول.</p>`,
      category: "tech",
      breaking: true,
      tags: ["تكنولوجيا", "حكومة"],
      hoursAgo: 7,
      views: 6200,
      author: adminId,
    },
    {
      slug: "tigris-water-crisis",
      title: "منسوب نهر دجلة يواصل الانخفاض وتحذيرات من موجة جفاف",
      excerpt: "وزارة الموارد المائية تدعو إلى ترشيد استهلاك المياه.",
      content: `<p>حذّرت وزارة الموارد المائية العراقية من استمرار انخفاض منسوب نهر دجلة، داعيةً إلى ضرورة ترشيد استهلاك المياه في ظل شح الإطلاقات القادمة من دول المنبع.</p>`,
      category: "local",
      tags: ["البيئة", "المياه", "العراق"],
      hoursAgo: 9,
      views: 3210,
      author: editorId,
    },
    {
      slug: "un-iraq-cooperation",
      title: "الأمم المتحدة تشيد بجهود العراق في مكافحة الإتجار بالبشر",
      excerpt: "تقرير أممي جديد يرصد تقدماً ملحوظاً في ملف حقوق الإنسان.",
      content: `<p>أصدرت الأمم المتحدة تقريراً يشيد بالجهود العراقية في مكافحة الإتجار بالبشر خلال العام الماضي، مشيرةً إلى تقدم ملموس في تطبيق القوانين.</p>`,
      category: "world",
      tags: ["الأمم المتحدة", "العراق", "حقوق الإنسان"],
      hoursAgo: 11,
      views: 1840,
      author: adminId,
    },
    {
      slug: "baghdad-book-fair",
      title: "معرض بغداد الدولي للكتاب يستقبل أكثر من مليون زائر",
      excerpt: "أرقام قياسية في نسخة هذا العام بمشاركة 450 دار نشر.",
      content: `<p>أعلنت إدارة معرض بغداد الدولي للكتاب عن استقبال أكثر من مليون زائر خلال الأسبوع الأول من فعالياته، بمشاركة 450 دار نشر من 22 دولة.</p>`,
      category: "culture",
      tags: ["ثقافة", "بغداد", "معرض الكتاب"],
      hoursAgo: 14,
      views: 2120,
      author: editorId,
    },
    {
      slug: "lions-training-camp",
      title: "بيتروفيتش يعلن قائمة أسود الرافدين لمعسكر الدوحة",
      excerpt: "استدعاء 26 لاعباً للمعسكر التحضيري المقبل.",
      content: `<p>أعلن المدرب البوسني رادوفان بيتروفيتش، مدرب المنتخب العراقي، قائمة الأسود لمعسكر الدوحة التحضيري المقبل، والتي تضم 26 لاعباً.</p>`,
      category: "sports",
      tags: ["رياضة", "المنتخب العراقي"],
      hoursAgo: 18,
      views: 5410,
      author: editorId,
    },
    {
      slug: "dinar-stable-exchange",
      title: "البنك المركزي يؤكد استقرار سعر صرف الدينار أمام الدولار",
      excerpt: "احتياطيات قياسية من العملة الصعبة تتجاوز 115 مليار دولار.",
      content: `<p>أكد البنك المركزي العراقي استقرار سعر صرف الدينار العراقي أمام الدولار، مشيراً إلى بلوغ الاحتياطيات مستوى قياسياً تجاوز 115 مليار دولار.</p>`,
      category: "economy",
      tags: ["الاقتصاد", "الدينار", "البنك المركزي"],
      hoursAgo: 22,
      views: 4620,
      author: adminId,
    },
    {
      slug: "iraq-iran-summit",
      title: "قمة عراقية إيرانية في بغداد لبحث ملفات الطاقة والتجارة",
      excerpt: "اجتماعات مكثفة لتفعيل مذكرات التفاهم الموقعة سابقاً.",
      content: `<p>استقبلت بغداد وفداً إيرانياً رفيع المستوى في قمة ثنائية بحثت ملفات الطاقة والتجارة والنقل، على أن تصدر بياناً ختامياً مشتركاً.</p>`,
      category: "politics",
      tags: ["سياسة", "العراق", "إيران"],
      hoursAgo: 26,
      views: 7830,
      author: adminId,
    },
  ];

  const insertArt = db.prepare(`
    INSERT INTO articles (
      slug, title, subtitle, content, excerpt, category_id, status, is_breaking,
      is_featured, cover_image, image_caption, tags, author_id, views,
      meta_description, created_at, updated_at, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const s of seeds) {
    const catRow = db
      .prepare("SELECT id FROM categories WHERE slug = ?")
      .get(s.category) as { id: number } | undefined;
    if (!catRow) continue;
    const ts = iso(s.hoursAgo);
    insertArt.run(
      s.slug,
      s.title,
      s.subtitle ?? null,
      s.content,
      s.excerpt,
      catRow.id,
      s.breaking ? 1 : 0,
      s.featured ? 1 : 0,
      placeholderImg(s.slug),
      s.title,
      s.tags.join(","),
      s.author,
      s.views,
      s.excerpt.slice(0, 160),
      ts,
      ts,
      ts
    );
  }
}

export function getDb(): Database.Database {
  if (!global.__sharea3_db__) {
    global.__sharea3_db__ = createDb();
  }
  return global.__sharea3_db__;
}
