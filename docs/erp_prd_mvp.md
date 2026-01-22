# ERP Blindadora Automotiva — PRD + Arquitetura Inicial (A–I)

## A) PRD resumido

### Visão
ERP web para blindadora automotiva cobrindo ponta-a-ponta: comercial, contratos, produção, estoque, rastreabilidade, qualidade e financeiro. Foco em performance, UX para chão de fábrica e auditabilidade.

### Objetivos de negócio
- Reduzir tempo de ciclo por OS e retrabalho.
- Aumentar rastreabilidade de materiais críticos por lote/peça.
- Controlar margem (orçado vs realizado) por OS/contrato.
- Criar base confiável para expansão (BI, integrações fiscais e logísticas).

### Escopo MVP (Fase 1)
- Cadastros: clientes, veículos, fornecedores, usuários/roles.
- Comercial: lead/orçamento, contrato, OS.
- Produção básica: etapas e apontamentos por OS.
- Estoque básico: itens, lotes/serial, movimentos, consumo por OS.
- NF compra/venda (registro + anexos) com contas a pagar/receber e baixas.
- Anexos (fotos, PDFs, XML) e auditoria (quem/quando/antes/depois).
- Relatórios mínimos: OS atrasadas, consumo por item, custo real vs orçado, contas em aberto/pagas/atrasadas.

### Escopo Full (Fases 2–3)
- Rastreabilidade avançada (árvore de lote/peça, recalls).
- Qualidade: checklists por etapa, NCs, retrabalho, inspeções.
- Financeiro ampliado: centro de custo, DRE, conciliação bancária.
- BI e dashboards, integrações fiscais (NF-e/NFS-e), mobile/coletores.

### Não escopo MVP
- Emissão de NF-e/NFS-e pelo sistema.
- Integrações externas (ERP/CRM/BI) além de exportação básica.

## B) Diagrama textual de módulos

```
[Auth/RBAC]
   |-> [Cadastros] (Clientes, Veículos, Fornecedores, Usuários)
   |-> [Comercial] (Lead/Orçamento -> Contrato -> OS)
   |-> [Produção] (Etapas/Workflow, Apontamentos)
   |-> [Estoque] (Itens, Lotes/Serial, Movimentações, Consumo por OS)
   |-> [Financeiro] (NF Compra/Venda, Contas a Pagar/Receber, Baixas)
   |-> [Qualidade] (Checklists, Inspeções) *MVP: básico*
   |-> [Anexos] (Docs, Fotos, XML/PDF)
   |-> [Auditoria] (trilha completa)
   |-> [Relatórios]
```

## C) Modelo de dados (tabelas principais + relacionamentos)

### Core
- **users** (id, name, email, password_hash, is_active, created_at)
- **roles** (id, name, description)
- **user_roles** (user_id, role_id)
- **permissions** (id, code, description)
- **role_permissions** (role_id, permission_id)

### Clientes e veículos
- **customers** (id, type, name, document, contacts, address, created_at)
- **vehicles** (id, customer_id, plate, vin, model, year, version, armor_level, glass_type)

### Comercial
- **leads** (id, customer_id, vehicle_id, source, status, expected_value)
- **quotes** (id, lead_id, version, items_json, total_value, valid_until)
- **contracts** (id, customer_id, vehicle_id, quote_id, number, status, signed_at)
- **service_orders (os)** (id, contract_id, code, status, scheduled_start, due_date)

### Produção
- **workflow_stages** (id, name, sequence, is_default)
- **os_stage_entries** (id, os_id, stage_id, started_at, finished_at, status)
- **production_notes** (id, os_id, user_id, note, created_at)

### Estoque
- **stock_items** (id, type, sku, name, unit, min_level, is_active)
- **stock_lots** (id, item_id, lot_code, serial_number, supplier_id, received_at)
- **stock_movements** (id, item_id, lot_id, type, quantity, unit_cost, occurred_at, ref_type, ref_id)
- **os_material_consumptions** (id, os_id, item_id, lot_id, quantity, unit_cost)

### Fornecedores
- **suppliers** (id, name, document, contacts, address)

### NF, contas e baixas
- **invoices** (id, type, number, series, key, issue_date, total_value, xml_url, pdf_url, customer_id, supplier_id)
- **invoice_items** (id, invoice_id, item_id, quantity, unit_price, total_price, lot_id)
- **accounts_payable** (id, supplier_id, invoice_id, due_date, amount, status)
- **accounts_receivable** (id, customer_id, invoice_id, due_date, amount, status)
- **payments** (id, account_type, account_id, paid_at, amount, interest, discount, method, receipt_url)

### Qualidade
- **checklists** (id, name, stage_id, is_active)
- **checklist_items** (id, checklist_id, label, required)
- **checklist_results** (id, os_id, checklist_id, status, performed_by, performed_at)

### Anexos e auditoria
- **attachments** (id, ref_type, ref_id, file_name, file_url, uploaded_by)
- **audit_logs** (id, user_id, entity, entity_id, action, before_json, after_json, created_at)

### Relações-chave
- customer 1—N vehicles, contracts, invoices, AR.
- contract 1—1 os (MVP), os 1—N stages, consumption, attachments.
- invoices 1—N invoice_items -> stock_movements (entrada/saída).
- supplier 1—N invoices (purchase), AP.
- stock_items 1—N lots 1—N movements.

