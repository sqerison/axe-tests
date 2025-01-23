module.exports = {
    testEnvironment: 'node',
    outputPath: './test-report.html', // Path to generate the report
    pageTitle: 'Accessibility Test Report',
    includeFailureMsg: true, // Include failure messages
    theme: 'defaultTheme',

    reporters: [
        'default',
        [
            // Path to our custom reporter file:
            './axe-junit-reporter.js',
            // Pass options to our custom reporter:
            {
                outputPath: 'junit-axe-report.xml',
                suiteName: 'Accessibility Tests (JUnit)',
                className: 'WCAG-Accessibility',
            },
        ],
    ],
};
