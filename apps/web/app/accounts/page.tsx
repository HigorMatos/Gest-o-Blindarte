export default function AccountsPage() {
  return (
    <div>
      <h1>Contas a Pagar / Receber</h1>
      <div className="card">
        <h3>Baixa de pagamento</h3>
        <div className="form-grid">
          <input placeholder="Valor" />
          <input placeholder="Data de pagamento" />
          <input placeholder="Título a pagar ID" />
          <input placeholder="Título a receber ID" />
          <input type="file" />
        </div>
        <button style={{ marginTop: 12 }}>Registrar pagamento</button>
      </div>
      <div className="card">
        <h3>Listas</h3>
        <p>API: /accounts/payable e /accounts/receivable.</p>
      </div>
    </div>
  );
}
