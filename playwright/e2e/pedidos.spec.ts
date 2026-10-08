import { test, expect } from '@playwright/test';

import { generateOrderCode } from '../support/helpers';

test.describe("Consultar Pedidos", () => {


  test.beforeEach(async({page})=> {

    //Arrange
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await  expect(page.getByRole('heading')).toContainText('Consultar Pedido')

 })


  test('deve consultar um pedido aprovado', async ({ page }) => {

    //test data 
    const order = "VLO-YFR4K2"

    
      //Act
  
      await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
      await page.getByRole('button', { name: 'Buscar Pedido' }).click();
    
    //Assert
    const  orderId = page.getByRole('paragraph')
      .filter({ hasText: /^Pedido$/ })
      .locator('..') // Sobe para o elemento pai (a div que agrupa ambos)
  
    await expect(orderId).toContainText(order, {timeout: 10_000});
  
  
    await expect(page.getByText('APROVADO')).toBeVisible
  
  });
  
  test('deve exibir mensagem quando o pedido não e encontrado ', async ({page})=> {
  
    const order = generateOrderCode()
  

    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
  
    // const title = page.getByRole('heading', {name: "Pedido não encontrado"})
    // await expect(title).toBeVisible()
  
    // const message = page.locator('p',{hasText: 'Verifique o número do pedido e tente novamente'})
    // await expect(message).toBeVisible();
  
  
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `);
  
  
  })


})


