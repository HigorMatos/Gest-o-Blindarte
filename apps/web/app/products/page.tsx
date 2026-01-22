export default function ProductsPage() {
  return (
    <div>
      <h1>Produtos</h1>
      <div className="card">
        <h3>Novo produto</h3>
        <div className="form-grid">
          <input placeholder="Nome" />
          <input placeholder="SKU" />
          <input placeholder="Unidade" />
        </div>
        <button style={{ marginTop: 12 }}>Salvar</button>
      </div>
      <div className="card">
        <h3>Lista</h3>
        <p>Tabela mínima de produtos (API: /products).</p>
      </div>
    </div>
  );
}
