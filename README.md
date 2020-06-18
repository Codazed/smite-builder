# Smite random generator for JavaScript
Smite builder is my STG-Lib Java library rewritten in JavaScript. It is capable of generating random gods with random builds for the Hi-Rez studios game, Smite.

## Usage
Include it in your project like any other module.

### ES6
```js
import SmiteBuilder from 'smite-builder';
const builder = new SmiteBuilder();
```

### CommonJS
```js
const SmiteBuilder = require('smite-builder');
const builder = new SmiteBuilder();
```

Next before you can use the module, you'll need to tell it to fetch the latest lists.

```js
builder.getLists(function() {
    // Now you can do stuff with the module in this callback function
});
```

Keep in mind that without running the getLists function once, the module will have nothing to generate from.

For usage instructions, please read the [Documentation](https://smite-builder.readthedocs.io/en/latest/).