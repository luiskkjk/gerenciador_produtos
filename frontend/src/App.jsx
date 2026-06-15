import { useEffect, useState } from 'react';

const emptyForm = {
  name: '',
  price: '',
  category: '',
  barcode: '',
  available: true,
  quantity: '1'
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState('add');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [categoryForm, setCategoryForm] = useState({ name: '', editingCategoryId: null });

  const loadProducts = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(data);
  };

  const loadCategories = async () => {
    const response = await fetch('/api/categories');
    const data = await response.json();
    setCategories(data);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'available' && !checked ? { quantity: '0' } : {})
    }));
  };

  const handleCategoryInputChange = (event) => {
    const { name, value } = event.target;
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      barcode: form.barcode.trim(),
      available: Boolean(form.available),
      quantity: form.available ? Number(form.quantity || 0) : 0
    };

    if (!payload.name || !payload.category || !payload.barcode || Number.isNaN(payload.price)) {
      setMessage('Preencha todos os campos corretamente antes de salvar.');
      return;
    }

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setMessage(editingId ? 'Produto atualizado com sucesso.' : 'Produto adicionado com sucesso.');
      await loadProducts();
      await loadCategories();
      resetForm();
      return;
    }

    const errorData = await response.json().catch(() => ({}));
    setMessage(errorData.message || 'Não foi possível salvar o produto.');
  };

  const handleEdit = (product) => {
    setView('add');
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      barcode: product.barcode,
      available: product.available,
      quantity: String(product.quantity ?? 0)
    });
    setMessage('Você está editando um produto existente.');
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });

    if (response.ok) {
      setMessage('Produto removido com sucesso.');
      await loadProducts();
      if (editingId === id) resetForm();
      return;
    }

    const errorData = await response.json().catch(() => ({}));
    setMessage(errorData.message || 'Não foi possível remover o produto.');
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    if (!categoryForm.name.trim()) {
      setMessage('Informe o nome da categoria.');
      return;
    }

    const method = categoryForm.editingCategoryId ? 'PUT' : 'POST';
    const url = categoryForm.editingCategoryId ? `/api/categories/${categoryForm.editingCategoryId}` : '/api/categories';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: categoryForm.name.trim() })
    });

    if (response.ok) {
      setMessage(categoryForm.editingCategoryId ? 'Categoria atualizada com sucesso.' : 'Categoria criada com sucesso.');
      setCategoryForm({ name: '', editingCategoryId: null });
      await loadCategories();
      return;
    }

    const errorData = await response.json().catch(() => ({}));
    setMessage(errorData.message || 'Não foi possível salvar a categoria.');
  };

  const handleEditCategory = (category) => {
    setView('categories');
    setCategoryForm({ name: category.name, editingCategoryId: category.id });
    setMessage('Você está editando uma categoria existente.');
  };

  const handleDeleteCategory = async (id) => {
    const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });

    if (response.ok) {
      setMessage('Categoria removida com sucesso.');
      await loadCategories();
      return;
    }

    const errorData = await response.json().catch(() => ({}));
    setMessage(errorData.message || 'Não foi possível remover a categoria.');
  };

  return (
    <main className="app-shell">
      <aside className="panel sidebar-card">
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
        <button className={view === 'add' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('add')}>
          <span className="nav-icon">＋</span><span className="nav-label">Adicionar produto</span>
        </button>
        <button className={view === 'products' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('products')}>
          <span className="nav-icon">📦</span><span className="nav-label">Produtos cadastrados</span>
        </button>
        <button className={view === 'categories' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('categories')}>
          <span className="nav-icon">🏷️</span><span className="nav-label">Categorias</span>
        </button>
      </aside>

      <section className="content-column">
        <section className="panel hero-card">
          <h1>Gerenciador de Produtos do Supermercado</h1>
          <p className="lead">Sistema para gerência de produtos de supermercado</p>
        </section>

        {message && <p className="message-box">{message}</p>}

        {view === 'add' && (
          <section className="panel form-card">
            <h2>{editingId ? 'Editar produto' : 'Adicionar produto'}</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <label>Nome
                <input name="name" value={form.name} onChange={handleChange} placeholder="Ex.: Leite integral" />
              </label>
              <label>Preço (R$)
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="4.99" />
              </label>
              <label>Categoria
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label>Código de barras
                <input name="barcode" value={form.barcode} onChange={handleChange} placeholder="7891234567890" />
              </label>
              <label className="checkbox-row">
                <input name="available" type="checkbox" checked={form.available} onChange={handleChange} />
                Disponível em estoque
              </label>
              {form.available && (
                <label>Quantidade em estoque
                  <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} placeholder="10" />
                </label>
              )}
              <div className="actions-row">
                <button type="submit" className="primary-btn">{editingId ? 'Salvar alterações' : 'Adicionar produto'}</button>
                {editingId && <button type="button" className="ghost-btn" onClick={resetForm}>Cancelar</button>}
              </div>
            </form>
          </section>
        )}

        {view === 'products' && (
          <section className="panel table-card">
            <div className="table-header">
              <h2>Produtos cadastrados</h2>
              <span>{products.length} itens</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Código</th>
                  <th>Estoque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>R$ {Number(product.price).toFixed(2)}</td>
                    <td>{product.category}</td>
                    <td>{product.barcode}</td>
                    <td>{product.available ? `Disponível (${product.quantity ?? 0} un.)` : 'Indisponível'}</td>
                    <td className="action-cell">
                      <button className="ghost-btn" onClick={() => handleEdit(product)}>Editar</button>
                      <button className="danger-btn" onClick={() => handleDelete(product.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {view === 'categories' && (
          <section className="panel form-card">
            <h2>{categoryForm.editingCategoryId ? 'Editar categoria' : 'Criar categoria'}</h2>
            <form onSubmit={handleCategorySubmit} className="product-form">
              <label>Nome da categoria
                <input name="name" value={categoryForm.name} onChange={handleCategoryInputChange} placeholder="Ex.: Frutas" />
              </label>
              <div className="actions-row">
                <button type="submit" className="primary-btn">{categoryForm.editingCategoryId ? 'Salvar categoria' : 'Criar categoria'}</button>
                {categoryForm.editingCategoryId && <button type="button" className="ghost-btn" onClick={() => setCategoryForm({ name: '', editingCategoryId: null })}>Cancelar</button>}
              </div>
            </form>

            <div className="category-list">
              {categories.map((category) => (
                <article key={category.id} className="category-card">
                  <strong>{category.name}</strong>
                  <div className="action-cell">
                    <button className="ghost-btn" onClick={() => handleEditCategory(category)}>Editar</button>
                    <button className="danger-btn" onClick={() => handleDeleteCategory(category.id)}>Excluir</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
