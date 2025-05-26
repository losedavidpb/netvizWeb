const fs = require('fs');
const cheerio = require('cheerio');

fs.readFile('./reports/eslint.html', 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading ESLint report:', err);
        return;
    }

    const $ = cheerio.load(data);

    // Replace the long date with a simpler one
    $('div').each(function () {
        const spanText = $(this).find('div').text();

        if (spanText && spanText.includes('Generated on')) {
            const dateRegex = /Generated on (\w{3} \w{3} \d{1,2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4})/;
            const match = spanText.match(dateRegex);

            if (match && match[1]) {
                const dateObj = new Date(match[1]);

                const simplifiedDate = dateObj.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });

                const newText = spanText.replace(/Generated on .*/, `Generated on ${simplifiedDate}`);
                $(this).find('div').text(newText);
            }
        }
    });

    // Remove absolute paths for each file
    $('th').each(function () {
        const currentText = $(this).text();
        const index = currentText.indexOf('src\\');
        const fileName = index !== -1 ? currentText.slice(index) : currentText;

        $(this).text(`[+] ${fileName}`);
    });

    fs.writeFile('./reports/eslint.html', $.html(), (err) => {
        if (err) {
            console.error('Error saving custom report:', err);
        }
    });
});