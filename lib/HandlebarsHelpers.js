const Helpers = require("./Helpers");
const Handlebars = require("handlebars");

Handlebars.registerHelper('ifEquals', Helpers.ifEquals);

Handlebars.registerHelper('ifNotEquals', Helpers.ifNotEquals);

Handlebars.registerHelper('camelCase', Helpers.camelCase);

Handlebars.registerHelper('getType', Helpers.getType);

Handlebars.registerHelper('findIn', Helpers.findIn);

Handlebars.registerHelper('write', function(value) {
    return value;
});

Handlebars.registerHelper('any', Helpers.any);

Handlebars.registerHelper('existsIn', Helpers.existsIn);

Handlebars.registerHelper('first', Helpers.first);

Handlebars.registerHelper('where', Helpers.where);

Handlebars.registerHelper('getSqlType', Helpers.getSqlType);

Handlebars.registerHelper('isNumber', Helpers.isNumber);

module.exports = Helpers;