export default function ClientsPage() {
  return (
    <div>
      <h1>Clientes</h1>
      <div className="card">
        <h3>Novo cliente</h3>
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
        <p>Tabela mínima de clientes (API: /clients).</p>
      </div>
    </div>
  );
}
