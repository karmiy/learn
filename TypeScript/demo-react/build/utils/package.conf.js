const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../package.json');
const targetPath = path.join(__dirname, '../../publish/package.json');

fs.readFile(filePath, (err, data) => {
    if(err) {
        console.log('load failed package.json', err);
        return;
    }
    const config = JSON.parse(data.toString());
    // 删除scripts
    delete config['scripts'];
    // 删除devDependencies
    delete config['devDependencies'];
    // 删除dependencies中的无用项
    delete config['dependencies']['@babel/polyfill'];
    delete config['dependencies']['@babel/runtime'];
    delete config['dependencies']['@babel/runtime-corejs3'];
    delete config['dependencies']['@hot-loader/react-dom'];
    delete config['dependencies']['core-js'];
    delete config['dependencies']['react'];
    delete config['dependencies']['react-dom'];
    delete config['dependencies']['react-router-dom'];
    fs.writeFile(targetPath, JSON.stringify(config, null ,4), err => {
        if(err) {
            console.log('write failed package.json', err);
        }
    })
})
