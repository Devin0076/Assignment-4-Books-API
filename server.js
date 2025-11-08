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


// health check route
app.get('/', (_req, res) => res.send('Books API is running'));

// only start the server if run directly
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// export for tests
module.exports = app;
