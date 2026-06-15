const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const crypto = require('crypto');

const file = path.join(__dirname, '..', 'data', 'products.json');

function normalizeBarcode(value) {
  return String(value ?? '').trim();
}

function hasDuplicateBarcode(products, barcode, currentId = null) {
  const normalizedBarcode = normalizeBarcode(barcode);

  return products.some((item) => item.id !== currentId && normalizeBarcode(item.barcode) === normalizedBarcode);
}

async function getDb() {
  const adapter = new JSONFile(file);
  const db = new Low(adapter, { products: [], categories: [] });
  await db.read();

  if (!Array.isArray(db.data.products)) {
    db.data.products = [];
  }

  if (!Array.isArray(db.data.categories)) {
    db.data.categories = [];
  }

  if (db.data.categories.length === 0) {
    db.data.categories.push({ id: 'categoria-geral', name: 'Geral' });
  }

  await db.write();
  return db;
}

async function listProducts() {
  const db = await getDb();
  return db.data.products;
}

async function addProduct(product) {
  const db = await getDb();

  if (hasDuplicateBarcode(db.data.products, product.barcode)) {
    throw new Error('Já existe um produto com este código de barras.');
  }

  const newProduct = {
    id: crypto.randomUUID(),
    ...product,
    price: Number(product.price),
    available: Boolean(product.available),
    quantity: product.available ? Number(product.quantity || 0) : 0
  };

  db.data.products.push(newProduct);
  await db.write();
  return newProduct;
}

async function updateProduct(id, updates) {
  const db = await getDb();
  const index = db.data.products.findIndex((item) => item.id === id);

  if (index === -1) return null;

  const nextBarcode = updates.barcode ?? db.data.products[index].barcode;

  if (hasDuplicateBarcode(db.data.products, nextBarcode, id)) {
    throw new Error('Já existe um produto com este código de barras.');
  }

  db.data.products[index] = {
    ...db.data.products[index],
    ...updates,
    price: Number(updates.price ?? db.data.products[index].price),
    available: updates.available !== undefined ? Boolean(updates.available) : db.data.products[index].available,
    quantity: updates.available !== undefined ? (updates.available ? Number(updates.quantity ?? db.data.products[index].quantity ?? 0) : 0) : (db.data.products[index].available ? Number(updates.quantity ?? db.data.products[index].quantity ?? 0) : 0)
  };

  await db.write();
  return db.data.products[index];
}

async function deleteProduct(id) {
  const db = await getDb();
  const initialLength = db.data.products.length;
  db.data.products = db.data.products.filter((item) => item.id !== id);

  if (db.data.products.length === initialLength) {
    return false;
  }

  await db.write();
  return true;
}

async function listCategories() {
  const db = await getDb();
  return db.data.categories;
}

async function addCategory(name) {
  const db = await getDb();
  const newCategory = { id: crypto.randomUUID(), name: name.trim() };

  db.data.categories.push(newCategory);
  await db.write();
  return newCategory;
}

async function updateCategory(id, name) {
  const db = await getDb();
  const category = db.data.categories.find((item) => item.id === id);

  if (!category) return null;

  category.name = name.trim();
  await db.write();
  return category;
}

async function deleteCategory(id) {
  const db = await getDb();
  const initialLength = db.data.categories.length;
  db.data.categories = db.data.categories.filter((item) => item.id !== id);

  if (db.data.categories.length === initialLength) {
    return false;
  }

  await db.write();
  return true;
}

module.exports = { listProducts, addProduct, updateProduct, deleteProduct, listCategories, addCategory, updateCategory, deleteCategory };
