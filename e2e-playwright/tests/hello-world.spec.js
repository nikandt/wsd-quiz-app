const { test, expect } = require("@playwright/test");

test("Main page has expected title and links", async ({ page }) => {
    await page.goto("http://localhost:7777/");
    await expect(page).toHaveTitle("Quizes!");

    const expectedLinks = ['/', '/topics', '/quiz', '/auth/register', '/auth/login'];
    const actualLinks = await page.$$eval('a', anchors => anchors.map(anchor => anchor.getAttribute('href')));

    for (const expected of expectedLinks) {
        expect(actualLinks).toContain(expected);
    }
    await page.goto("http://localhost:7777/reset");
});

test("Main page has 'Statistics:' h2 and two <p> elements below it", async ({ page }) => {
    await page.goto("http://localhost:7777/");

    const h2Element = await page.locator('h2:text("Statistics:")');
    const h2Count = await h2Element.count();
    expect(h2Count).toBe(1);

    const parentElement = await h2Element.locator('..');

    const pElements = await parentElement.locator('p');
    const pCount = await pElements.count();

    expect(pCount).toBe(5);
});
  

test("Navigate to login, fill out the form, and redirect to /topics", async ({ page }) => {
    await page.goto("http://localhost:7777/");
    await page.click('a[href="/auth/login"]');

    const formElement = await page.locator('form[action="/auth/login"]');
    expect(await formElement.count()).toBe(1);

    await page.fill('input[type="email"][name="email"]', 'admin@admin.com');
    await page.fill('input[type="password"][name="password"]', '123456');

    await Promise.all([
        page.waitForNavigation(),
        formElement.locator('input[type="submit"]').click()
    ]);

    expect(page.url()).toBe('http://localhost:7777/topics');
});
  

test("Unauthenticated scenarios: redirect and failed login", async ({ page }) => {
    await page.goto("http://localhost:7777/topics");
    expect(page.url()).toBe("http://localhost:7777/auth/login");

    await page.fill('input[type="email"][name="email"]', 'admin@admin.com');
    await page.fill('input[type="password"][name="password"]', 'wrong_password');

    const formElement = await page.locator('form[action="/auth/login"]');
    await Promise.all([
        page.waitForNavigation(),
        formElement.locator('input[type="submit"]').click()
    ]);

    expect(page.url()).toBe("http://localhost:7777/auth/login");
});

test("Submit a new topic and validate it appears on the page", async ({ page }) => {
    await loginUser(page);

    await page.goto("http://localhost:7777/topics");

    await page.fill('input[type="text"][name="name"]', "test_subject");

    const formElement = await page.locator('form[action="/topics"]');
    await Promise.all([
        page.waitForNavigation(), 
        formElement.locator('input[type="submit"]').click()
    ]);

    const subjectText = await page.textContent('body'); 
    expect(subjectText).toContain("test_subject");
});

test("Submit a new question and validate it appears on the page", async ({ page }) => {
    await loginUser(page);

    await page.goto("http://localhost:7777/topics");

    await page.click(`a:text("test_subject")`);
    await page.fill('input[type="text"][name="question_text"]', "Do apples exist?");
    const questionFormElement = await page.locator(`form[method="POST"]`);
    await Promise.all([
        page.waitForNavigation(),
        questionFormElement.locator('input[type="submit"]').click()
    ]);

    const questionText = await page.textContent('body'); 
    expect(questionText).toContain("Do apples exist?");
});
  
test("Submit new answer options and validate they appear on the page", async ({ page }) => {
    await loginUser(page);

    await page.goto("http://localhost:7777/topics");
    await page.click(`a:text("test_subject")`);

    await page.click(`a:text("Do apples exist?")`);

    await page.fill('input[type="text"][name="option_text"]', "Yes");
    await page.check('input[type="checkbox"][name="is_correct"]');

    await Promise.all([
        page.waitForNavigation(),
        page.click('input[type="submit"][value="Submit answer option"]')
    ]);

    let bodyText = await page.textContent('body'); 
    expect(bodyText).toContain("Yes");

    await page.fill('input[type="text"][name="option_text"]', "No");
    await Promise.all([
        page.waitForNavigation(),
        page.click('input[type="submit"][value="Submit answer option"]')
    ]);

    bodyText = await page.textContent('body'); 
    expect(bodyText).toContain("No");
});

test("Navigate to quiz page and answer a question", async ({ page }) => {
    await loginUser(page);

    await page.goto("http://localhost:7777/quiz");

    let bodyText = await page.textContent('body');
    expect(bodyText).toContain("test_subject");

    await page.click(`a:text("test_subject")`);

    bodyText = await page.textContent('body');
    expect(bodyText).toContain("Do apples exist?");

    expect(bodyText).toContain("Yes");
    expect(bodyText).toContain("No");

    await Promise.all([
        page.waitForNavigation(),
        page.click(`input[type="submit"][value="Choose"]:nth-child(1)`)
    ]);

    bodyText = await page.textContent('body');
    expect(bodyText).toContain("Correct");
});

test("Navigate to quiz page and answer a question incorrectly", async ({ page }) => {
    await loginUser(page);
    await page.goto("http://localhost:7777/quiz");
    await page.click(`a:text("test_subject")`);

    
    await Promise.all([
        page.waitForNavigation(),
        page.click('#No input[type="submit"]')
    ]);

    let bodyText = await page.textContent('body');
    expect(bodyText).toContain("Incorrect!");
    expect(bodyText).toContain("The correct option was Yes");
});

test("Delete options and question, validate they are removed", async ({ page }) => {
    await loginUser(page);

    await page.goto("http://localhost:7777/topics");
    await page.click(`a:text("test_subject")`);

    await page.click(`a:text("Do apples exist?")`);

    await Promise.all([
        page.waitForNavigation(),
        page.click('input[type="submit"][value="Delete option"]')
    ]);

    await Promise.all([
        page.waitForNavigation(),
        page.click('input[type="submit"][value="Delete option"]')
    ]);

    await Promise.all([
        page.waitForNavigation(),
        page.click('input[type="submit"][value="Delete question"]')
    ]);

    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain("Do apples exist?");
});



// Helper function to test features that require login
async function loginUser(page) {
    await page.goto("http://localhost:7777/auth/login");
    await page.fill('input[type="email"][name="email"]', 'admin@admin.com');
    await page.fill('input[type="password"][name="password"]', '123456');

    const formElement = await page.locator('form[action="/auth/login"]');
    await Promise.all([
        page.waitForNavigation(),
        formElement.locator('input[type="submit"]').click()
    ]);
}