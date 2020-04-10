const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');
const { TemplateResult } = require("./TemplateResult");
const { TemplateSettings } = require("./TemplateSettings");
const Helpers = require("./Helpers");

class Template {
    constructor(path, file) {
        this.initialize();
        this.load(path, file);
    }
    initialize() {
        this._name = null;
        this._templateContent = null;
        this._settings = null;
        this._isGenerated = null;
        this._result = null;
        this._isLoaded = false;
    }
    load(path, file) {
        const templateSettingsPattern = /\w+\.hbs\.json/i;
        const templatePattern = /\w+\.hbs/i;

        var name = "";

        var result = templateSettingsPattern.exec(file);

        if (result) {
            name = file.replace(".hbs.settings.json", "");
        } else {
            result = templatePattern.exec(file);

            if (!result) return;

            name = file.replace(".hbs", "");
        }

        const templateSettingsFile = `${name}.hbs.settings.json`;
        const templateFile = `${name}.hbs`;

        const settingsContent = fs.readFileSync(`${path}/${templateSettingsFile}`, { encoding: 'utf8' });
        const templateContent = fs.readFileSync(`${path}/${templateFile}`, { encoding: 'utf8' });

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

        var target = model;

        if (!Helpers.isEmpty(this._settings.target) && this._settings.target !== "Model") {
            target = model[this._settings.target];
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
        
        for (const item of target) {
            
            const itemModel = { model: model, target: target };

            const itemModelProperty = this._settings.targetItem || 'item';

            itemModel[itemModelProperty] = item;

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