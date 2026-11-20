# Melhorias: Consulta de Pedido (Playwright)

Arquivo de saída das alterações sugeridas para reduzir repetição em:

- `playwright/e2e/pedidos.spec.ts`
- `playwright/support/pages/OrderLockupPage.ts`

Isto é um **plano**. O código TypeScript ainda não foi aplicado.

## Objetivo

Os três testes de pedido encontrado fazem a mesma sequência. Só os dados mudam. O spec deve descrever o cenário; a page object deve saber como a tela funciona.

## O que já está ok

- `searchOrder(code)` — preenche o número e clica em Buscar
- `validateStatusBadge(status)` — cores e ícone por `APROVADO`, `REPROVADO` e `EM_ANALISE`
- Teste **pedido não encontrado** — fluxo diferente, permanece separado

## Problema atual

Cada um dos testes `APROVADO`, `REPROVADO` e `EM_ANALISE` copia:

1. `new OrderLockupPage(page)`
2. O `toMatchAriaSnapshot` (~30 linhas)
3. A sequência buscar → snapshot → badge

---

## Alteração 1 — Instanciar a page object no `beforeEach`

Hoje cada teste faz `new OrderLockupPage(page)`.

Depois, uma instância por teste, criada no setup:

```ts
let orderLockupPage: OrderLockupPage

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  orderLockupPage = new OrderLockupPage(page)
})
```

## Alteração 2 — Snapshot na page object

Exportar um tipo `OrderResult` e um método `expectOrderResult(order)`.

O spec deixa de repetir o bloco ARIA três vezes.

Opcional: `expectNotFound()` para o caso de pedido inexistente.

## Alteração 3 — Um loop no lugar de três testes iguais

Array de pedidos + `for`. O Playwright ainda lista **3 testes** no relatório, um por status.

---

## Código proposto

### `playwright/support/pages/OrderLockupPage.ts`

```ts
import { Page, expect } from '@playwright/test'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'

export type OrderResult = {
  number: string
  status: OrderStatus
  color: string
  wheels: string
  customer: { name: string; email: string }
  payment: string
}

export class OrderLockupPage {
  constructor(private page: Page) {}

  async searchOrder(code: string) {
    await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(code)
    await this.page.getByRole('button', { name: 'Buscar Pedido' }).click()
  }

  async expectOrderResult(order: OrderResult) {
    await expect(this.page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `)
  }

  async expectNotFound() {
    await expect(this.page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
    `)
  }

  async validateStatusBadge(status: OrderStatus) {
    const statusClasses = {
      APROVADO: {
        background: 'bg-green-100',
        text: 'text-green-700',
        icon: 'lucide-circle-check-big',
      },
      REPROVADO: {
        background: 'bg-red-100',
        text: 'text-red-700',
        icon: 'lucide-circle-x',
      },
      EM_ANALISE: {
        background: 'bg-amber-100',
        text: 'text-amber-700',
        icon: 'lucide-clock',
      },
    } as const

    const classes = statusClasses[status]
    const statusBadge = this.page.getByRole('status').filter({ hasText: status })

    await expect(statusBadge).toHaveClass(new RegExp(classes.background))
    await expect(statusBadge).toHaveClass(new RegExp(classes.text))
    await expect(statusBadge.locator('svg')).toHaveClass(new RegExp(classes.icon))
  }
}
```

### `playwright/e2e/pedidos.spec.ts`

```ts
import { test, expect } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'
import { OrderLockupPage, OrderResult } from '../support/pages/OrderLockupPage'

/// AAA - Arrange, Act, Assert

const orders: OrderResult[] = [
  {
    number: 'VLO-6E2J20',
    status: 'APROVADO',
    color: 'Lunar White',
    wheels: 'aero Wheels',
    customer: {
      name: 'Fernando Papito',
      email: 'papito@velo.dev',
    },
    payment: 'À Vista',
  },
  {
    number: 'VLO-0LNFEA',
    status: 'REPROVADO',
    color: 'Midnight Black',
    wheels: 'sport Wheels',
    customer: {
      name: 'Steve Jobs',
      email: 'jobs@apple.com',
    },
    payment: 'À Vista',
  },
  {
    number: 'VLO-412O06',
    status: 'EM_ANALISE',
    color: 'Lunar White',
    wheels: 'aero Wheels',
    customer: {
      name: 'João da Silva',
      email: 'joao@velo.dev',
    },
    payment: 'À Vista',
  },
]

test.describe('Consulta de Pedido', () => {
  let orderLockupPage: OrderLockupPage

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

    orderLockupPage = new OrderLockupPage(page)
  })

  for (const order of orders) {
    test(`deve consultar um pedido ${order.status.toLowerCase()}`, async () => {
      await orderLockupPage.searchOrder(order.number)
      await orderLockupPage.expectOrderResult(order)
      await orderLockupPage.validateStatusBadge(order.status)
    })
  }

  test('deve exibir mensagem quando o pedido não é encontrado', async () => {
    await orderLockupPage.searchOrder(generateOrderCode())
    await orderLockupPage.expectNotFound()
  })
})
```

---

## Como fica o spec

| Teste | Origem |
| --- | --- |
| `deve consultar um pedido aprovado` | loop, `APROVADO` |
| `deve consultar um pedido reprovado` | loop, `REPROVADO` |
| `deve consultar um pedido em_analise` | loop, `EM_ANALISE` |
| `deve exibir mensagem quando o pedido não é encontrado` | caso separado |

Corpo do caso feliz:

```ts
await orderLockupPage.searchOrder(order.number)
await orderLockupPage.expectOrderResult(order)
await orderLockupPage.validateStatusBadge(order.status)
```

## O que não muda

- Números reais no banco (`VLO-6E2J20`, `VLO-0LNFEA`, `VLO-412O06`)
- Classes CSS e ícones do badge
- Conteúdo do snapshot (só o arquivo em que vive)
- Navegação inicial: home → Consultar Pedido

## Critério de pronto

Quando o código for aplicado:

1. `npx playwright test playwright/e2e/pedidos.spec.ts` passa os 4 casos
2. Spec sem snapshot duplicado
3. Page object com `searchOrder`, `expectOrderResult`, `expectNotFound` e `validateStatusBadge`
