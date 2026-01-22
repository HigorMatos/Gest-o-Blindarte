export default function WorkOrdersPage() {
  return (
    <div>
      <h1>Ordens de Serviço</h1>
      <div className="card">
        <h3>Nova OS</h3>
        <div className="form-grid">
          <input placeholder="Código" />
          <input placeholder="Contrato ID" />
        </div>
        <button style={{ marginTop: 12 }}>Salvar</button>
      </div>
      <div className="card">
        <h3>Lista</h3>
        <p>Tabela mínima de OS (API: /work-orders).</p>
      </div>
    </div>
  );
}
