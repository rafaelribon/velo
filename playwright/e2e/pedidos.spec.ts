import { test, expect } from '@playwright/test';

test('deve consultar um pedido aprovado', async ({ page }) => {
  //Arrange
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await  expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  
    //Act

    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-YFR4K2');
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
  //Assert


  await expect(page.getByText('VLO-YFR4K2')).toBeVisible({timeout: 10_000});
  await expect(page.getByText('APROVADO')).toBeVisible




//   await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 30_000});
//   await expect(page.getByTestId('order-result-id')).toContainText('VLO-YFR4K2');
//   await expect(page.getByTestId('order-result-status')).toContainText('APROVADO'); 














});


