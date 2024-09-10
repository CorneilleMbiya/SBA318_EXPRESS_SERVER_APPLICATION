const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// I will make up some data "Books management" =====> which will have as variables(Books, Authors and Reviews)
let books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

let authors = [
    { id: 1, name: 'F. Scott Fitzgerald' },
    { id: 2, name: 'Harper Lee' }
];

let reviews = [
    { id: 1, bookId: 1, text: 'A classic novel', rating: 5 },
    { id: 2, bookId: 2, text: 'Powerful and moving', rating: 5 }
];

// Home page
app.get('/', (req, res) => {
    res.render('index', { books, authors, reviews });
});

// GET all books
app.get('/My_API/books', (req, res) => {
    const { author } = req.query;
    if (author) {
        const filteredBooks = books.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
        res.json(filteredBooks);
  } else {
    res.json(books);
  }
});

// GET a specific book
app.get('/My_API/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (book) {
        res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// POST a new book
app.post('/My_API/books', (req, res) => {
    const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT (update) a book
app.put('/My_API/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (book) {
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Deleting a book
app.delete('/My_API/books/:id', (req, res) => {
    const index = books.findIndex(b => b.id === parseInt(req.params.id));
    if (index !== -1) {
        books.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// GET all authors
app.get('/My_API/authors', (req, res) => {
    res.json(authors);
});

// Reviews

// GET all reviews for a book
app.get('/My_API/books/:id/reviews', (req, res) => {
    const bookReviews = reviews.filter(r => r.bookId === parseInt(req.params.id));
    res.json(bookReviews);
});

// POST a new review
app.post('/My_API/books/:id/reviews', (req, res) => {
    const newReview = {
    id: reviews.length + 1,
    bookId: parseInt(req.params.id),
    text: req.body.text,
    rating: parseInt(req.body.rating)
    };
    reviews.push(newReview);
    res.status(201).json(newReview);
});

// From here, we will Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});