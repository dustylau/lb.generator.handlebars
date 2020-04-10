# lb.generator.handlebars
The LB.Generator.Handlebars NPM package provides a template code generation library based on the Handlebars template engine.
The library is easily installed via npm and provides a set of tools to generate any text-based asset from a JSON datasource.


## Installation

```javascript
npm install --save lb.generator.handlebars
```


## Usage

### 1. Include the library
```javascript
const Generator = require('lb.generator.handlebars');
```


### 2. Load or define a model
```javascript
// Load a model
const model = require("./sample-templates/sample-model.json");

// Or

// Define a model
const model = {
    Description: "Test Model",
    Items: [
        { 
            Name: "ItemA", 
            Description: "Item - A", 
            Options: [ 
                { Id: "A", Description: "Option A" },
                { Id: "B", Description: "Option B" }
            ] 
        },
        { 
            Name: "ItemB", 
            Description: "Item - B", 
            Options: [ 
                { Id: "C", Description: "Option C" },
                { Id: "D", Description: "Option D" }
            ] 
        }
    ]
};
```

### 3. Define a template

Create a Handlebars template file: ./sample-templates/sample.hbs

```hbs
This sample template is generated for each item in model.Items.

You have access to the entire model:
  Model Description: {{model.Description}}

You have access to the current scoped item in the Items array:
  Item Name: {{item.Name}}
    Description: {{item.Description}}
    Options:
      {{#each item.Options}}
        Id: {{Id}}  Description: {{Description}}
      {{/each}}
```

### 4. Define the template settings

Create a template settings file: ./sample-templates/sample.hbs.settings.json

```json
{
    "Target": "Items",
    "TargetItem": "item",
    "ExportPath": ".\\Generated\\Items\\{item.Name}.txt",
    "AppendToExisting": false
}
```

### 5. Create a Template Loader

Create a Template Loader and pass it the path to the directory containing the templates.
The loader will automatically load all template files ending in ".hbs" and their corresponding settings ".hbs.settings.json"

```javascript
var loader = new Generator.TemplateLoader('./sample-templates');
```

### 5. Load and generate the templates

  1. Call the `loader.load()` function and pass a callback that recieves an array of loaded templates.
  1. Iterate the loaded template array and call `template.generate()` for each template passing in your model.
  1. Call `template.write()` on a generated template to write the generated template to its defined file.

```javascript
// Load the templates with a callback containing the list of loaded templates
loader.load(function (templates) {
    // Interate the templates and generate each with the supplied model
    for (const template of templates) {
        console.log(`Generating template: ${template.name}`)
        // Generate the template
        template.generate(model);
        // Write the generated template to file
        template.write();
    }
});
```
