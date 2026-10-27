import type { Book } from "../types";

export const featuredBook: Book = {
  _id: "featured-cartographer-lost-hours",
  name: "The Cartographer of Lost Hours",
  title: "Mira Vale · Literary fantasy",
  image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80",
  price: 24,
  category: "Fiction",
};

export const storyChapters = [
  {
    index: "I",
    eyebrow: "The Ember Archive · After closing",
    title: ["Every book is", "a doorway."],
    body: "Tonight, one volume has been left beneath the reading lamp. Move closer; the archive is about to reveal why.",
    note: "Scroll to approach",
    align: "left",
  },
  {
    index: "II",
    eyebrow: "Featured acquisition · Shelf 07",
    title: ["The Cartographer", "of Lost Hours"],
    body: "Mira Vale maps a city where forgotten moments become physical places—and where one missing afternoon can alter an entire life.",
    note: "Literary fantasy · 4.8 reader rating · $24 hardcover",
    align: "right",
  },
  {
    index: "III",
    eyebrow: "The cover yields",
    title: ["Enter between", "cloth and paper."],
    body: "The spine relaxes. Amber light catches the deckled edges as the first leaf turns beneath your hand.",
    note: "Scroll controls the hinge and page tension",
    align: "left",
  },
  {
    index: "IV",
    eyebrow: "Leaf 47 · Author’s note",
    title: ["“Time leaves a mark", "on every place.”"],
    body: "Vale began with an ordinary question: where do our unnoticed hours go? Her answer is a tender atlas of memory, grief, and second chances.",
    note: "Winner · Northlight Fiction Prize",
    align: "right",
  },
  {
    index: "V",
    eyebrow: "Beyond the printed edge",
    title: ["The map becomes", "the territory."],
    body: "A cut-paper arch opens onto the book’s vanished quarter: quiet roofs, long shadows, and a single illuminated path through the fog.",
    note: "An atmospheric interpretation of the story world",
    align: "left",
  },
] as const;

export const purchaseFormats = [
  { label: "Hardcover", price: 24 },
  { label: "Paperback", price: 16 },
  { label: "Digital", price: 9 },
] as const;
