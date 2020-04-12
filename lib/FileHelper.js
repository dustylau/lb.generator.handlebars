const { FileInformation } = require("./FileInformation");
const fs = require("fs");
class FileHelper {
    static getFilesSync(directoryPath, recurse, options) {
        const ignoreList = options && options.ignoreList && Array.isArray(options.ignoreList) ? options.ignoreList : [];
        const includeList = options && options.includeList && Array.isArray(options.includeList) ? options.includeList : [];
        const lastCharacter = directoryPath.substring(directoryPath.length - 1);
        if (lastCharacter !== '/' && lastCharacter !== '\\')
            directoryPath = directoryPath + '/';
        const files = [];
        const contents = fs.readdirSync(directoryPath, { withFileTypes: true });
        for (const item of contents) {
            if (ignoreList
                && ignoreList.length > 0
                && (ignoreList.find(i => i === item.name)
                    || ignoreList.find(i => item.name.match(i)))) {
                continue;
            }
            if (item.isFile()
                && includeList
                && includeList.length > 0
                && !includeList.find(i => i === item.name)
                && !includeList.find(i => item.name.match(i))) {
                continue;
            }
            if (item.isFile())
                files.push(directoryPath + item.name);
            if (item.isDirectory() && recurse) {
                const subdirectoryFiles = FileHelper.getFilesSync(directoryPath + item.name + '/', recurse);
                for (const file of subdirectoryFiles) {
                    files.push(file);
                }
            }
        }
        return files;
    }
    static async getFiles(directoryPath, recurse, options) {
        return FileHelper.getFilesSync(directoryPath, recurse, options);
    }
    static loadFilesSync(filePaths) {
        const files = [];
        for (const filePath of filePaths) {
            const file = new FileInformation(filePath);
            files.push(file);
        }
        for (const file of files) {
            file.load();
        }
        return files;
    }
    static async loadFiles(filePaths) {
        return FileHelper.loadFilesSync(filePaths);
    }
}
exports.FileHelper = FileHelper;
