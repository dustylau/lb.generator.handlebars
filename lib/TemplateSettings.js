class TemplateSettings {
    static DefaultTarget = "Model";
    static DefaultTargetItem = "item";
    static DefaultTargetProperty = "target";
    static DefaultModelProperty = "model";
    static DefaultTargetItemNameProperty = "Name";
    static DefaultPrepareExportPathUsingTemplate = true;
    static DefaultPrepareExportPathUsingReplace = false;
    constructor(initialData) {
        this._target = initialData.Target || TemplateSettings.DefaultTarget;
        this._targetItem = initialData.TargetItem || TemplateSettings.DefaultTargetItem;
        this._targetProperty = initialData.TargetProperty || TemplateSettings.DefaultTargetProperty;
        this._modelProperty = initialData.ModelProperty || TemplateSettings.DefaultModelProperty;
        this._targetItemNameProperty = initialData.TargetItemNameProperty || TemplateSettings.DefaultTargetItemNameProperty;
        this._exportPath = initialData.ExportPath || null;
        this._prepareExportPathUsingTemplate = initialData.PrepareExportPathUsingTemplate || TemplateSettings.DefaultPrepareExportPathUsingTemplate;
        this._prepareExportPathUsingReplace = initialData.PrepareExportPathUsingReplace || TemplateSettings.DefaultPrepareExportPathUsingReplace;
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
    get targetProperty() {
        return this._targetProperty;
    }
    get modelProperty() {
        return this._modelProperty;
    }
    get targetItemNameProperty() {
        return this._targetItemNameProperty;
    }
    get exportPath() {
        return this._exportPath;
    }
    get prepareExportPathUsingTemplate() {
        return this._prepareExportPathUsingTemplate;
    }
    get prepareExportPathUsingReplace() {
        return this._prepareExportPathUsingReplace;
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
