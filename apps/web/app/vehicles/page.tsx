export default function VehiclesPage() {
  return (
    <div>
      <h1>Veículos</h1>
      <div className="card">
        <h3>Novo veículo</h3>
        <div className="form-grid">
          <input placeholder="Placa" />
          <input placeholder="Modelo" />
          <input placeholder="Cliente ID" />
        </div>
        <button style={{ marginTop: 12 }}>Salvar</button>
      </div>
      <div className="card">
        <h3>Lista</h3>
        <p>Tabela mínima de veículos (API: /vehicles).</p>
      </div>
    </div>
  );
}
