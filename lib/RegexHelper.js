class RegexHelper {
    static defaultOptions = 'g';
    static escape(value) {
        return value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    static createRegex(value, options) {
        value = RegexHelper.escape(value);
        return new RegExp(value, options || RegexHelper.defaultOptions);
    }
}
exports.RegexHelper = RegexHelper;
