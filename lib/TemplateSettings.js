class TemplateSettings {
    static DefaultTarget = "Model";
    static DefaultTargetItem = "item";
    static DefaultTargetItemNameProperty = "Name";
    constructor(initialData) {
        this._target = initialData.Target || TemplateSettings.DefaultTarget;
        this._targetItem = initialData.TargetItem || TemplateSettings.DefaultTargetItem;
        this._targetItemNameProperty = initialData.TargetItemNameProperty || TemplateSettings.DefaultTargetItemNameProperty;
        this._exportPath = initialData.ExportPath || null;
        this._appendToExisting = initialData.AppendToExisting || false;
        this._fileNamePattern = initialData.FileNamePattern || null;
        this._splitOn = initialData.SplitOn || null;
        this._removeFileName = initialData.RemoveFileName || false;
    }
    get target() {
        return this._target;
    }
    get targetItem() {
        return this._targetItem;
    }
    get targetItemNameProperty() {
        return this._targetItemNameProperty;
    }
    get exportPath() {
        return this._exportPath;
    }
    get appendToExisting() {
        return this._appendToExisting;
    }
    get fileNamePattern() {
        return this._fileNamePattern;
    }
    get removeFileName() {
        return this._removeFileName;
    }
    get splitOn() {
        return this._splitOn;
    }
}
exports.TemplateSettings = TemplateSettings;
