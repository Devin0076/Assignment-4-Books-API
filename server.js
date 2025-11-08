// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// middleware to parse JSON
app.use(express.json());

// sample in-memory data
let books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", copiesAvailable: 5 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", copiesAvailable: 3 },
  { id: 3, title: "1984", author: "George Orwell", genre: "Dystopian Fiction", copiesAvailable: 7 }
];

// GET all books
app.get('/api/books', (_req, res) => {
  res.json(books);
});

// GET a specific book by ID
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
});

// POST /api/books - add a new book
app.post('/api/books', (req, res) => {
  const { title, author, genre, copiesAvailable } = req.body;

  // making sure required fields are present
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author required' });
  }

  // generate next id automatically
  const nextId = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;

  const newBook = {
    id: nextId,
    title,
    author,
    genre: genre ?? null,
    copiesAvailable: Number.isInteger(copiesAvailable) ? copiesAvailable : 0,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});


// PUT /api/books/:id - update an existing book
app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  // if no matching book, return error message
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const { title, author, genre, copiesAvailable } = req.body;

  // only update provided fields
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (genre !== undefined) book.genre = genre;
  if (copiesAvailable !== undefined) {
    const num = parseInt(copiesAvailable);
    if (!isNaN(num)) book.copiesAvailable = num;
  }

  res.json(book);
});



// health check route
app.get('/', (_req, res) => res.send('Books API is running'));

// only start the server if run directly
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// export for tests
module.exports = app;
