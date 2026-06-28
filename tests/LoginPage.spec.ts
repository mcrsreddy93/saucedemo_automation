import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  const ERROR_MESSAGES = {
    LOCKED_OUT:
      'Epic sadface: Sorry, this user has been locked out.',
    USERNAME_REQUIRED:
      'Epic sadface: Username is required',
    PASSWORD_REQUIRED:
      'Epic sadface: Password is required',
    INVALID_CREDENTIALS:
      'Epic sadface: Username and password do not match any user in this service',
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory.html/);
  });

  test('should display error for locked out user', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    expect(await loginPage.getErrorMessage()).toBe(
      ERROR_MESSAGES.LOCKED_OUT
    );
  });

  const invalidLoginScenarios = [
    {
      testName: 'should display username required error when username is empty',
      username: '',
      password: 'secret_sauce',
      expectedError: ERROR_MESSAGES.USERNAME_REQUIRED,
    },
    {
      testName: 'should display password required error when password is empty',
      username: 'standard_user',
      password: '',
      expectedError: ERROR_MESSAGES.PASSWORD_REQUIRED,
    },
    {
      testName: 'should display username required error when username and password are empty',
      username: '',
      password: '',
      expectedError: ERROR_MESSAGES.USERNAME_REQUIRED,
    },
    {
      testName: 'should display invalid credentials error for invalid username',
      username: 'james',
      password: 'secret_sauce',
      expectedError: ERROR_MESSAGES.INVALID_CREDENTIALS,
    },
    {
      testName: 'should display invalid credentials error for invalid password',
      username: 'standard_user',
      password: 'james',
      expectedError: ERROR_MESSAGES.INVALID_CREDENTIALS,
    },
  ];

  for (const scenario of invalidLoginScenarios) {
    test(scenario.testName, async () => {
      await loginPage.login(scenario.username, scenario.password);

      expect(await loginPage.getErrorMessage()).toBe(
        scenario.expectedError
      );
    });
  }

});