const Helpers = require("./lib/Helpers");
const HandlebarsHelpers = require("./lib/HandlebarsHelpers");
const Template = require("./lib/Template");
const { TemplateLoader } = require("./lib/TemplateLoader");
const { TemplateResult } = require("./lib/TemplateResult");
const { TemplateSettings } = require("./lib/TemplateSettings");

const { FileHelper } = require("./lib/FileHelper");
const { FileInformation } = require("./lib/FileInformation");
const { RegexHelper } = require("./lib/RegexHelper");
const { Replacement } = require("./lib/Replacement");
const { Replacements } = require("./lib/Replacements");
const { TemplateBuilder } = require("./lib/TemplateBuilder");

module.exports = {
    HandlebarsHelpers,
    Helpers,
    Template,
    TemplateLoader,
    TemplateResult,
    TemplateSettings,
    FileHelper,
    FileInformation,
    RegexHelper,
    Replacement,
    Replacements,
    TemplateBuilder
};