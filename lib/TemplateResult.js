const fs = require('fs');
const path = require('path');
const { FileHelper } = require("./FileHelper");

class TemplateResult {
    constructor(filePath, content, appendToExisting) {
        this._filePath = filePath;
        this._directoryPath = path.dirname(this._filePath);
        this._content = content;
        this._appendToExisting = appendToExisting;
    }
    get filePath() {
        return this._filePath;
    }
    get content() {
        return this._content;
    }
    get appendToExisting() {
        return this._appendToExisting;
    }
    write() {
        FileHelper.ensureDirectoryExists(this._directoryPath);
        if (this._appendToExisting && fs.existsSync(this._filePath)) {
            fs.appendFileSync(this._filePath, this._content);
            return;
        }
        console.log(`Writing File: ${this._filePath}...`);
        fs.writeFileSync(this._filePath, this._content);
    }
}
exports.TemplateResult = TemplateResult;
