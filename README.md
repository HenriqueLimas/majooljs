[![Build Status](https://travis-ci.org/HenriqueLimas/majooljs.svg)](https://travis-ci.org/HenriqueLimas/majooljs) [![Code Climate](https://codeclimate.com/github/HenriqueLimas/majooljs/badges/gpa.svg)](https://codeclimate.com/github/HenriqueLimas/majooljs) [![Test Coverage](https://codeclimate.com/github/HenriqueLimas/majooljs/badges/coverage.svg)](https://codeclimate.com/github/HenriqueLimas/majooljs/coverage)

MajoolJS
========
### What is it?
MajoolJS is a simple way to separate your code in modules without any configuration.
The syntax of Majool is inspired in modularization of ES2015.

### What is not it?
MajoolJS is not a file/module loader like [RequireJS](http://requirejs.org/) or [SystemJS](https://github.com/systemjs/systemjs) and Majool does not works with
Lazy Loading, because the others modules loaders know do very well this job.

### Download / Clone
**Bower**:
```bash
bower install majooljs
```

Alternatively you can [download](https://github.com/HenriqueLimas/majooljs/archive/master.zip)
this repository.

Or you can clone the repo using Git:

```bash
git clone https://github.com/HenriqueLimas/majooljs.git
```

### Basic Use
```html
<script src="bower_components/majooljs/dist/majool.js"></script>
<script src="my-first-module.js"></script>
<script src="main.js"></script>
```
Where ```my-first-module.js``` is:

```javascript
  // create a new module
  mjs.module('myModule');
  
  // Exporting MyComponent into myModule
  mjs.export(function MyComponent() {
    this.firstName = 'Ford';
    this.lastName = 'Prefect';
  });
```

and ```main.js```is:

```javascript
  // Importing the MyComponent from module created.
  var myModule = mjs.import(['MyComponent']).from('myModule');

  // Simple Javascript =)
  var MyComponent = myModule.MyComponent;

  var fordPrefect = new MyComponent();
```

### API Reference

##### module(name):
Create a module and define the current module.
##### export([name|classComponent|object], [component]):
Append the new component in the current module. 
Where the first parameter can be:
  - a string name
  - Constructor
  - object with all the keys to be exported.

The ```component``` parameter is used when the first parameter is a string.

##### exportDefault([name|classComponent|object], [component]):
Append the new component and set that as default in the current module.
Where the first parameter can be:
  - a string name
  - Constructor
  - object with all the keys to be exported.

The ```component``` parameter is used when the first parameter is a string.

##### import([array|string]).from(moduleName):
Prepares the keys to be imported from module. 
If an ```array``` is passed, it returns an object with all properties requested from the module name.
If a ```string``` is passed, it returns a ```default``` component from module name.
