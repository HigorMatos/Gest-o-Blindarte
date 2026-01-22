export default function SuppliersPage() {
  return (
    <div>
      <h1>Fornecedores</h1>
      <div className="card">
        <h3>Novo fornecedor</h3>
        <div className="form-grid">
          <input placeholder="Nome" />
          <input placeholder="Documento" />
          <input placeholder="Email" />
          <input placeholder="Telefone" />
        </div>
        <button style={{ marginTop: 12 }}>Salvar</button>
      </div>
      <div className="card">
        <h3>Lista</h3>
        <p>Tabela mínima de fornecedores (API: /suppliers).</p>
      </div>
    </div>
  );
}
