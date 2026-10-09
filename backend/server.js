const express  = require('express');
require ('dotenv').config();
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 5000;
const books = require('./data/books')

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
app.get('/api/v1/books', (req,res)=>
{res.json({
    count:books.length,
    books: books
});
});

app.get('/api/v1/books/:id', (req, res) => {
    const bookId = Number(req.params.id);
    const book = books.find((book) => book.id === bookId);

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    res.json({ book: book });
});

app.listen(PORT, ()=> {
    console.log(`Novella API running on http://localhost:${PORT}`);
}
);