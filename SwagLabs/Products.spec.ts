import { test, expect, Page } from '@playwright/test';

test.describe.serial(() => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        await page.goto('https://www.saucedemo.com');
        await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
        await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Products')).toBeVisible();
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('Check the product details', async () => {
        await page.locator('[data-test="item-4-title-link"]').click();
        await expect(page.locator('[data-test="inventory-item-desc"]')).toContainText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.');
        await page.screenshot({ path: 'Screenshot/TC_Products_001.png' });
    });

    test('Check adding 1 item to cart', async () => {
        await page.locator('[data-test="add-to-cart"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1');
        await page.screenshot({ path: 'Screenshot/TC_Products_002.png' });
    });

    test('Check if you have added more than one item to your cart', async () => {
        await page.locator('[data-test="back-to-products"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('3');
        await page.screenshot({ path: 'Screenshot/TC_Products_003.png' });
    });

    test('Check to remove items from the cart', async () => {
        await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('2');
        await expect(page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')).toBeVisible();
        await page.screenshot({ path: 'Screenshot/TC_Products_004.png' });
    });

    test('Check the product details in the shopping cart', async () => {
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
        await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible();
        await page.screenshot({ path: 'Screenshot/TC_Products_005.png' });
    });

    test('', async() =>{

    })
});