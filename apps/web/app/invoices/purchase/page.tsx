export default function PurchaseInvoicePage() {
  return (
    <div>
      <h1>NF Compra (Guiada)</h1>
      <div className="card">
        <h3>Dados da NF</h3>
        <div className="form-grid">
          <input placeholder="Número" />
          <input placeholder="Data de emissão" />
          <input placeholder="Fornecedor ID" />
          <input placeholder="Vencimento" />
        </div>
      </div>
      <div className="card">
        <h3>Itens + Entrada de estoque</h3>
        <div className="form-grid">
          <input placeholder="Produto ID" />
          <input placeholder="Quantidade" />
          <input placeholder="Preço unitário" />
          <input placeholder="Lote" />
          <input placeholder="Serial" />
        </div>
        <button style={{ marginTop: 12 }}>Adicionar item</button>
      </div>
      <div className="card">
        <h3>Resumo</h3>
        <p>Ao salvar, gera entrada de estoque + contas a pagar.</p>
      </div>
    </div>
  );
}
