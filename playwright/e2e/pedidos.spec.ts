import { test } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import { type OrderDetails } from '../support/actions/orderLockupActions'



test.describe('Consulta de Pedido', () => {
  test.beforeEach(async ({ app }) => {
    await app.orderLockup.open()
    
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {

    const order: OrderDetails = {
      number: 'VLO-YFR4K2',
      status: 'APROVADO',
      color: 'Midnight Black',
      wheels: 'aero Wheels',
      customer: {
        name: 'reererer ererer',
        email: 'teste@teste.dev'
      },
      payment: 'À Vista'
    }

    await app.orderLockup.searchOrder(order.number)

    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ app }) => {

    const order: OrderDetails = {
      number: 'VLO-AGD94B',
      status: 'REPROVADO',
      color: 'Glacier Blue',
      wheels: 'sport Wheels',
      customer: {
        name: 'Jose Silva',
        email: 'teste@teste.com'
      },
      payment: 'À Vista'
    }

    await app.orderLockup.searchOrder(order.number)

    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {

    const order: OrderDetails = {
      number: 'VLO-59LGGY',
      status: 'EM_ANALISE',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Joao  Silva ',
        email: 'joao@teste.com'
      },
      payment: 'À Vista'
    }

    await app.orderLockup.searchOrder(order.number)

    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {
    const order = generateOrderCode()

    await app.orderLockup.searchOrder(order)

    await app.orderLockup.validateOrderNotFound()
})

test('deve exibir mensagem quando o pedido esta fora do padrão', async ({ app }) => {
  const order = 'VLO-SD123456'
  await app.orderLockup.searchOrder(order)
  await app.orderLockup.validateOrderNotFound()
})

})

