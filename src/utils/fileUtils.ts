import fs from "fs";
import path from "path";

const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

// 确保文件所在目录存在
function makeSureDirectionExist(filePath:string){
    const realPath = resolveApp(filePath);
    const fileName: string = realPath.split("\\").pop() || "";
    const directoryPath = realPath.substr(0, realPath.length - fileName.length - 1);
    fs.mkdirSync(directoryPath, {recursive: true});
}

export function writeFileSync(filePath: string, content: string) {
    makeSureDirectionExist(filePath);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    fs.writeFileSync(resolveApp(filePath), content, {'flag': 'a'});
}

