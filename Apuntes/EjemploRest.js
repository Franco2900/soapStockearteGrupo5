const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Un array simulado como base de datos
let items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
];

// GET - Obtener todos los items
app.get('/items', (req, res) => {
  res.json(items);
});

// GET - Obtener un item por ID
app.get('/items/:id', (req, res) => {

  const itemId = parseInt(req.params.id);
  const item = items.find(i => i.id === itemId);

  if (item) res.json(item);
  else      res.status(404).send('Item not found');
});

// POST - Crear un nuevo item
app.post('/items', (req, res) => {
  const newItem = { id: items.length + 1, name: req.body.name };
  items.push(newItem);
  
  res.status(201).json(newItem);
});

// PUT - Actualizar un item por ID
app.put('/items/:id', (req, res) => {

  const itemId = parseInt(req.params.id);
  const item = items.find(i => i.id === itemId);
  
  if (item) {
    item.name = req.body.name;
    res.json(item);
  } 
  else res.status(404).send('Item not found');
});

// DELETE - Borrar un item por ID
app.delete('/items/:id', (req, res) => {

  const itemId = parseInt(req.params.id);
  items = items.filter(i => i.id !== itemId);

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
