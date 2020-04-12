class Replacement {
    constructor(find, replacement) {
        this._find = find || '';
        this._replacement = replacement || '';
    }
    get find() {
        return this._find;
    }
    set find(value) {
        this._find = value;
    }
    get replacement() {
        return this._replacement;
    }
    set replacement(value) {
        this._replacement = value;
    }
    replace(value) {
        value = value.replace(this.find, this.replacement);
        return value;
    }
}
exports.Replacement = Replacement;
