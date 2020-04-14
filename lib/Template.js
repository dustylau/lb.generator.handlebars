const fs = require('fs');
const Handlebars = require('handlebars');
const { TemplateResult } = require("./TemplateResult");
const { TemplateSettings } = require("./TemplateSettings");
const Helpers = require("./Helpers");
const { resolve } = require("path");

class Template {
    static defaultPrepareScript = {
        prepareModel: function(model) { return model; },
        prepareTarget: function(target) { return target; },
        prepareItem: function(item) { return item; },
        prepareItemModel: function(itemModel) { return itemModel; }
    };
    constructor(directoryPath, fileName) {
        this.initialize();
        this.load(directoryPath, fileName);
    }
    initialize() {
        this._name = null;
        this._templatePath = null;
        this._templateSettingsPath = null;
        this._scriptPath = null;
        this._templateContent = null;
        this._settings = null;
        this._isGenerated = null;
        this._result = null;
        this._isLoaded = false;
        this._script = Template.defaultPrepareScript;
    }
    load(directoryPath, fileName) {
        const templateSettingsPattern = /\w+\.hbs\.json/i;
        const templatePattern = /\w+\.hbs/i;

        if (directoryPath.endsWith('/') || directoryPath.endsWith('\\'))
            directoryPath = directoryPath.substring(0, directoryPath.length - 1);

        var name = "";

        var result = templateSettingsPattern.exec(fileName);

        if (result) {
            name = fileName.replace(".hbs.settings.json", "");
        } else {
            result = templatePattern.exec(fileName);

            if (!result) return;

            name = fileName.replace(".hbs", "");
        }

        const templateSettingsFile = `${name}.hbs.settings.json`;
        const templateFile = `${name}.hbs`;
        const scriptFile = `${templateFile}.js`;

        this._templatePath = `${directoryPath}/${templateFile}`;
        this._templateSettingsPath = `${directoryPath}/${templateSettingsFile}`;
        this._scriptPath = `${directoryPath}/${scriptFile}`;

        const templateContent = fs.readFileSync(this._templatePath, { encoding: 'utf8' });
        const settingsContent = fs.readFileSync(this._templateSettingsPath, { encoding: 'utf8' });

        if (fs.existsSync(this._scriptPath))
            this._script = require(resolve(this._scriptPath));
        else
            this._script = null;

        this._name = name;
        this._templateContent = templateContent;
        this._template = Handlebars.compile(templateContent);
        this._settings = new TemplateSettings(JSON.parse(settingsContent));

        this._isLoaded = true;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get templatePath() {
        return this._templatePath;
    }
    get templateSettingsPath() {
        return this._templateSettingsPath;
    }
    get scriptPath() {
        return this._scriptPath;
    }
    get templateContent() {
        return this._templateContent;
    }
    get template() {
        return this._template;
    }
    get settings() {
        return this._settings;
    }
    get isLoaded() {
        return this._isLoaded;
    }
    get isGenerated() {
        return this._isGenerated;
    }
    get result() {
        return this._result;
    }
    generate(model) {

        this._result = [];

        const targetProperty = this._settings.targetProperty || 'target';
        const modelProperty = this._settings.modelProperty || 'model';
        const itemModelProperty = this._settings.targetItem || 'item';

        if (this._script && this._script.prepareModel) {
            model = this._script.prepareModel(model);
            if (model === null) {
                throw 'Prepare Model script did not return a valid model.';
            }
        }

        var target = model;

        if (!Helpers.isEmpty(this._settings.target) && this._settings.target !== "Model") {
            target = model[this._settings.target];
        }

        if (this._script && this._script.prepareTarget) {
            target = this._script.prepareTarget(target);
            if (target === null) {
                throw 'Prepare Target script did not return a valid target.';
            }
        }

        if (!Array.isArray(target)) {
            const content = this._template(target);
            if (!this._settings.splitOn) {
                const result = new TemplateResult(
                    Template.prepareExportPath(this._settings, null, target),
                    content,
                    this._settings.appendToExisting
                    );
                
                this._result.push(result);
            } else {
                var sections = content.split(this._settings.splitOn);

                for (let index = 0; index < sections.length; index++) {
                    let section = sections[index];
                    let fileName = `${this.name}-${index}`;

                    if (section.trim().length <= 0) {
                        continue;
                    }

                    if (this._settings.fileNamePattern) {
                        const regex = new RegExp(this._settings.fileNamePattern);
                        const nameMatch = regex.exec(section);

                        if (this._settings.removeFileName) {
                            section = section.replace(nameMatch[0], "");
                        }
                        
                        fileName = nameMatch.groups.FileName;
                    }

                    section = section.trim();

                    const result = new TemplateResult(
                        Template.prepareExportPath(this._settings, fileName, target),
                        section,
                        this._settings.appendToExisting
                        );
                    
                    this._result.push(result);
                }
            }
            
            this._isGenerated = true;
            return;
        }
        
        for (var item of target) {

            if (this._script && this._script.prepareItem) {
                item = this._script.prepareItem(item);
                if (item === null) {
                    throw 'Prepare Item script did not return a valid item.';
                }
            }
            
            var itemModel = {};

            itemModel[targetProperty] = target;
            itemModel[modelProperty] = model;
            itemModel[itemModelProperty] = item;

            if (this._script && this._script.prepareItemModel) {
                itemModel = this._script.prepareItemModel(itemModel);
                if (itemModel === null) {
                    throw 'Prepare Item Model script did not return a valid item model.';
                }
            }

            const content = this._template(itemModel);

            if (!this._settings.splitOn) {
                const result = new TemplateResult(
                    Template.prepareExportPath(this._settings, null, itemModel),
                    content,
                    this._settings.appendToExisting
                    );
                
                this._result.push(result);
            } else {
                var sections = content.split(this._settings.splitOn);

                for (let index = 0; index < sections.length; index++) {
                    let section = sections[index];
                    let fileName = `${this.name}-${item.Name}-${index}`;

                    if (section.trim().length <= 0){
                        continue;
                    }
                    
                    if (this._settings.fileNamePattern) {
                        const regex = new RegExp(this._settings.fileNamePattern);
                        const nameMatch = regex.exec(section);

                        if (this._settings.removeFileName) {
                            section = section.replace(nameMatch[0], "");
                        }
                        
                        fileName = nameMatch.groups.FileName;

                    }

                    section = section.trim();

                    const result = new TemplateResult(
                        Template.prepareExportPath(this._settings, fileName, itemModel),
                        section,
                        this._settings.appendToExisting
                        );
                    
                    this._result.push(result);
                }
            }
        }

        this._isGenerated = true;
    }
    write() {
        for(var result of this._result) {
            result.write();
        }
    }
    static prepareExportPath(settings, fileName, model) {
        const itemModelProperty = settings.targetItem || 'item';
        const targetItemNameProperty = settings.targetItemNameProperty || 'Name';
        const nameReplacement = `{${itemModelProperty}.${targetItemNameProperty}}`;

        var exportPath = settings.exportPath;

        //console.log(`Preparing Export Path: ${exportPath}`);

        if (settings.prepareExportPathUsingReplace) {
            //console.log('Preparing Export Path Using Replace...');
            if (fileName && !Helpers.isEmpty(fileName))
                exportPath = exportPath.replace("{FileName}", fileName);
    
            if (model && model[targetItemNameProperty] && !Helpers.isEmpty(model[targetItemNameProperty]))
                exportPath = exportPath.replace(nameReplacement, model[targetItemNameProperty]);
        }

        if (settings.prepareExportPathUsingTemplate) {
            //console.log('Preparing Export Path Using Template...');
            if (!model || model === null)
                model = {};

            //console.log(model);

            const exportPathTemplate = Handlebars.compile(exportPath);

            if (fileName && !Helpers.isEmpty(fileName))
                model.FileName = fileName;
            
            exportPath = exportPathTemplate(model);
        }

        //console.log(`New Export Path: ${exportPath}`);

        return exportPath;
    }
};

module.exports = Template;