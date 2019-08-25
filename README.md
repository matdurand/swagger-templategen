# swagger-templategen

This is an attempt to make a flexible code generator for a rest client from a Swagger spec. The problem with generator
is that they are almost always opinionated. Maybe the author is using Axios for http calls, and maybe you're not.

So this project is a generator helper instead of a full fledge generator. It's a collection of Handlebars helpers and a
way to use handlebars templates to generate code from a Swagger spec.

## Installation

For NPM:

```
npm install --save-dev swagger-templategen
```

For yarn

```
yarn add swagger-templategen -D
```

## Usage

Basically you just have to invoke the generate function with a template, and a swagger spec.

```
const fs = require("fs");
const path = require("path");
const generate = require("swagger-templategen");
const petstoreSwagger = require("./petstore.json");

const templateTypesFile = fs.readFileSync(path.join(__dirname, "./template-types.hbs"), "utf8");
const generatedCode = swaggerTemplate.generate(petstoreSwagger, templateTypesFile);

```

## Examples

See the examples folder for samples projects using the generator.
