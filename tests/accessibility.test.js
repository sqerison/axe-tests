const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const dotenv = require('dotenv');

// Load .env variables
dotenv.config();

// Retrieve environment variables or use defaults
const urls = (process.env.TEST_SITE_URLS || 'https://google.com').split(','); // Accept comma-separated URLs
const username = process.env.TEST_USERNAME || null;
const password = process.env.TEST_PASSWORD || null;
const usernameField = process.env.TEST_USERNAME_FIELD || 'input[name="username"]';
const passwordField = process.env.TEST_PASSWORD_FIELD || 'input[name="password"]';
const submitButton = process.env.TEST_SUBMIT_BUTTON || 'button[name="action"]';
const headless = process.env.TEST_HEADLESS || true;

// Accessibility Test Suite
describe('WCAG Accessibility Tests', () => {
    let browser;
    const allResults = []; // Store results for summary

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: headless, // Set to true for CI/CD environments
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    });

    afterAll(async () => {
        await browser.close();

        // Summary report in table format
        const summaryTable = [];
        allResults.forEach((result) => {
            result.violations.forEach((violation) => {
                summaryTable.push({
                    URL: result.url,
                    Rule: violation.id,
                    Description: violation.description,
                    Impact: violation.impact,
                    Elements: violation.nodes.map((node) => node.target).join(', '),
                });
            });
        });

        console.log('\nSummary of Accessibility Tests:');
        if (summaryTable.length > 0) {
            console.table(summaryTable);
        } else {
            console.log('No violations detected.');
        }
    });

    const performLogin = async (page) => {
        // Check if login is required
        const loginRequired = await page.$(submitButton);
        if (loginRequired && username && password) {
            console.log('Credentials provided. Proceeding with login...');

            // Wait for login page to load
            await page.waitForSelector(usernameField, { timeout: 60000 });
            console.log('Login page detected.');

            // Fill in login credentials
            await page.type(usernameField, username);
            await page.type(passwordField, password);

            // Submit the login form
            await page.evaluate((selector) => {
                document.querySelector(selector).click();
            }, submitButton);

            console.log('Login form submitted.');

            // Wait for navigation back to the target page
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
            console.log(`Successfully redirected to: ${page.url()}`);
        } else {
            console.log('No credentials provided. Skipping login process.');
        }
    };

    test.each(urls)('Check accessibility for %s', async (url) => {
        console.log(`Testing accessibility for: ${url}`);

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // If credentials are provided, perform login
        if (username && password) {
            await performLogin(page);
        }

        // Inject axe-core into the page
        await page.addScriptTag({ path: require.resolve('axe-core') });

        // Run axe-core tests with WCAG 2.1 A and AA configuration
        const results = await page.evaluate(async () => {
            const config = {
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a', 'wcag2aa'], // Include only WCAG A and AA rules
                },
            };
            return await axe.run(document, config);
        });

        // Create a compact table format for individual results
        const formattedResults = [];
        results.passes.forEach((pass) => {
            formattedResults.push({
                Rule: pass.id,
                Status: '✔ Passed',
                Description: pass.description,
            });
        });

        results.violations.forEach((violation) => {
            formattedResults.push({
                Rule: violation.id,
                Status: '✖ Violated',
                Description: violation.description,
            });
        });

        // Log results as a table
        console.log(`Results for ${url}:`);
        console.table(formattedResults);

        // Add results to the summary
        allResults.push({ url, violations: results.violations });

        // Assert that there are no violations
        expect(results.violations.length).toBe(0);

        await page.close();
    }, 30000); // Set timeout to 30 seconds for this test
});