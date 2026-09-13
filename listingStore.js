// Simple in-memory store, ready to be swapped for a real database
// (Supabase/Postgres, MongoDB, etc — see supabase_schema.sql for a
// production-ready Postgres schema and README.md for how to wire it up).

let listings = [
  {
    id: 1,
    title: "2 սենյականոց բնակարան Կենտրոնում, Աբովյան փողոց",
    district: "Կենտրոն",
    rooms: 2,
    area: 68,
    floor: "3/9",
    priceAmd: 320000,
    img: "https://picsum.photos/seed/yer1/640/440",
    sourceName: "List.am",
    sourceUrl: "https://www.list.am/en/category/56",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "1 սենյականոց նորակառույց, Արաբկիր, Կոմիտասի պողոտա",
    district: "Արաբկիր",
    rooms: 1,
    area: 45,
    floor: "5/12",
    priceAmd: 210000,
    img: "https://picsum.photos/seed/yer2/640/440",
    sourceName: "MyRealty.am",
    sourceUrl: "https://www.myrealty.am/en/rent-apartments",
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

export const ListingStore = {
  all() {
    return listings;
  },
  find(filters = {}) {
    return listings.filter((l) => {
      if (filters.district && filters.district !== "Բոլորը" && l.district !== filters.district) return false;
      if (filters.rooms) {
        const r = Number(filters.rooms);
        if (filters.rooms === "4+" ? l.rooms < 4 : l.rooms !== r) return false;
      }
      if (filters.minPrice && l.priceAmd < Number(filters.minPrice)) return false;
      if (filters.maxPrice && l.priceAmd > Number(filters.maxPrice)) return false;
      if (filters.minArea && l.area < Number(filters.minArea)) return false;
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (!l.title.toLowerCase().includes(q) && !l.district.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  },
  create(data) {
    const listing = {
      id: nextId++,
      title: data.title,
      district: data.district,
      rooms: Number(data.rooms) || 1,
      area: Number(data.area) || 0,
      floor: data.floor || "—",
      priceAmd: Number(data.priceAmd) || 0,
      img: data.img || `https://picsum.photos/seed/yer${nextId}/640/440`,
      sourceName: data.sourceName || "Օգտատիրոջ ավելացրած",
      sourceUrl: data.sourceUrl,
      createdAt: new Date().toISOString(),
    };
    listings.unshift(listing);
    return listing;
  },
  remove(id) {
    const before = listings.length;
    listings = listings.filter((l) => l.id !== Number(id));
    return listings.length < before;
  },
};
