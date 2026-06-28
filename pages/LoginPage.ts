import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;
    private readonly errorCloseButton:Locator;
    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.locator('[data-test="error"]');
        this.errorCloseButton = page.locator("//button[@class='error-button']");
    }
    async goto(): Promise<void>{
        this.page.goto('https://www.saucedemo.com/');
    }
    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
    async getErrorMessage(): Promise<string> {
        return await this.errorMessage.textContent() || '';
    }
    async isErrorVisible(): Promise<boolean> {
        return await this.errorMessage.isVisible();
    }

    async closeErrorMessage():Promise<void>{
        this.errorCloseButton.click();
    }

    async isErrorMessageAvailable():Promise<boolean>{
        return await this.errorMessage.isVisible();
    }
}