const fs = require('fs');
const Template = require('./Template.js');
const { FileHelper } = require('./FileHelper');
class TemplateLoader {
    constructor(paths, extension, recurse) {
        if (Array.isArray(paths))
            this._paths = paths;
        else
            this._paths = [ paths ]; 
        this._extension = extension || '.hbs';
        this._templates = [];
        this._recurse = recurse || true;
    }

    get paths() {
        return this._paths;
    }
    set paths(value) {
        this._paths = value;
    }

    get extension() {
        return this._extension;
    }
    set extension(value) {
        this._extension = value;
    }

    get templates() {
        return this._templates;
    }

    load(callback) {
        var self = this;
        self._templates = [];

        for (const path of self._paths) {
            //let files = fs.readdirSync(path);
            let files = FileHelper.getFileInformationSync(path, this._recurse);

            for (let index = 0; index < files.length; index++) {
                const file = files[index];

                if (!file.fullName.endsWith(self.extension))
                    continue;

                const template = new Template(file.directory, file.fullName);
                
                if (!template.isLoaded) {
                    continue;
                }

                if (!self._templates.find(t => t.templatePath === template.templatePath))
                    self._templates.push(template);
            }
        }
        
        if (callback) {
            callback(self._templates, self);
        }
    }

    generate(model, callback) {
        var self = this;

        for (const template of this._templates) {
            console.log(`Generating template: ${template.name}`)
            // Generate the template
            template.generate(model);
            // Write the generated template to file
            template.write();
        }

        if (callback) {
            callback(self);
        }
    }

    loadAndGenerate(model, callback) {
        var self = this;
        this.load(function(templates) {
            self.generate(model);
        });

        if (callback) {
            callback(self);
        }
    }
}
exports.TemplateLoader = TemplateLoader;
