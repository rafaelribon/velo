import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'
import { OrderLockupPage, OrderDetails } from '../support/pages/OrderLockupPage' 
import { Navbar }  from  '../support/components/Navbar'
import { LandingPage } from '../support/pages/LandingPage'



test.describe('Consulta de Pedido', () => {


   let orderLockupPage: OrderLockupPage

    test.beforeEach(async ({ page }) => {
      await  new LandingPage(page).goto() 
      await new Navbar(page).orderLockupLink()
      orderLockupPage = new OrderLockupPage(page)
      orderLockupPage.validatePageLoaded()
      
    })


  test('deve consultar um pedido aprovado', async ({ page }) => {

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

    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

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

    await orderLockupPage.searchOrder(order.number)

    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ page }) => {

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

    await orderLockupPage.searchOrder(order.number)

    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
    const order = generateOrderCode()

    await orderLockupPage.searchOrder(order)

    await orderLockupPage.validateOrderNotFound()
})

test('deve exibir mensagem quando o pedido esta fora do padrão', async ({ page }) => {
  const order = 'VLO-SD123456'
  await orderLockupPage.searchOrder(order)
  await orderLockupPage.validateOrderNotFound()
})

})

