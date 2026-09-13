# Yerevan Rentals — Full-Stack Aggregator

Հարթակ Երևանում վարձով բնակարանների հայտարարությունների ագրեգացման և որոնման համար։

## Ֆայլային կառուցվածք

```
yerevan-rentals/
├── frontend/
│   └── yerevan-rentals.jsx      # React frontend (artifact-ում արդեն աշխատող տարբերակ)
└── backend/
    ├── server.js                 # Express մուտքի կետ
    ├── package.json
    ├── .env.example
    ├── supabase_schema.sql       # Production Postgres/Supabase սխեմա
    ├── models/
    │   └── listingStore.js       # In-memory պահեստ (փոխարինվում է Supabase-ով)
    ├── routes/
    │   └── listings.js           # REST API endpoints
    └── scrapers/
        └── scraperTemplate.js    # Generic scraper template (compliance նշումներով)
```

## Backend-ի գործարկում լոկալ

```bash
cd backend
npm install
cp .env.example .env
npm run dev
# API-ն կաշխատի http://localhost:4000 հասցեով
```

### Endpoints

| Method | Route                | Նկարագրություն                                  |
|--------|-----------------------|--------------------------------------------------|
| GET    | `/api/listings`       | Ցուցակ՝ `?district=&rooms=&minPrice=&maxPrice=&minArea=&q=` query-պարամետրերով |
| POST   | `/api/listings`       | Նոր հայտարարության ավելացում (title, district, priceAmd, sourceUrl պարտադիր) |
| DELETE | `/api/listings/:id`   | Հայտարարության հեռացում                          |

## Frontend-ի միացում իրական API-ին

Artifact-ի `yerevan-rentals.jsx` ֆայլում mock տվյալները (`seedListings`) փոխարինիր fetch-ով.

```js
useEffect(() => {
  fetch(`${API_URL}/api/listings?` + new URLSearchParams({ district, rooms, minPrice, maxPrice, minArea, q: query }))
    .then(r => r.json())
    .then(data => setListings(data.results));
}, [district, rooms, minPrice, maxPrice, minArea, query]);
```

## Production տվյալների բազա (Supabase)

1. Ստեղծիր անվճար Supabase պրոեկտ → SQL Editor-ում գործարկիր `supabase_schema.sql`։
2. `.env`-ում լրացրու `SUPABASE_URL` և `SUPABASE_ANON_KEY`։
3. `listingStore.js`-ը փոխարինիր Supabase client-ի կանչերով (`@supabase/supabase-js`)։

## Իրական հայտարարությունների հավաքագրում (scraping)

`scrapers/scraperTemplate.js`-ը generic template է։ Մինչ կիրառելը իրական կայքերի դեմ.
- ստուգիր տվյալ կայքի **robots.txt** և **Terms of Service**-ը,
- նախապատվություն տուր պաշտոնական API-ին, եթե առկա է,
- ավելացրու request-throttling և հստակ User-Agent,
- պահպանիր միայն անհրաժեշտ դաշտերը և միշտ հղում տուր բնօրինակին։

Առաջարկվող cron-ագործիք՝ գործարկել scraper-ը ամեն 1-2 ժամը մեկ (օր.՝ `node-cron` կամ Vercel Cron Jobs-ով)։

## Deployment առաջարկներ

- **Frontend**: Vercel / Netlify (Next.js կամ Vite + React build)
- **Backend**: Render / Railway / Fly.io
- **DB**: Supabase (Postgres) — անվճար tier-ը բավարար է մեկնարկի համար
- **Auth (ապագայում)**: Supabase Auth կամ Clerk՝ favorites-ի և saved-search-ի համար

## Հաջորդ քայլեր ընդլայնման համար

- Օգտատերերի գրանցում/մուտք (Supabase Auth)
- Saved search + email/push ծանուցումներ նոր հայտարարությունների մասին
- Քարտեզի ինտեգրում (Leaflet/Mapbox + geocoding ըստ հասցեի)
- Admin dashboard՝ աղբյուրների և ապաակտիվ հայտարարությունների կառավարման համար
