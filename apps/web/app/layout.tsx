import "../styles/globals.css";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "Gest-o MVP",
  description: "ERP MVP",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <div className="layout">
          <aside className="sidebar">
            <h2>Gest-o</h2>
            <nav>
              <Link href="/">Dashboard</Link>
              <Link href="/login">Login</Link>
              <Link href="/clients">Clientes</Link>
              <Link href="/vehicles">Veículos</Link>
              <Link href="/suppliers">Fornecedores</Link>
              <Link href="/products">Produtos</Link>
              <Link href="/work-orders">Ordens de Serviço</Link>
              <Link href="/invoices/purchase">NF Compra</Link>
              <Link href="/invoices/sales">NF Venda</Link>
              <Link href="/accounts">Contas</Link>
            </nav>
          </aside>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
