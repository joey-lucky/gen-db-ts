const fs = require('fs')
const path = require('path')


const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

fs.mkdirSync("./t1/t2/t2/abc.bat",{recursive: true });

console.log(resolveApp("src"))