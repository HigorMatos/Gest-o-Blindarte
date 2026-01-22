export default function SalesInvoicePage() {
  return (
    <div>
      <h1>NF Venda</h1>
      <div className="card">
        <h3>Dados da NF</h3>
        <div className="form-grid">
          <input placeholder="Número" />
          <input placeholder="Data de emissão" />
          <input placeholder="Contrato ID" />
          <input placeholder="OS ID" />
          <input placeholder="Vencimento" />
        </div>
      </div>
      <div className="card">
        <h3>Itens</h3>
        <div className="form-grid">
          <input placeholder="Produto ID" />
          <input placeholder="Quantidade" />
          <input placeholder="Preço unitário" />
        </div>
        <button style={{ marginTop: 12 }}>Adicionar item</button>
      </div>
      <div className="card">
        <h3>Resumo</h3>
        <p>Ao salvar, gera contas a receber vinculada à OS.</p>
      </div>
    </div>
  );
}
