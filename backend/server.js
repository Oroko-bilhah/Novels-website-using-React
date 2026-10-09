const express  = require('express');
require ('dotenv').config();
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 5000;
const pool = require('./db')

app.use(cors())
app.use(express.json());

app.get(('/'),(req,res)=> {
    res.json(
        {
            message: 'Welcome to Novela API'
        }
    );
}

);

app.get('/api/v1/health', (req,res)=>
{res.json({
    status: 'OKAY',
    message:'Novella backend is running'
});
});

app.get('/api/v1/books', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                name,
                author,
                description,
                category,
                image,
                total_chapters AS "totalChapters",
                total_pages AS "totalPages",
                year,
                tags
            FROM books
            ORDER BY id
        `);

        res.json({
            count: result.rows.length,
            books: result.rows
        });
    } catch (error) {
        console.error('Error fetching books:', error.message);
        res.status(500).json({
            message: 'Failed to fetch books'
        });
    }
});


app.get('/api/v1/books/:id', async (req, res) => {
    try {
        const bookId = Number(req.params.id);

        if (!Number.isInteger(bookId) || bookId < 1) {
            return res.status(400).json({
                message: 'Invalid book ID'
            });
        }

        const result = await pool.query(`
            SELECT
                id,
                name,
                author,
                description,
                category,
                image,
                total_chapters AS "totalChapters",
                total_pages AS "totalPages",
                year,
                tags
            FROM books
            WHERE id = $1
        `, [bookId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.json({ book: result.rows[0] });
    } catch (error) {
        console.error('Error fetching book:', error.message);
        res.status(500).json({
            message: 'Failed to fetch book'
        });
    }
});

app.listen(PORT, ()=> {
    console.log(`Novella API running on http://localhost:${PORT}`);
}
);