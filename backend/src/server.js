const express = require('express');
const cors = require('cors');
const { listProducts, addProduct, updateProduct, deleteProduct, listCategories, addCategory, updateCategory, deleteCategory } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/products', async (_req, res) => {
  try {
    const products = await listProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar produtos.', error: error.message });
  }
});

app.get('/api/categories', async (_req, res) => {
  try {
    const categories = await listCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar categorias.', error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const category = await addCategory(req.body.name);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar categoria.', error: error.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const category = await updateCategory(req.params.id, req.body.name);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar categoria.', error: error.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const removed = await deleteCategory(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir categoria.', error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await addProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao adicionar produto.', error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar produto.', error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const removed = await deleteProduct(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar produto.', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
