import React, { useState, useEffect } from "react";
import "./App.css"; // Nosso CSS personalizado

function App() {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    expiryDate: "",
  });

  // Carrega produtos do localStorage
  useEffect(() => {
    const savedProducts =
      JSON.parse(localStorage.getItem("makeup-products")) || [];
    setProducts(savedProducts);
  }, []);

  // Salva produtos no localStorage
  const saveProducts = (newProducts) => {
    localStorage.setItem("makeup-products", JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  // Manipula mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  // Envia o formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      ...currentProduct,
      id: currentProduct.id || Date.now(),
      price: parseFloat(currentProduct.price),
    };

    const updatedProducts = currentProduct.id
      ? products.map((p) => (p.id === currentProduct.id ? newProduct : p))
      : [...products, newProduct];

    saveProducts(updatedProducts);
    setCurrentProduct({
      id: null,
      name: "",
      category: "",
      price: "",
      expiryDate: "",
    });
  };

  // Edita produto
  const editProduct = (product) => {
    setCurrentProduct({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      expiryDate: product.expiryDate,
    });
  };

  // Exclui produto
  const deleteProduct = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      saveProducts(products.filter((product) => product.id !== id));
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1> Maquiagem</h1>
      </header>

      <div className="product-form-container">
        <h2>{currentProduct.id ? "Editar" : "Adicionar"} Produto</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={currentProduct.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoria:</label>
            <select
              name="category"
              value={currentProduct.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="Batom">Batom</option>
              <option value="Base">Base</option>
              <option value="Paleta">Paleta de Sombras</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preço (R$):</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={currentProduct.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Data de Validade:</label>
            <input
              type="date"
              name="expiryDate"
              value={currentProduct.expiryDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            {currentProduct.id ? "Atualizar" : "Salvar"}
          </button>
        </form>
      </div>

      <div className="product-list-container">
        <h2>Lista de Produtos</h2>
        {products.length === 0 ? (
          <p>Nenhum produto cadastrado.</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Validade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>R$ {product.price.toFixed(2)}</td>
                  <td>{new Date(product.expiryDate).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      onClick={() => editProduct(product)}
                      className="edit-button"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="delete-button"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
