require('dotenv').config()

const pool = require('./db')
const books = require('./data/books')

async function seedBooks() {
  try {
    for (const book of books) {
      await pool.query(
        `INSERT INTO books (
          id, name, author, description, category, image,
          total_chapters, total_pages, year, tags
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          author = EXCLUDED.author,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          image = EXCLUDED.image,
          total_chapters = EXCLUDED.total_chapters,
          total_pages = EXCLUDED.total_pages,
          year = EXCLUDED.year,
          tags = EXCLUDED.tags`,
        [
          book.id,
          book.name,
          book.author,
          book.description,
          book.category,
          book.image,
          book.totalChapters,
          book.totalPages,
          book.year,
          book.tags
        ]
      )
    }

    console.log(`Successfully seeded ${books.length} books into Neon.`)
  } catch (error) {
    console.error('Error seeding books:', error.message)
  } finally {
    await pool.end()
  }
}

seedBooks()