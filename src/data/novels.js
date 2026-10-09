const baseUrl = import.meta.env.BASE_URL || '/'
const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`

export const novels = [
  {
    id: 1,
    name: "The Beauty of Earth",
    author: "John Doe",
    description: "A novel about the beauty of our planet.",
    category: "Fiction",
    image: `${cleanBase}Beauty-of-earth.jpg`,
    totalChapters: 5,
    totalPages: 25,
    year: 2024,
    tags: ["Nature", "Earth", "Inspirational"]
  },
  {
    id: 2,
    name: "The Wonders of Nature",
    author: "Jane Smith",
    category: "Science",
    description: "Discover the incredible wonders of nature.",
    image: `${cleanBase}Wonders-of-nature.jpg`,
    totalChapters: 5,
    totalPages: 25,
    year: 2024,
    tags: ["Wilderness", "Biology", "Discovery"]
  },
  {
    id: 3,
    name: "The Love of Humanity",
    author: "Bob Johnson",
    category: "Fiction",
    description: "A story about compassion and humanity.",
    image: `${cleanBase}The-love-of-humanity.jpg`,
    totalChapters: 5,
    totalPages: 25,
    year: 2024,
    tags: ["Empathy", "Society", "Hope"]
  },
  {
    id: 4,
    name: "The Power of Imagination",
    author: "Alice Brown",
    category: "Fiction",
    description: "A journey into the power of imagination.",
    image: `${cleanBase}The-power-of-imagination.jpg`,
    totalChapters: 5,
    totalPages: 25,
    year: 2024,
    tags: ["Creativity", "Dreams", "Mind"]
  },
  {
    id: 5,
    name: "The Joy of Storytelling",
    author: "Charlie Wilson",
    category: "Fiction",
    description: "A celebration of stories and the people who tell them.",
    image: `${cleanBase}The-joy-of-storytelling.jpg`,
    totalChapters: 5,
    totalPages: 25,
    year: 2025,
    tags: ["Literature", "Voice", "Craft"]
  },
  {
    id: 6,
    name: "The parables of Jesus",
    author: "John Doe",
    description: "A book about the parables of Jesus.",
    category: "Religion",
    image: `${cleanBase}The-parables-of-Jesus.jpg`,
    totalChapters: 5,
    totalPages: 25,
    year: 2025,
    tags: ["Faith", "Parables", "Wisdom"]
  },
  {
    id: 7,
    name: "The Philosophy of Life",
    author: "Jane Smith",
    category: "Philosophy",
    description: "A philosophical exploration of life and existence.",
    image: `${cleanBase}The-philosophy-of-life.jpg`,
    totalChapters: 5,
    totalPages: 25,
    year: 2026,
    tags: ["Meaning", "Ethics", "Truth"]
  },
  {
    id: 8,
    name: "The secret lovers",
    author: "Alice Brown",
    category: "Romance",
    description: "A story about hidden love and its consequences.",
    image: `${cleanBase}The-secret-lovers.jpg`,
    totalChapters: 5,
    totalPages: 25,
    year: 2026,
    tags: ["Passion", "Secrets", "Drama"]
  },
  {
    id: 9,
    name: "The Billionaire's Secret Wife",
    author: "Alice Brown",
    category: "Romance",
    description:
      "A struggling artist enters a marriage contract with a billionaire, but hidden secrets and unexpected feelings change everything.",
    image: `${cleanBase}The-billionaires-secret-wife.jpg`,
    totalChapters: 7,
    totalPages: 35,
    year: 2026,
    tags: ["Billionaire", "Marriage", "Secrets", "Love", "Drama"]
  },
  {
    id: 10,
    name: "The Girl He Never Forgot",
    author: "Alice Brown",
    category: "Romance",
    description:
      "Years after a painful goodbye, two childhood friends meet again and discover that their feelings never truly disappeared.",
    image: `${cleanBase}The-girl-he-never-forgot.jpg`,
    totalChapters: 6,
    totalPages: 24,
    year: 2026,
    tags: ["Second Chance", "Childhood Friends", "Love", "Secrets"]
  },
  {
    id: 11,
    name: "The CEO's Unexpected Bride",
    author: "Alice Brown",
    category: "Romance",
    description:
      "A marriage of convenience brings a hardworking designer and a powerful CEO together, but real feelings change their agreement.",
    image: `${cleanBase}The-ceos-unexpected-bride.jpg`,
    totalChapters: 8,
    totalPages: 32,
    year: 2026,
    tags: ["CEO", "Marriage of Convenience", "Love", "Independence"]
  },
  {
    id: 12,
    name: "The Billionaire Next Door",
    author: "Alice Brown",
    category: "Romance",
    description:
      "A hardworking baker clashes with her wealthy neighbor, but unexpected events bring them closer.",
    image: `${cleanBase}The-billionaire-next-door.jpg`,
    totalChapters: 8,
    totalPages: 32,
    year: 2026,
    tags: ["Billionaire", "Neighbors", "Baker", "Slow Burn", "Love"]
  }
]
