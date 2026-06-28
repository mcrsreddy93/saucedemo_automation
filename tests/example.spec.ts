import {test,expect} from   '@playwright/test';

test.skip("example", async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button',{name:'Login'}).click();
    await page.waitForURL("https://www.saucedemo.com/inventory.html");
    const text =  await page.locator(`.inventory_item:has-text("Sauce Labs Bike Light")`).textContent();
    console.log(text);

});