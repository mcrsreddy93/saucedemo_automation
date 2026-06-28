import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Inventory Page', () => {

    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {

        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);

        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.waitForInventoryPage();
    });

    test('should load inventory page successfully', async ({ page }) => {

        await inventoryPage.verifyInventoryPageLoaded();

        await expect(page).toHaveTitle(/Swag Labs/);
    });

    test('should display six inventory products', async () => {

        expect(await inventoryPage.getProductCount()).toBe(6);
    });

    test('should display all expected product names', async () => {

        const names = await inventoryPage.getProductNames();

        expect(names).toEqual([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)'
        ]);
    });

    test('should display valid prices for every product', async () => {

        const prices = await inventoryPage.getProductPrices();

        expect(prices.length).toBe(6);

        for (const price of prices) {
            expect(price).toBeGreaterThan(0);
        }
    });

    test('should add one item to cart', async () => {

        await inventoryPage.addItemToCartByName('Sauce Labs Backpack');

        expect(await inventoryPage.getCartItemCount()).toBe(1);

        await inventoryPage.verifyRemoveButtonVisible('Sauce Labs Backpack');
    });

    test('should remove one item from cart', async () => {

        const product = 'Sauce Labs Backpack';

        await inventoryPage.addItemToCartByName(product);

        expect(await inventoryPage.getCartItemCount()).toBe(1);

        await inventoryPage.removeItemFromCartByName(product);

        expect(await inventoryPage.getCartItemCount()).toBe(0);

        await inventoryPage.verifyAddButtonVisible(product);
    });

    test('should add multiple products', async () => {

        await inventoryPage.addMultipleItems([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie'
        ]);

        expect(await inventoryPage.getCartItemCount()).toBe(3);
    });

    test('should remove multiple products', async () => {

        const items = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie'
        ];

        await inventoryPage.addMultipleItems(items);

        expect(await inventoryPage.getCartItemCount()).toBe(3);

        await inventoryPage.removeMultipleItems(items);

        expect(await inventoryPage.getCartItemCount()).toBe(0);
    });

    test('should add all inventory items', async () => {

        await inventoryPage.addAllItemsToCart();

        expect(await inventoryPage.getCartItemCount()).toBe(6);
    });

    test('should remove all inventory items', async () => {

        await inventoryPage.addAllItemsToCart();

        expect(await inventoryPage.getCartItemCount()).toBe(6);

        await inventoryPage.removeAllItemsFromCart();

        expect(await inventoryPage.getCartItemCount()).toBe(0);
    });

    test('should display cart badge after adding product', async () => {

        await inventoryPage.addItemToCartByName('Sauce Labs Backpack');

        expect(await inventoryPage.isCartBadgeVisible()).toBeTruthy();
    });

    test('should hide cart badge after removing last product', async () => {

        await inventoryPage.addItemToCartByName('Sauce Labs Backpack');

        await inventoryPage.removeItemFromCartByName('Sauce Labs Backpack');

        expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();
    });

    test('should open cart page', async ({ page }) => {

        await inventoryPage.openCart();

        await expect(page).toHaveURL(/cart.html/);
    });

    test('should open product details page', async ({ page }) => {

        await inventoryPage.openProduct('Sauce Labs Backpack');

        await expect(page).toHaveURL(/inventory-item.html/);
    });

    test('should verify product exists', async () => {

        expect(await inventoryPage.hasProduct('Sauce Labs Backpack')).toBeTruthy();
    });

    test('should sort products from A to Z', async () => {

        await inventoryPage.sortByNameAZ();

        const names = await inventoryPage.getProductNames();

        const sorted = [...names].sort();

        expect(names).toEqual(sorted);
    });

    test('should sort products from Z to A', async () => {

        await inventoryPage.sortByNameZA();

        const names = await inventoryPage.getProductNames();

        const sorted = [...names].sort().reverse();

        expect(names).toEqual(sorted);
    });

    test('should sort prices from low to high', async () => {

        await inventoryPage.sortByPriceLowToHigh();

        const prices = await inventoryPage.getProductPrices();

        expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test('should sort prices from high to low', async () => {

        await inventoryPage.sortByPriceHighToLow();

        const prices = await inventoryPage.getProductPrices();

        expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });

    test('should logout successfully', async ({ page }) => {

        await inventoryPage.logout();

        await expect(page).toHaveURL(/\/$/);
    });

});