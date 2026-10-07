import { test, expect } from '@playwright/test';

test('deve consultar um pedido aprovado', async ({ page }) => {


  //test data 
  const order = "VLO-YFR4K2"
  
  //Arrange
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await  expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  
    //Act

    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
  //Assert
  const  orderId = page.getByRole('paragraph')
    .filter({ hasText: /^Pedido$/ })
    .locator('..') // Sobe para o elemento pai (a div que agrupa ambos)

  await expect(orderId).toContainText(order, {timeout: 10_000});


  await expect(page.getByText('APROVADO')).toBeVisible




//   await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 30_000});
//   await expect(page.getByTestId('order-result-id')).toContainText('VLO-YFR4K2');
//   await expect(page.getByTestId('order-result-status')).toContainText('APROVADO'); 














});


