const request = require('supertest');
const app = require('../server');

describe('Books API', () => {
  test('GET /api/books → 200 and array', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/books/:id → 200 and one book', async () => {
    const res = await request(app).get('/api/books/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  test('GET /api/books/:id (missing) → 404', async () => {
    const res = await request(app).get('/api/books/99999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Book not found');
  });

  test('POST /api/books → 201 and created book', async () => {
    const payload = {
      title: 'Brave New World',
      author: 'Aldous Huxley',
      genre: 'Dystopian',
      copiesAvailable: 4
    };
    const res = await request(app).post('/api/books').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject(payload);
    expect(res.body).toHaveProperty('id');
  });

  test('POST /api/books (missing fields) → 400', async () => {
    const res = await request(app).post('/api/books').send({ title: 'No Author' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('PUT /api/books/:id → 200 and updated book', async () => {
    const res = await request(app)
      .put('/api/books/1')
      .send({ title: 'The Great Gatsby (Updated Edition)', copiesAvailable: 9 });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('The Great Gatsby (Updated Edition)');
    expect(res.body.copiesAvailable).toBe(9);
  });

  test('PUT /api/books/:id (missing) → 404', async () => {
    const res = await request(app).put('/api/books/99999').send({ title: 'Nope' });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Book not found');
  });

  test('DELETE /api/books/:id → 204', async () => {
    // create a book, then delete it
    const created = await request(app)
      .post('/api/books')
      .send({ title: 'Temp', author: 'Someone' });
    const id = created.body.id;

    const del = await request(app).delete(`/api/books/${id}`);
    expect(del.statusCode).toBe(204);
  });

  test('DELETE /api/books/:id (missing) → 404', async () => {
    const res = await request(app).delete('/api/books/99999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Book not found');
  });
});
