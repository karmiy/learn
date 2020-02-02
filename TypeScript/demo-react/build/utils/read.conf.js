const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../README.md');
const targetPath = path.join(__dirname, '../../publish/README.md');

fs.readFile(filePath, (err, data) => {
    if(err) {
        console.log('load failed README.md', err);
        return;
    }
    const text = data.toString().replace(
        '![logo](./src/assets/imgs/logo-small.png "Kealm React Components")',
        '# Kealm React Components'
    );
    fs.writeFile(targetPath, text, err => {
        if(err) {
            console.log('write failed README.md', err);
        }
    })
})
