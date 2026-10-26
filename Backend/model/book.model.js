import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, maxlength: 50 },
    image: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

bookSchema.index({ name: "text", title: "text" });
bookSchema.index({ category: 1, price: 1 });

const Book = mongoose.model("Book", bookSchema);

export default Book;
