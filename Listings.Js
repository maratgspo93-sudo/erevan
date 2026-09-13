import { Router } from "express";
import { ListingStore } from "../models/listingStore.js";

const router = Router();

// GET /api/listings?district=&rooms=&minPrice=&maxPrice=&minArea=&q=
router.get("/", (req, res) => {
  const results = ListingStore.find(req.query);
  res.json({ count: results.length, results });
});

// POST /api/listings  { title, district, rooms, area, floor, priceAmd, sourceUrl, sourceName }
router.post("/", (req, res) => {
  const { title, district, priceAmd, sourceUrl } = req.body;
  if (!title || !district || !priceAmd || !sourceUrl) {
    return res.status(400).json({ error: "title, district, priceAmd և sourceUrl պարտադիր են" });
  }
  const listing = ListingStore.create(req.body);
  res.status(201).json(listing);
});

// DELETE /api/listings/:id
router.delete("/:id", (req, res) => {
  const ok = ListingStore.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: "Listing not found" });
  res.status(204).end();
});

export default router;
