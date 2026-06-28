import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {

    readonly cartList: Locator;
    readonly cartItems: Locator;

    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        super(page);

        this.cartList = page.locator('.cart_list');
        this.cartItems = page.locator('.cart_item');

        this.checkoutButton = page.getByRole('button', {
            name: 'Checkout'
        });

        this.continueShoppingButton = page.getByRole('button', {
            name: 'Continue Shopping'
        });
    }

    // =====================================
    // Page Validation
    // =====================================

    async waitForCartPage(): Promise<void> {
        await expect(this.cartList).toBeVisible();
    }

    async verifyCartPageLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/cart.html/);
        await expect(this.cartList).toBeVisible();
    }

    // =====================================
    // Item Locators
    // =====================================

    getCartItem(name: string): Locator {

        return this.cartItems.filter({
            has: this.page.locator('.inventory_item_name', {
                hasText: name
            })
        });
    }

    getRemoveButton(name: string): Locator {

        return this.getCartItem(name)
            .getByRole('button', {
                name: 'Remove'
            });
    }

    // =====================================
    // Item Actions
    // =====================================

    async removeItem(name: string): Promise<void> {
        await this.getRemoveButton(name).click();
    }

    async removeMultipleItems(names: string[]): Promise<void> {

        for (const item of names) {
            await this.removeItem(item);
        }
    }

    async removeAllItems(): Promise<void> {

        while (await this.page.getByRole('button', {
            name: 'Remove'
        }).count() > 0) {

            await this.page
                .getByRole('button', {
                    name: 'Remove'
                })
                .first()
                .click();
        }
    }

    // =====================================
    // Item Information
    // =====================================

    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async getCartItemNames(): Promise<string[]> {

        return await this.page
            .locator('.inventory_item_name')
            .allTextContents();
    }

    async getCartItemPrices(): Promise<number[]> {

        const prices = await this.page
            .locator('.inventory_item_price')
            .allTextContents();

        return prices.map(price =>
            Number(price.replace('$', ''))
        );
    }

    async getCartItemDescription(name: string): Promise<string> {

        return await this.getCartItem(name)
            .locator('.inventory_item_desc')
            .textContent() ?? '';
    }

    async hasItem(name: string): Promise<boolean> {
        return await this.getCartItem(name).isVisible();
    }

    // =====================================
    // Navigation
    // =====================================

    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }

    async checkout(): Promise<void> {
        await this.checkoutButton.click();
    }

    // =====================================
    // Helper Assertions
    // =====================================

    async verifyItemExists(name: string): Promise<void> {
        await expect(this.getCartItem(name)).toBeVisible();
    }

    async verifyItemNotExists(name: string): Promise<void> {
        await expect(this.getCartItem(name)).toHaveCount(0);
    }
}