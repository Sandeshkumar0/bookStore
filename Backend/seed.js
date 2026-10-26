import mongoose from "mongoose";

import { config } from "./config.js";
import Book from "./model/book.model.js";

const books = [
  { name: "Atomic Habits", price: 14.99, category: "Self Growth", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80", title: "A practical guide to building good habits and breaking bad ones." },
  { name: "The Creative Act", price: 18.5, category: "Creativity", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80", title: "A generous invitation to make creativity part of everyday life." },
  { name: "Deep Work", price: 16.0, category: "Productivity", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80", title: "Rules for focused success in an increasingly distracted world." },
  { name: "The Little Prince", price: 0, category: "Free", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=900&q=80", title: "A timeless tale about curiosity, friendship, and what truly matters." },
  { name: "A Room of One’s Own", price: 0, category: "Free", image: "https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=900&q=80", title: "Virginia Woolf’s landmark reflection on women, writing, and independence." },
  { name: "The Art of War", price: 0, category: "Free", image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=900&q=80", title: "Ancient lessons on strategy, preparation, and clear thinking." },
  { name: "Sapiens", price: 20.0, category: "History", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80", title: "A sweeping account of how humankind came to shape the world." },
  { name: "Clean Code", price: 29.99, category: "Technology", image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=900&q=80", title: "Principles and practices for writing software that is easier to change." },
];

const seed = async () => {
  if (!config.mongoUri) throw new Error("MONGODB_URI is required");
  await mongoose.connect(config.mongoUri);
  for (const book of books) {
    await Book.updateOne({ name: book.name }, { $setOnInsert: book }, { upsert: true });
  }
  console.log(`Seed complete: ${books.length} sample books are available`);
  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
