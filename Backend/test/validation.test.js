import assert from "node:assert/strict";
import test from "node:test";

import { buildBookQuery } from "../utils/book-query.js";
import { normalizeEmail, validateAuthInput } from "../utils/validation.js";

test("normalizeEmail trims and lowercases addresses", () => {
  assert.equal(normalizeEmail("  Reader@Example.COM "), "reader@example.com");
});

test("signup validation rejects weak input", () => {
  const result = validateAuthInput(
    { fullname: "A", email: "not-an-email", password: "short" },
    true,
  );
  assert.deepEqual(Object.keys(result.errors).sort(), ["email", "fullname", "password"]);
});

test("book query clamps pagination and escapes search patterns", () => {
  const result = buildBookQuery({
    search: "node.*",
    page: "-4",
    limit: "900",
    sort: "price_asc",
  });

  assert.equal(result.page, 1);
  assert.equal(result.limit, 50);
  assert.deepEqual(result.sort, { price: 1 });
  assert.equal(result.filter.$or[0].name.source, "node\\.\\*");
});
