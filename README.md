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
As of version 2.0.0, the API that previous versions have used to pull the lists has been nixed.
I had originally created this API to prevent CORS issues for software downstream that utilize this package.
I have now decided that such a thing is no longer my responsibility to supply, and as such, this package
will utilize either the in-built lists shipped with each version of itself, or lists that YOU give it in the same
JSON format.

As you can probably guess, it is possible for the lists to become out of sync with whatever version is in master
on this repo. I will keep the lists in master on this repo up to date as often as I can.
(Keep in mind this is a hobby project and I'm currently the only maintainer.)
I may not *always* publish package updates to NPM when I update the lists. Because of this, I encourage you to
write your own API that fetches the latest lists from master and then gives it to the generator. Provide the lists
to the generator like this:
```js
const builder = new SmiteBuilder(godsListJSONString, itemsListJSONString, relicsListJSONString)
// Where each of the above parameters is a string representing each list in JSON format
```

For specific usage instructions, ~~please consult the documentation~~ (coming maybe).