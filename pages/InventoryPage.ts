import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {

  // Page Locators
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly shoppingCartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);

    this.inventoryContainer = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');

    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');

    this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  // ======================================================
  // Page Validation
  // ======================================================

  async waitForInventoryPage(): Promise<void> {
    await expect(this.inventoryContainer).toBeVisible();
  }

  async verifyInventoryPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory.html/);
    await expect(this.inventoryContainer).toBeVisible();
  }

  // ======================================================
  // Product Locators
  // ======================================================

  getInventoryItemByName(name: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.locator('.inventory_item_name', {
        hasText: name
      })
    });
  }

  getAddButton(name: string): Locator {
    return this.getInventoryItemByName(name)
      .getByRole('button', { name: 'Add to cart' });
  }

  getRemoveButton(name: string): Locator {
    return this.getInventoryItemByName(name)
      .getByRole('button', { name: 'Remove' });
  }

  // ======================================================
  // Product Actions
  // ======================================================

  async addItemToCartByName(name: string): Promise<void> {
    await this.getAddButton(name).click();
  }

  async removeItemFromCartByName(name: string): Promise<void> {
    await this.getRemoveButton(name).click();
  }

  async addMultipleItems(names: string[]): Promise<void> {
    for (const name of names) {
      await this.addItemToCartByName(name);
    }
  }

  async removeMultipleItems(names: string[]): Promise<void> {
    for (const name of names) {
      await this.removeItemFromCartByName(name);
    }
  }

  async addAllItemsToCart(): Promise<void> {

    const buttons = this.page.getByRole('button', {
      name: 'Add to cart'
    });

    while(await buttons.count() > 0){
      await buttons.first().click();
    }
  }

  async removeAllItemsFromCart(): Promise<void> {

    while (await this.page.getByRole('button', {
      name: 'Remove'
    }).count()) {

      await this.page
        .getByRole('button', { name: 'Remove' })
        .first()
        .click();
    }
  }

  // ======================================================
  // Product Information
  // ======================================================

  async getProductCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return await this.page
      .locator('.inventory_item_name')
      .allTextContents();
  }

  async getProductPrices(): Promise<number[]> {

    const prices = await this.page
      .locator('.inventory_item_price')
      .allTextContents();

    return prices.map(price =>
      Number(price.replace('$', ''))
    );
  }

  async getProductDescription(name: string): Promise<string> {

    return await this
      .getInventoryItemByName(name)
      .locator('.inventory_item_desc')
      .textContent() ?? '';
  }

  async hasProduct(name: string): Promise<boolean> {
    return await this.getInventoryItemByName(name).isVisible();
  }

  // ======================================================
  // Product Details Page
  // ======================================================

  async openProduct(name: string): Promise<void> {
    await this.page
      .locator('.inventory_item_name')
      .getByText(name)
      .click();
  }

  // ======================================================
  // Cart
  // ======================================================

  async openCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.cartBadge.isVisible();
  }

  async getCartItemCount(): Promise<number> {

    if (!(await this.cartBadge.isVisible())) {
      return 0;
    }

    return Number(await this.cartBadge.textContent());
  }

  // ======================================================
  // Sorting
  // ======================================================

  async sortByNameAZ(): Promise<void> {
    await this.sortDropdown.selectOption('az');
  }

  async sortByNameZA(): Promise<void> {
    await this.sortDropdown.selectOption('za');
  }

  async sortByPriceLowToHigh(): Promise<void> {
    await this.sortDropdown.selectOption('lohi');
  }

  async sortByPriceHighToLow(): Promise<void> {
    await this.sortDropdown.selectOption('hilo');
  }

  // ======================================================
  // Menu
  // ======================================================

  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }

  // ======================================================
  // Helper Methods
  // ======================================================

  async verifyProductExists(name: string): Promise<void> {
    await expect(this.getInventoryItemByName(name)).toBeVisible();
  }

  async verifyProductNotExists(name: string): Promise<void> {
    await expect(this.getInventoryItemByName(name)).toHaveCount(0);
  }

  async verifyAddButtonVisible(name: string): Promise<void> {
    await expect(this.getAddButton(name)).toBeVisible();
  }

  async verifyRemoveButtonVisible(name: string): Promise<void> {
    await expect(this.getRemoveButton(name)).toBeVisible();
  }
}