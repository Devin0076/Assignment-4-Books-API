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

// health check route
app.get('/', (_req, res) => res.send('Books API is running'));

// only start the server if run directly
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// export for tests
module.exports = app;
