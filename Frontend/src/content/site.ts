export const siteContent = {
  brand: "BookStore",
  navigation: [
    { label: "Index", to: "/courses" },
    { label: "Manifesto", to: "/#manifesto" },
    { label: "Free shelf", to: "/#free-shelf" },
  ],
  manifesto: [
    {
      number: "01",
      title: "Selection over saturation",
      body: "A smaller, sharper catalogue makes room for attention. Every title earns its position.",
    },
    {
      number: "02",
      title: "Context before commerce",
      body: "Books are presented as ideas with histories—not anonymous rectangles arranged by an algorithm.",
    },
    {
      number: "03",
      title: "A shelf that remembers",
      body: "Your reading list persists quietly, ready when you return without interrupting discovery.",
    },
  ],
} as const;
