const { Replacements } = require("./Replacements");
const { FileHelper } = require("./FileHelper");

class TemplateBuilder {
    static defaultTarget = 'Model';
    static defaultSplitOn = '//##SPLIT##';
    static defaultExportPath = '{{ProjectRoot}}\\\\{{FileName}}';
    static defaultFileNamePattern = '//\\[(?<FileName>[^\\[\\]]+)\\]';
    static defaultRemoveFileName = true;
    static defaultAddTemplateScript = false;

    /**
     * @param  {string[]} files
     * @param  {Replacements} replacements
     * @param  {string[]|RegExp[]} ignoreList
     * @param  {string[]|RegExp[]} includeList
     */
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

    clearFiles() {
        this._files = [];
    }

    addFile(file) {
        if (!this._files.find(f => f === file))
            this._files.push(file);
    }

    addFiles(directoryPath, recurse, ignoreList, includeList) {
        var files = FileHelper.getFilesSync(
            directoryPath, 
            recurse, 
            { 
                ignoreList: ignoreList || this._ignoreList, 
                includeList: includeList || this._includeList 
            }
        );
        for (const file of files) {
            this.addFile(file);
        }
    }

    buildSingleFile(fileName, settingsFileName, splitOn, addTemplateScript, scriptFileName) {
        settingsFileName = settingsFileName || `${fileName}.settings.json`;
        splitOn = splitOn || TemplateBuilder.defaultSplitOn;
        addTemplateScript = addTemplateScript || TemplateBuilder.defaultAddTemplateScript;
        scriptFileName = scriptFileName || `${fileName}.js`;

        var template = '';

        const fileInformations = FileHelper.loadFilesSync(this._files);

        fileInformations.sort((a, b) => a.filePath - b.filePath);

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

        if (addTemplateScript && scriptFileName)
            this.buildScriptFile(scriptFileName);
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

    buildIndividualFiles(directoryPath, addTemplateScript) {
        addTemplateScript = addTemplateScript || TemplateBuilder.defaultAddTemplateScript;
        const fileInformations = FileHelper.loadFilesSync(this._files);
        for (const file of fileInformations) {
            this.buildIndividualFile(directoryPath, file)
        }
    }

    buildIndividualFile(directoryPath, file, addTemplateScript) {
        addTemplateScript = addTemplateScript || TemplateBuilder.defaultAddTemplateScript;

        var fileName = `${directoryPath}/${file.fullName}.hbs`;
        var settingsFileName = `${fileName}.settings.json`;
        var scriptFileName = `${fileName}.js`;
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

        if (addTemplateScript && scriptFileName)
            this.buildScriptFile(scriptFileName);
    }

    buildIndividualFileSettings(fileName, settings) {

        settings = settings || {};
        settings.Target = settings.Target || TemplateBuilder.defaultTarget;
        settings.ExportPath = settings.ExportPath || TemplateBuilder.defaultExportPath;

        this.writeSettingFile(fileName, settings);
    }

    buildScriptFile(fileName) {
        const content = `module.exports = {
    prepareModel: function(model) { return model; },
    prepareTarget: function(target) { return target; },
    prepareItem: function(item) { return item; },
    prepareItemModel: function(itemModel) { return itemModel; }
};`
        FileHelper.writeFile(fileName, content);
    }
    
    writeSettingFile(fileName, settings) {
        var json = JSON.stringify(settings, null, 1);
        FileHelper.writeFile(fileName, json);
    }
}
exports.TemplateBuilder = TemplateBuilder;