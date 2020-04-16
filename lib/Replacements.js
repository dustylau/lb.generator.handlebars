const { RegexHelper } = require("./RegexHelper");
const { Replacement } = require("./Replacement");
class Replacements {
    constructor(replacements) {
        this._replacements = replacements || [];
    }
    get replacements() {
        return this._replacements;
    }
    set replacements(value) {
        this._replacements = value;
    }
    add(find, replacement, options) {
        this._replacements.push(new Replacement(find instanceof RegExp ? find : RegexHelper.createRegex(find, options || 'g'), replacement));
    }
    replace(value) {
        this._replacements.sort((a, b) => b.find.toString().length - a.find.toString().length);
        for (const replacement of this._replacements) {
            value = replacement.replace(value);
        }
        return value;
    }
}
exports.Replacements = Replacements;
