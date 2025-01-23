const builder = require('junit-report-builder');

class AxeJUnitReporter {
    constructor(globalConfig, options = {}) {
        // You can configure the output file from `options.outputPath`
        // in the jest.config.js (or wherever you declare the reporter).
        this._globalConfig = globalConfig;
        this._options = options;
        // Default path if none specified
        this._outputPath = options.outputPath || 'junit-axe-report.xml';
        this._suiteName = options.suiteName || 'Accessibility Tests (JUnit)';
        this._className = options.className || 'WCAG-Accessibility';
    }

    /**
     * Called when all tests have finished running.
     * See: https://jestjs.io/docs/en/configuration#reporters-arraymodulename--modulename-options
     */
    onRunComplete(contexts, results) {
        // Create a test suite
        const suite = builder.testSuite().name(this._suiteName);

        // results.testResults is an array of test file results
        // Each item has .testResults: an array of individual test cases
        results.testResults.forEach((testFileResult) => {
            const testFilePath = testFileResult.testFilePath;

            testFileResult.testResults.forEach((testCaseResult) => {
                const { title, fullName, status, failureMessages } = testCaseResult;

                // Create a JUnit test case
                const testCase = suite
                    .testCase()
                    .className(this._className)
                    // The "name" could be the test case name or the full "describe" path
                    .name(fullName || title);

                // Mark as failed if status === 'failed'
                if (status === 'failed') {
                    // Join all failure messages
                    const message = failureMessages.join('\n');
                    testCase.failure(message);
                }
            });
        });

        // Write to disk
        builder.writeTo(this._outputPath);
        console.log(`\nJUnit report generated at: ${this._outputPath}`);
    }
}

module.exports = AxeJUnitReporter;