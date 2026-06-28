import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {

    // Step One
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly postalCode: Locator;

    readonly continueButton: Locator;
    readonly cancelButton: Locator;
    readonly errorMessage: Locator;

    // Step Two
    readonly finishButton: Locator;

    readonly subtotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;

    // Complete Page
    readonly completeHeader: Locator;
    readonly completeText: Locator;
    readonly backHomeButton: Locator;

    constructor(page: Page) {
        super(page);

        this.firstName = page.locator('[data-test="firstName"]');
        this.lastName = page.locator('[data-test="lastName"]');
        this.postalCode = page.locator('[data-test="postalCode"]');

        this.continueButton = page.locator('[data-test="continue"]');
        this.cancelButton = page.locator('[data-test="cancel"]');

        this.errorMessage = page.locator('[data-test="error"]');

        this.finishButton = page.locator('[data-test="finish"]');

        this.subtotalLabel = page.locator('.summary_subtotal_label');
        this.taxLabel = page.locator('.summary_tax_label');
        this.totalLabel = page.locator('.summary_total_label');

        this.completeHeader = page.locator('.complete-header');
        this.completeText = page.locator('.complete-text');

        this.backHomeButton = page.locator('[data-test="back-to-products"]');
    }

    // ============================================
    // Step One
    // ============================================

    async fillCheckoutInformation(
        first: string,
        last: string,
        zip: string
    ): Promise<void> {

        await this.firstName.fill(first);
        await this.lastName.fill(last);
        await this.postalCode.fill(zip);
    }

    async continueCheckout(): Promise<void> {
        await this.continueButton.click();
    }

    async cancelCheckout(): Promise<void> {
        await this.cancelButton.click();
    }

    async submitCheckout(
        first: string,
        last: string,
        zip: string
    ): Promise<void> {

        await this.fillCheckoutInformation(
            first,
            last,
            zip
        );

        await this.continueCheckout();
    }

    async getErrorMessage(): Promise<string> {

        return await this.errorMessage.textContent() ?? '';
    }

    // ============================================
    // Step Two
    // ============================================

    async finishCheckout(): Promise<void> {
        await this.finishButton.click();
    }

    async getSubtotal(): Promise<string> {
        return await this.subtotalLabel.textContent() ?? '';
    }

    async getTax(): Promise<string> {
        return await this.taxLabel.textContent() ?? '';
    }

    async getTotal(): Promise<string> {
        return await this.totalLabel.textContent() ?? '';
    }

    // ============================================
    // Complete Page
    // ============================================

    async verifyOrderCompleted(): Promise<void> {

        await expect(this.completeHeader)
            .toHaveText('Thank you for your order!');

        await expect(this.completeText)
            .toBeVisible();
    }

    async backHome(): Promise<void> {
        await this.backHomeButton.click();
    }

}