import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart Page', () => {

    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {

        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        await loginPage.goto();

        await loginPage.login(
            'standard_user',
            'secret_sauce'
        );

        await inventoryPage.waitForInventoryPage();
    });

    test('should navigate to cart page', async () => {

        await inventoryPage.openCart();

        await cartPage.verifyCartPageLoaded();
    });

    test('should display added product in cart', async () => {

        await inventoryPage.addItemToCartByName(
            'Sauce Labs Backpack'
        );

        await inventoryPage.openCart();

        expect(
            await cartPage.hasItem(
                'Sauce Labs Backpack'
            )
        ).toBeTruthy();
    });

    test('should display multiple products', async () => {

        await inventoryPage.addMultipleItems([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie'
        ]);

        await inventoryPage.openCart();

        expect(
            await cartPage.getCartItemCount()
        ).toBe(3);
    });

    test('should remove product from cart', async () => {

        await inventoryPage.addItemToCartByName(
            'Sauce Labs Backpack'
        );

        await inventoryPage.openCart();

        await cartPage.removeItem(
            'Sauce Labs Backpack'
        );

        expect(
            await cartPage.getCartItemCount()
        ).toBe(0);
    });

    test('should remove all products', async () => {

        await inventoryPage.addAllItemsToCart();

        await inventoryPage.openCart();

        expect(
            await cartPage.getCartItemCount()
        ).toBe(6);

        await cartPage.removeAllItems();

        expect(
            await cartPage.getCartItemCount()
        ).toBe(0);
    });

    test('should continue shopping', async ({ page }) => {

        await inventoryPage.openCart();

        await cartPage.continueShopping();

        await expect(page)
            .toHaveURL(/inventory.html/);
    });

    test('should navigate to checkout', async ({ page }) => {

        await inventoryPage.addItemToCartByName(
            'Sauce Labs Backpack'
        );

        await inventoryPage.openCart();

        await cartPage.checkout();

        await expect(page)
            .toHaveURL(/checkout-step-one.html/);
    });

});