const fs = require('fs');
const Template = require('./Template.js');
class TemplateLoader {
    constructor(paths, extension) {
        if (Array.isArray(path))
            this._paths = paths;
        else
            this._paths = [ paths ]; 
        this._extension = extension || '.hbs';
        this._templates = [];
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
            let files = fs.readdirSync(path);

            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                if (!file.endsWith(self.extension))
                    continue;
                const template = new Template(path, file);
                if (!template.isLoaded)
                    continue;
                    self._templates.push(template);
            }
        }
        
        callback(self._templates);
    }
}
exports.TemplateLoader = TemplateLoader;
