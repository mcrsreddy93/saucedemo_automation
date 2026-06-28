import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout', () => {

    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {

        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await loginPage.goto();

        await loginPage.login(
            'standard_user',
            'secret_sauce'
        );

        await inventoryPage.addItemToCartByName(
            'Sauce Labs Backpack'
        );

        await inventoryPage.openCart();

        await cartPage.checkout();
    });

    test('should complete checkout successfully', async ({ page }) => {

        await checkoutPage.submitCheckout(
            'John',
            'Doe',
            '500081'
        );

        await checkoutPage.finishCheckout();

        await checkoutPage.verifyOrderCompleted();

        await expect(page)
            .toHaveURL(/checkout-complete.html/);
    });

    test('should show error when first name is empty', async () => {

        await checkoutPage.submitCheckout(
            '',
            'Doe',
            '500081'
        );

        await expect(checkoutPage.errorMessage)
            .toContainText('First Name');
    });

    test('should show error when last name is empty', async () => {

        await checkoutPage.submitCheckout(
            'John',
            '',
            '500081'
        );

        await expect(checkoutPage.errorMessage)
            .toContainText('Last Name');
    });

    test('should show error when postal code is empty', async () => {

        await checkoutPage.submitCheckout(
            'John',
            'Doe',
            ''
        );

        await expect(checkoutPage.errorMessage)
            .toContainText('Postal Code');
    });

    test('should cancel checkout', async ({ page }) => {

        await checkoutPage.cancelCheckout();

        await expect(page)
            .toHaveURL(/cart.html/);
    });

    test('should display subtotal', async () => {

        await checkoutPage.submitCheckout(
            'John',
            'Doe',
            '500081'
        );

        expect(await checkoutPage.getSubtotal())
            .toContain('Item total');
    });

    test('should display tax', async () => {

        await checkoutPage.submitCheckout(
            'John',
            'Doe',
            '500081'
        );

        expect(await checkoutPage.getTax())
            .toContain('Tax');
    });

    test('should display total', async () => {

        await checkoutPage.submitCheckout(
            'John',
            'Doe',
            '500081'
        );

        expect(await checkoutPage.getTotal())
            .toContain('Total');
    });

    test('should return to products page after order', async ({ page }) => {

        await checkoutPage.submitCheckout(
            'John',
            'Doe',
            '500081'
        );

        await checkoutPage.finishCheckout();

        await checkoutPage.backHome();

        await expect(page)
            .toHaveURL(/inventory.html/);
    });

});