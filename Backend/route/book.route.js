import express from "express";

import { getBookById, getBooks } from "../controller/book.controller.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);

export default router;
