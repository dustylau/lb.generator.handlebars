const { Replacements } = require("./Replacements");
const { FileHelper } = require("./FileHelper");

class TemplateBuilder {
    static defaultTarget = 'Model';
    static defaultSplitOn = '//##SPLIT##';
    static defaultExportPath = '{{ProjectRoot}}\\\\{{FileName}}';
    static defaultFileNamePattern = '//\\[(?<FileName>[^\\[\\]]+)\\]';
    static defaultRemoveFileName = true;

    constructor(files, replacements, ignoreList, includeList) {
        this._files = files && Array.isArray(files)
            ? files
            : (
                files ? [ files ] : []
            );
        this._replacements = replacements || new Replacements();
        this._ignoreList = ignoreList || [];
        this._includeList = includeList || [];
    }

    get files() {
        return this._files;
    }
    set files(value) {
        this._files = value;
    }

    get replacements() {
        return this._replacements;
    }
    set replacements(value) {
        this._replacements = value;
    }

    get ignoreList() {
        return this._ignoreList;
    }
    set ignoreList(value) {
        this._ignoreList = value;
    }

    get includeList() {
        return this._includeList;
    }
    set includeList(value) {
        this._includeList = value;
    }

    addFile(file) {
        if (!this._files.find(f => f === file))
            this._files.push(file);
    }

    addFiles(directoryPath, recurse, ignoreList, includeList) {
        var files = FileHelper.getFilesSync(
            directoryPath, 
            recurse || true, 
            { 
                ignoreList: ignoreList || this._ignoreList, 
                includeList: includeList || this._includeList 
            }
        );
        for (const file of files) {
            this.addFile(file);
        }
    }

    buildSingleFile(fileName, settingsFileName, splitOn) {
        settingsFileName = settingsFileName || `${fileName}.settings.json`;
        splitOn = splitOn || TemplateBuilder.defaultSplitOn;
        var template = '';
        const fileInformations = FileHelper.loadFilesSync(this._files);
        for (const file of fileInformations) {
            if (template.length > 0) {
                template += `\n${splitOn}\n`;
            }
            template += file.content;
            template += `\n//[${file.filePath}]`;
        }
        template = this._replacements.replace(template);
        FileHelper.writeFile(fileName, template);

        this.buildSingleFileSettings(settingsFileName, { SplitOn: splitOn })
    }

    buildSingleFileSettings(fileName, settings) {

        settings = settings || {};
        settings.Target = settings.Target || TemplateBuilder.defaultTarget;
        settings.ExportPath = settings.ExportPath || TemplateBuilder.defaultExportPath;
        settings.FileNamePattern = settings.FileNamePattern || TemplateBuilder.defaultFileNamePattern;
        settings.RemoveFileName = settings.RemoveFileName || TemplateBuilder.defaultRemoveFileName;
        settings.SplitOn = settings.SplitOn || TemplateBuilder.defaultSplitOn;

        this.writeSettingFile(fileName, settings);
    }

    buildIndividualFiles(directoryPath) {
        const fileInformations = FileHelper.loadFilesSync(this._files);
        for (const file of fileInformations) {
            this.buildIndividualFile(directoryPath, file)
        }
    }

    buildIndividualFile(directoryPath, file) {
        fileName = `${directoryPath}/${file.fullName}.hbs`;
        settingsFileName = `${fileName}.settings.json`;
        var template = file.content;
        template = this._replacements.replace(template);
        
        FileHelper.writeFile(fileName, template);

        var exportFileName = this._replacements.replace(file.filePath);

        this.buildIndividualFileSettings(
            settingsFileName,
            {
                ExportPath: `{{ProjectRoot}}\\${exportFileName}`
            }
        );
    }

    buildIndividualFileSettings(fileName, settings) {

        settings = settings || {};
        settings.Target = settings.Target || TemplateBuilder.defaultTarget;
        settings.ExportPath = settings.ExportPath || TemplateBuilder.defaultExportPath;

        this.writeSettingFile(fileName, settings);
    }
    
    writeSettingFile(fileName, settings) {
        var json = JSON.stringify(settings, null, 1);
        FileHelper.writeFile(fileName, json);
    }
}
exports.TemplateBuilder = TemplateBuilder;