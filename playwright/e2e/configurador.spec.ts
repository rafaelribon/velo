import { test } from '../support/fixtures'

test.describe('Configuração do Veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurador.open()
  })

  test('deve atualizar a imagem ao selecionar outra cor sem alterar o preço', async ({ app }) => {
  
    await app.configurador.expectPrice('R$ 40.000,00')

    await app.configurador.selectColor('Midnight Black')
    await app.configurador.validateVehicleImage('Velô Sprint - midnight-black with aero wheels')
    await app.configurador.expectPrice('R$ 40.000,00')
  })

  test('deve atualizar imagem e preço ao selecionar rodas Sport e restaurá-los com Aero', async ({ app }) => {
    await app.configurador.expectPrice('R$ 40.000,00')

    await app.configurador.selectWheel('Sport')
    await app.configurador.validateVehicleImage('Velô Sprint - glacier-blue with sport wheels')
    await app.configurador.expectPrice('R$ 42.000,00')

    await app.configurador.selectWheel('Aero')
    await app.configurador.validateVehicleImage('Velô Sprint - glacier-blue with aero wheels')
    await app.configurador.expectPrice('R$ 40.000,00')
  })

  test('deve atualizar o preço ao adicionar e remover opcionais e mantê-lo no checkout', async ({ app }) => {
    await app.configurador.expectPrice('R$ 40.000,00')
    await app.configurador.expectOptionalsVisible()

    await app.configurador.selectOptional('Precision Park')
    await app.configurador.expectPrice('R$ 45.500,00')

    await app.configurador.selectOptional('Flux Capacitor')
    await app.configurador.expectPrice('R$ 50.500,00')

    await app.configurador.removeOptional('Precision Park')
    await app.configurador.expectPrice('R$ 45.000,00')

    await app.configurador.removeOptional('Flux Capacitor')
    await app.configurador.expectPrice('R$ 40.000,00')

    await app.configurador.openCheckout()
    await app.configurador.expectCheckoutSummary('Glacier Blue', 'aero Wheels', 'R$ 40.000,00')
  })
})