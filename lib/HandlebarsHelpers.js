const Helpers = require("./Helpers");
const Handlebars = require("handlebars");

Handlebars.registerHelper('ifEquals', Helpers.ifEquals);

Handlebars.registerHelper('ifNotEquals', Helpers.ifNotEquals);

Handlebars.registerHelper('camelCase', Helpers.camelCase);

Handlebars.registerHelper('upperCase', Helpers.upperCase);

Handlebars.registerHelper('lowerCase', Helpers.lowerCase);

Handlebars.registerHelper('getType', Helpers.getType);

Handlebars.registerHelper('isSystemType', Helpers.isSystemType);

Handlebars.registerHelper('hasSystemType', Helpers.hasSystemType);

Handlebars.registerHelper('findIn', Helpers.findIn);

Handlebars.registerHelper('write', function(value) {
    return value;
});

Handlebars.registerHelper('any', Helpers.any);

Handlebars.registerHelper('existsIn', Helpers.existsIn);

Handlebars.registerHelper('first', Helpers.first);

Handlebars.registerHelper('orderBy', Helpers.orderBy);

Handlebars.registerHelper('where', Helpers.where);

Handlebars.registerHelper('getSqlType', Helpers.getSqlType);

Handlebars.registerHelper('getSystemType', Helpers.getSystemType);

Handlebars.registerHelper('isNumber', Helpers.isNumber);

Handlebars.registerHelper('contains', Helpers.contains);

Handlebars.registerHelper('replace', Helpers.replace);

Handlebars.registerHelper('concat', Helpers.concat);

module.exports = Helpers;