const changeCase = require("change-case");

function addHelpers(handlebars) {
  function swaggerToTsType(prop) {
    if (prop.$ref) {
      return prop.$ref.replace("#/definitions/", "");
    }
    switch (prop.type) {
      case "integer":
        return "number";
      default:
        return "string";
    }
  }

  function schemaType(schema) {
    if (schema.type === "array") {
      return swaggerToTsType(schema.items) + "[]";
    } else {
      return swaggerToTsType(schema);
    }
  }

  handlebars.registerHelper("propertyType", function(prop) {
    if (prop.enum && prop.enum.length > 0) {
      return `"${prop.enum.join('" | "')}"`;
    } else if (prop.type === "array") {
      return swaggerToTsType(prop.items) + "[]";
    } else {
      return swaggerToTsType(prop);
    }
  });

  handlebars.registerHelper("schemaType", function(schema) {
    return schemaType(schema);
  });

  handlebars.registerHelper("contains", function(val, search, options) {
    let contains = false;
    if (Array.isArray(val)) {
      contains = val.find(v => v === search) !== undefined;
    } else if (typeof val === "string" || val instanceof String) {
      contains = val.indexOf(search) !== -1;
    }
    if (contains) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  handlebars.registerHelper("doesntContain", function(val, search, options) {
    return handlebars.helpers["contains"].call(this, val, search, {
      ...options,
      fn: options.inverse,
      inverse: options.fn
    });
  });

  handlebars.registerHelper("pascalCase", function(val, options) {
    return changeCase.pascalCase(val);
  });

  handlebars.registerHelper("bodyParam", function(operations, options) {
    return operations.parameters.find(p => p.in && p.in === "body");
  });

  handlebars.registerHelper("queryParams", function(operations, options) {
    return operations.parameters.filter(p => p.in && p.in === "query");
  });

  handlebars.registerHelper("pathParams", function(operations, options) {
    return operations.parameters.filter(p => p.in && p.in === "path");
  });

  handlebars.registerHelper("hasBodyParams", function(operations, options) {
    if (
      operations.parameters.find(p => p.in && p.in === "body") !== undefined
    ) {
      return options.fn(this);
    }
  });

  handlebars.registerHelper("hasQueryParams", function(operations, options) {
    if (
      operations.parameters.find(p => p.in && p.in === "query") !== undefined
    ) {
      return options.fn(this);
    }
  });

  handlebars.registerHelper("hasPathParams", function(operations, options) {
    if (
      operations.parameters.find(p => p.in && p.in === "path") !== undefined
    ) {
      return options.fn(this);
    }
  });

  handlebars.registerHelper("responseType", function(responses, code, options) {
    if (responses["200"]) {
      return schemaType(responses["200"].schema);
    }
    return "void";
  });
}

module.exports = {
  addHelpers
};
