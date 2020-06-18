# Smite random generator for JavaScript
Smite builder is my STG-Lib Java library rewritten in JavaScript.
It is capable of generating random gods with random builds for the Hi-Rez studios game, Smite.

![npm](https://img.shields.io/npm/v/smite-builder)
![npm bundle size](https://img.shields.io/bundlephobia/min/smite-builder)
![Gitlab pipeline status](https://img.shields.io/gitlab/pipeline/Codazed/smite-builder)
[![coverage report](https://gitlab.com/Codazed/smite-builder/badges/master/coverage.svg)](https://gitlab.com/Codazed/smite-builder/-/commits/master)

## Installation
`npm install smite-builder` or `yarn add smite-builder`

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

## Usage
Before you can use the module, you'll need to tell it to fetch the latest lists.

```js
builder.getLists(function() {
    // Now you can do stuff with the module in this callback function
});
```

Keep in mind that without running the getLists function once, the module will have nothing to generate from.

For specific usage instructions, ~~please consult the documentation~~ (coming soon).