## D) Endpoints REST por módulo (exemplos)

### Auth
- `POST /auth/login`
  - req: `{ "email": "...", "password": "..." }`
  - res: `{ "accessToken": "...", "refreshToken": "..." }`

### Clientes/Vehicles
- `GET /customers?search=&page=1`
- `POST /customers`
  - req: `{ "name": "Cliente X", "document": "..." }`
- `POST /vehicles`
  - req: `{ "customerId": "...", "plate": "ABC1234", "vin": "..." }`

### Comercial
- `POST /leads`
  - req: `{ "customerId": "...", "vehicleId": "...", "expectedValue": 12000 }`
- `POST /quotes`
  - req: `{ "leadId": "...", "items": [{"name": "Blindagem"}], "totalValue": 35000 }`
- `POST /contracts`
  - req: `{ "quoteId": "...", "number": "CTR-2024-001" }`
- `POST /service-orders`
  - req: `{ "contractId": "...", "dueDate": "2024-05-01" }`

### Produção
- `GET /service-orders/:id/stages`
- `POST /service-orders/:id/stages/:stageId/start`
- `POST /service-orders/:id/stages/:stageId/finish`

### Estoque
- `POST /stock-items`
- `POST /stock-lots`
- `POST /stock-movements`
  - req: `{ "itemId": "...", "lotId": "...", "type": "IN", "quantity": 10, "unitCost": 50, "refType": "INVOICE" }`
- `POST /os/:id/consumptions`
  - req: `{ "itemId": "...", "lotId": "...", "quantity": 2, "unitCost": 60 }`

### NF e Financeiro
- `POST /invoices` (compra ou venda)
  - req: `{ "type": "PURCHASE", "number": "123", "supplierId": "...", "totalValue": 1000 }`
- `POST /invoices/:id/items`
- `POST /accounts-payable` / `POST /accounts-receivable`
- `POST /payments`
  - req: `{ "accountType": "AP", "accountId": "...", "paidAt": "2024-04-01", "amount": 500, "discount": 0 }`

### Anexos
- `POST /attachments` (multipart)

### Auditoria
- `GET /audit-logs?entity=service_orders&entityId=...`

## E) Telas principais (wireframe textual)

- **Dashboard**: cards de OS em atraso, OS por etapa, contas em aberto.
- **Clientes**: lista com filtro por nome/documento + detalhe (veículos, contratos, anexos).
- **Veículos**: lista por placa/cliente + detalhe (OS, histórico).
- **Comercial**: kanban de lead/orçamento/contrato + detalhamento.
- **OS**: lista com filtros (status, etapa, prazo) + página de OS (etapas, consumo, anexos, checklists).
- **Estoque**: itens, lotes, movimentos, entradas por NF.
- **Financeiro**: contas a pagar/receber (filtros por status/data), tela de baixa.
- **Relatórios**: OS atrasadas, consumo por item, custo real vs orçado.
- **Admin**: usuários, perfis, permissões.

## F) Papéis e permissões (RBAC) sugeridos
- **Admin**: acesso total.
- **Comercial**: leads, orçamentos, contratos, clientes, veículos.
- **Produção**: OS, etapas, apontamentos, checklists.
- **Estoque**: itens, lotes, movimentos, consumo por OS.
- **Financeiro**: NF, contas a pagar/receber, baixas, relatórios financeiros.
- **Qualidade**: checklists, inspeções, NCs.
- **Diretoria**: leitura total + relatórios.

## G) Plano de implementação em sprints (2 semanas)

### Sprint 1 (Base + Cadastros)
- Infra (NestJS + Next.js + Postgres + Prisma + Docker).
- Auth JWT/refresh + RBAC.
- Cadastros: clientes, veículos, fornecedores, usuários/roles.
- Definição de workflow de produção (etapas).

### Sprint 2 (Comercial + OS)
- Leads, orçamentos, contratos, OS.
- Anexos e auditoria.
- UI base (listas, filtros, detalhes).

### Sprint 3 (Estoque básico)
- Itens, lotes, movimentos, consumo por OS.
- Entrada via NF compra.
- Relatórios básicos de consumo.

### Sprint 4 (Financeiro básico)
- NF compra/venda (registro + anexos).
- Contas a pagar/receber + baixas.
- Relatórios financeiros mínimos.

### Definition of Done (por história)
- API + validações + testes básicos.
- UI mínima funcional.
- Migração e seed básicos.
- Auditoria para entidades críticas.

## H) Estrutura inicial do repositório + comandos

```
/apps
  /web (Next.js)
  /api (NestJS)
/packages
  /ui (design system/shadcn)
  /shared (tipos, zod schemas)
/infra
  /docker
```

Comandos (exemplo):
- `docker-compose up -d` (Postgres + MinIO)
- `pnpm install`
- `pnpm --filter api prisma migrate dev`

## I) Perguntas mínimas
1. Existe modelo padrão de contrato e campos obrigatórios?
2. Quais níveis de blindagem e tipos de vidro usados atualmente?
3. Processo atual de etapas: sequência fixa ou variantes por tipo de veículo?
4. Quais regras de aprovação (orçamento/contrato) e limites de desconto?
5. Precisa de integração com contabilidade/ERP legado na fase 2?
