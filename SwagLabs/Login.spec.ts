import { test, expect } from '@playwright/test';

const loginCases = [
  {
    name: 'Check login if Username and Password are not entered.',
    user: '',
    pass: '',
    expectedError: 'Epic sadface: Username is required'
  },
  {
    name: 'Check login if partial information is entered',
    user: 'standard_user',
    pass: '',
    expectedError: 'Epic sadface: Password is required'
  },
  {
    name: 'Check login information if it is incorrect.',
    user: 'standard_user',
    pass: '12345678',
    expectedError: 'Epic sadface: Username and password do not match any user in this service'
  },
  {
    name: 'Check login if user entry is locked',
    user: 'locked_out_user',
    pass: 'secret_sauce',
    expectedError: 'Epic sadface: Sorry, this user has been locked out.'
  },
  {
    name: 'Check login for SQL Injection',
    user: 'standard_user',
    pass: "' OR 1=1 --",
    expectedError: 'Epic sadface: Username and password do not match any user in this service'
  },
  {
    name: 'Verify login if the phone number or email address and password are correct.',
    user: 'standard_user',
    pass: 'secret_sauce',
    expectedError: null 
  }
];

loginCases.forEach((c, index) => {
  test(`${c.name}`, async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByRole('textbox', { name: 'Username' }).fill(c.user);
    await page.getByRole('textbox', { name: 'Password' }).fill(c.pass);
    await page.getByRole('button', { name: 'Login' }).click();

    const fileName = `Screenshot/TC_Login_${String(index + 1).padStart(3, '0')}.png`;  //Screenshot name, set to 3 positions from 000 - 999.
    await page.screenshot({ path: fileName });

    if (c.expectedError !== null) {
      await expect(page.getByText(c.expectedError)).toBeVisible();  //Check expectedError
    } else {
      await expect(page.getByText('Products')).toBeVisible();  //wait test on website
    }
    await page.close();
  });
});
