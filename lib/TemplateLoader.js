const fs = require('fs');
const Template = require('./Template.js');
class TemplateLoader {
    constructor(path, extension) {
        this._path = path;
        this._extension = extension || '.hbs';
        this._templates = [];
    }
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = value;
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
        fs.readdir(this.path, function (err, files) {
            if (err) {
                throw err;
            }
            self._templates = [];
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                if (!file.endsWith(self.extension))
                    continue;
                const template = new Template(self.path, file);
                if (!template.isLoaded)
                    continue;
                    self._templates.push(template);
            }
            callback(self._templates);
        });
    }
}
exports.TemplateLoader = TemplateLoader;
