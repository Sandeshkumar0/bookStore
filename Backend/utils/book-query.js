import { escapeRegex } from "./validation.js";

const sortOptions = {
  newest: { createdAt: -1 },
  name: { name: 1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
};

const numberInRange = (value, fallback, min, max) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
};

export const buildBookQuery = (query = {}) => {
  const filter = {};
  const search = typeof query.search === "string" ? query.search.trim().slice(0, 100) : "";
  const category =
    typeof query.category === "string" ? query.category.trim().slice(0, 50) : "";

  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: pattern }, { title: pattern }];
  }
  if (category && category.toLowerCase() !== "all") {
    filter.category = new RegExp(`^${escapeRegex(category)}$`, "i");
  }

  const minPrice = Number(query.minPrice);
  const maxPrice = Number(query.maxPrice);
  if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
    filter.price = {};
    if (Number.isFinite(minPrice) && minPrice >= 0) filter.price.$gte = minPrice;
    if (Number.isFinite(maxPrice) && maxPrice >= 0) filter.price.$lte = maxPrice;
    if (Object.keys(filter.price).length === 0) delete filter.price;
  }

  const page = numberInRange(query.page, 1, 1, 100000);
  const limit = numberInRange(query.limit, 12, 1, 50);
  const sortKey = typeof query.sort === "string" ? query.sort : "newest";

  return {
    filter,
    page,
    limit,
    sort: sortOptions[sortKey] || sortOptions.newest,
    sortKey: sortOptions[sortKey] ? sortKey : "newest",
  };
};
