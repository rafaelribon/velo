import { type Page, expect } from '@playwright/test'

type Wheel = 'Sport' | 'Aero'
type Optional = 'Precision Park' | 'Flux Capacitor'

export function createConfiguradorActions(page: Page) {
  return {

    async open() {
      await page.goto('/configure')
    },

    async selectColor(color: string) {
      await page.getByRole('button', { name: color }).click()
    },

    async selectWheel(wheel: Wheel) {
      await page.getByRole('button', { name: new RegExp(`${wheel} Wheels`) }).click()
    },

    async selectOptional(optional: Optional) {
      this.expectOptionalsVisible
      await page.getByRole('checkbox', { name: optional }).click()
    },

    async removeOptional(optional: Optional) {
      this.expectOptionalsVisible
      await page.getByRole('checkbox', { name: optional }).click()
    },

    async expectPrice(price: string) {
      const priceElement = page.getByTestId('total-price')
      await expect(priceElement).toBeVisible()
      await expect(priceElement).toHaveText(price)
    },

    async validateVehicleImage(expectedName: string) {
      const vehicleImage = page.getByRole('img', { name: /^Velô Sprint -/ })
      await expect(vehicleImage).toBeVisible()
      await expect(vehicleImage).toHaveAccessibleName(expectedName)
    },

    async openCheckout() {
      const checkoutButton = page.getByRole('button', { name: 'Monte o Seu' })
      await expect(checkoutButton).toBeVisible()
      await checkoutButton.click()
      await expect(page).toHaveURL(/\/order$/)
    },

    async expectCheckoutSummary(color: string, wheels: string, price: string) {
      await expect(page.getByRole('heading', { name: 'Resumo' })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: 'Cor' })).toContainText(color)
      await expect(page.getByRole('listitem').filter({ hasText: 'Rodas' })).toContainText(wheels)
      await expect(page.getByTestId('summary-total-price')).toHaveText(price)
    },

    async expectOptionalsVisible() {
      const precisionPark = page.getByRole('checkbox', { name: 'Precision Park' })
      const fluxCapacitor = page.getByRole('checkbox', { name: 'Flux Capacitor' })
      await expect(precisionPark).toBeVisible()
      await expect(fluxCapacitor).toBeVisible()
    },
  }
}
