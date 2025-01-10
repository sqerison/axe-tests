
# WCAG Accessibility Tests with Puppeteer and axe-core

This repository contains automated tests for accessibility compliance based on WCAG 2.1 A and AA guidelines. The tests use Puppeteer to interact with web pages and axe-core to perform accessibility checks.

## Features

- **Multiple URL Testing**: Supports testing multiple pages in one run.
- **WCAG Compliance**: Ensures compliance with WCAG 2.1 A and AA levels.
- **Automated Login**: Automatically logs into pages if credentials are provided.
- **Detailed Summary**: Generates detailed test results for each URL in the console.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   TEST_SITE_URLS=https://example.com,https://example.com/page2
   TEST_USERNAME=your-username
   TEST_PASSWORD=your-password
   TEST_USERNAME_FIELD=input[name="username"]
   TEST_PASSWORD_FIELD=input[name="password"]
   TEST_SUBMIT_BUTTON=button[name="action"]
   TEST_HEADLESS=true
   ```

## Running the Tests

To run the tests, use the following command:
```bash
npm test
```

### Generate an HTML Report
To generate an HTML report, install `jest-html-reporter` and configure it:
```bash
npm install jest-html-reporter --save-dev
```

Then add the following configuration in your `jest.config.js` or `jest-html-reporter.config.js`:
```javascript
module.exports = {
    outputPath: './reports/test-report.html',
    pageTitle: 'Accessibility Test Report',
    includeFailureMsg: true,
    theme: 'defaultTheme',
};
```

Run the tests with:
```bash
npm run test:report
```

## How It Works

1. **Puppeteer**:
   - Launches a browser and navigates to each URL.
   - Logs into pages if login credentials are provided.

2. **axe-core**:
   - Injects axe-core into the page and runs accessibility checks for WCAG 2.1 A and AA levels.

3. **Results**:
   - Logs violations and passes for each page.
   - Generates a summary table with violations across all tested URLs.

## Output Example

### Individual Results
```plaintext
Results for https://example.com:
┌─────────┬──────────────┬─────────────┬─────────────────────────────────────────┐
│ (index) │    Rule      │   Status    │              Description               │
├─────────┼──────────────┼─────────────┼─────────────────────────────────────────┤
│    0    │ color-contrast │ ✔ Passed  │ Ensures text elements have sufficient  │
│    1    │ label          │ ✖ Violated│ Ensures every form element has a label │
└─────────┴──────────────┴─────────────┴─────────────────────────────────────────┘
```

### Summary
```plaintext
Summary of Accessibility Tests:
┌───────────────┬──────────────┬──────────────────────────────┬───────────┬─────────────────────────────┐
│      URL      │     Rule     │         Description          │  Impact   │           Elements          │
├───────────────┼──────────────┼──────────────────────────────┼───────────┼─────────────────────────────┤
│ example.com   │ label        │ Ensures every form element…  │ critical  │ #email, #password           │
│ example.com   │ color-contrast │ Ensures text elements…     │ serious   │ .header, .button            │
└───────────────┴──────────────┴──────────────────────────────┴───────────┴─────────────────────────────┘
```

## Contribution

Feel free to submit issues or pull requests for improvements.

## License

This project is licensed under the MIT License.
