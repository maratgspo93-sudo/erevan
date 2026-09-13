/**
 * scraperTemplate.js
 * ------------------------------------------------------------------
 * Generic template for pulling rental listings from a source site
 * into the ListingStore / Supabase `listings` table.
 *
 * BEFORE USING THIS AGAINST A REAL SITE:
 *  1. Read that site's robots.txt and Terms of Service. Many
 *     real-estate sites explicitly disallow automated scraping —
 *     check first, and prefer an official API/partner feed if one
 *     exists (list.am, for example, offers no public API at the
 *     time of writing, so confirm current policy yourself).
 *  2. Respect robots.txt disallow rules and crawl-delay.
 *  3. Rate-limit requests (a delay between calls, low concurrency).
 *  4. Identify your bot with a descriptive User-Agent + contact info.
 *  5. Only store what you need, and always link back to the
 *     original listing (which this whole product already does).
 *
 * The CSS selectors below are placeholders — real estate sites
 * change their markup often, so inspect the current live HTML and
 * update selectors accordingly before running this for real.
 * ------------------------------------------------------------------
 */
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { ListingStore } from "../models/listingStore.js";

const USER_AGENT = "YourAppName-Bot/1.0 (+mailto:you@example.com)";

export async function scrapeSource({ sourceName, searchUrl, selectors }) {
  const res = await fetch(searchUrl, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

  const html = await res.text();
  const $ = cheerio.load(html);
  const found = [];

  $(selectors.card).each((_, el) => {
    const title = $(el).find(selectors.title).text().trim();
    const priceText = $(el).find(selectors.price).text().replace(/[^\d]/g, "");
    const link = $(el).find(selectors.link).attr("href");
    const img = $(el).find(selectors.img).attr("src");

    if (!title || !priceText || !link) return;

    found.push(
      ListingStore.create({
        title,
        district: selectors.defaultDistrict || "Կենտրոն",
        rooms: 1,
        area: 0,
        floor: "—",
        priceAmd: Number(priceText),
        img,
        sourceName,
        sourceUrl: link.startsWith("http") ? link : new URL(link, searchUrl).toString(),
      })
    );
  });

  return found;
}

// Example call (selectors are illustrative placeholders only):
// await scrapeSource({
//   sourceName: "List.am",
//   searchUrl: "https://www.list.am/en/category/56",
//   selectors: {
//     card: ".gallery-item",
//     title: ".gi-title",
//     price: ".price",
//     link: "a",
//     img: "img",
//   },
// });
