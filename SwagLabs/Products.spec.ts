import { test, expect, Page } from '@playwright/test';

test.describe.serial(() => {
    let page: Page;
    const first_name = 'Error: First Name is required';
    const last_name = 'Error: Last Name is required';
    const complete = 'Thank you for your order!';
    const price = 29.99;
    const total = price * 1.08;

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

    test('TC_Products_001 : Check the product details', async () => {
        await page.locator('[data-test="item-4-title-link"]').click();
        await expect(page.locator('[data-test="inventory-item-desc"]')).toContainText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.');
        await page.screenshot({ path: 'Screenshot/TC_Products_001.png' });
    });

    test('TC_Products_002 : Check adding 1 item to cart', async () => {
        await page.locator('[data-test="add-to-cart"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1');
        await page.screenshot({ path: 'Screenshot/TC_Products_002.png' });
    });

    test('TC_Products_003 : Check if you have added more than one item to your cart', async () => {
        await page.locator('[data-test="back-to-products"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('3');
        await page.screenshot({ path: 'Screenshot/TC_Products_003.png' });
    });

    test('TC_Products_004 : Check to remove items from the cart', async () => {
        await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('2');
        await expect(page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')).toBeVisible();
        await page.screenshot({ path: 'Screenshot/TC_Products_004.png' });
    });

    test('TC_Products_005 : Check the product details in the shopping cart', async () => {
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
        await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible();
        await page.screenshot({ path: 'Screenshot/TC_Products_005.png' });
    });

    test('TC_Products_006 : Check the deletion of items in the cart', async() =>{
        await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
        await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack');
        await page.screenshot({ path: 'Screenshot/TC_Products_006.png' });
    })

    test('TC_Products_007 : Check back to the product page', async() =>{
        await page.locator('[data-test="continue-shopping"]').click();
        await expect(page.getByText('carry.allTheThings() with the')).toBeVisible();
        await page.screenshot({ path: 'Screenshot/TC_Products_007.png' });
    })

    test('TC_Products_008 : Verify payment', async() =>{
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();
        await expect(page.locator('[data-test="firstName"]')).toBeVisible();
        await expect(page.locator('[data-test="lastName"]')).toBeVisible();
        await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
        await page.screenshot({ path: 'Screenshot/TC_Products_008.png' });
    })

    test('TC_Products_009 : Check payment cancellation', async() =>{
        await page.locator('[data-test="cancel"]').click();
        await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack');
        await expect(page.getByText('carry.allTheThings() with the')).toBeVisible();
        await page.screenshot({ path: 'Screenshot/TC_Products_009.png' });
    })

    test('TC_Products_010 : Check the payment details if they are not filled in.', async() =>{
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="error"]')).toContainText(first_name);
        await page.screenshot({ path: 'Screenshot/TC_Products_010.png' });
    })

    test('TC_Products_011 : Check the payment details if some details are filled in.', async() =>{
        await page.locator('[data-test="firstName"]').fill('test');
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="error"]')).toContainText(last_name);
        await page.screenshot({ path: 'Screenshot/TC_Products_011.png' });
    })

    test('TC_Products_012 : Check the payment details entered correctly and completely.', async() =>{
        await page.locator('[data-test="lastName"]').fill('automate');
        await page.locator('[data-test="postalCode"]').fill('1234567890');
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack');
        await expect(page.getByText('carry.allTheThings() with the')).toBeVisible();
        await expect(page.locator('[data-test="subtotal-label"]')).toContainText('Item total: $'+price );
        await expect(page.locator('[data-test="total-label"]')).toContainText('Total: $'+total.toFixed(2));
        await page.screenshot({ path: 'Screenshot/TC_Products_012.png' });
    })

    test('TC_Products_013 : Check order cancellation on the Order Overview page.', async() =>{
        await page.locator('[data-test="cancel"]').click();
        await expect(page.getByText('carry.allTheThings() with the')).toBeVisible();
        await page.screenshot({ path: 'Screenshot/TC_Products_013.png' });
    })

    test('TC_Products_014 : Verify successful purchase', async() =>{
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').fill('test');
        await page.locator('[data-test="lastName"]').fill('Automate');
        await page.locator('[data-test="postalCode"]').fill('1234567890');
        await page.locator('[data-test="continue"]').click();
        await page.locator('[data-test="finish"]').click();
        await expect(page.locator('[data-test="complete-header"]')).toContainText(complete);
        await page.screenshot({ path: 'Screenshot/TC_Products_014.png' });
    })

    test('TC_Products_015 : Check logout', async() =>{
        await page.locator('[data-test="back-to-products"]').click();
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await page.locator('[data-test="logout-sidebar-link"]').click();
        await page.screenshot({ path: 'Screenshot/TC_Products_015.png' });
    })
});