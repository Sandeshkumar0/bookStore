import Book from "../model/book.model.js";
import { buildBookQuery } from "../utils/book-query.js";

export const getBooks = async (req, res, next) => {
  try {
    const { filter, page, limit, sort, sortKey } = buildBookQuery(req.query);
    const [books, total, categories] = await Promise.all([
      Book.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Book.countDocuments(filter),
      Book.distinct("category"),
    ]);

    res.status(200).json({
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
      filters: { categories: categories.sort(), sort: sortKey },
    });
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json({ book });
  } catch (error) {
    next(error);
  }
};
