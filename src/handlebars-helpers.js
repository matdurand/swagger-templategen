const changeCase = require("change-case");
const _ = require("lodash");

function addHelpers(handlebars) {
  function swaggerToTsType(prop) {
    if (prop.$ref) {
      return prop.$ref.replace("#/definitions/", "");
    }
    switch (prop.type) {
      case "number":
      case "integer":
        return "number";
      case "boolean":
        return "boolean";
      case "string":
        return "string";
      default:
        return "object";
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

  handlebars.registerHelper("operationId", function(path, method, operation) {
    if (operation.operationId) {
      return operation.operationId;
    }
    const parts = (
      method +
      path
        .replace(/\{/g, "")
        .replace(/\}/g, "")
        .replace(/\//g, "_")
        .replace(/-/g, "_")
    ).split("_");
    return changeCase.camelCase(
      parts.map(p => changeCase.pascalCase(p)).join("")
    );
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

  handlebars.registerHelper("isEmptyObject", function(obj) {
    return _.isEmpty(obj);
  });

  handlebars.registerHelper("pascalCase", function(val, options) {
    return changeCase.pascalCase(val);
  });

  handlebars.registerHelper("bodyParam", function(operations, options) {
    return operations.parameters
      ? operations.parameters.find(p => p.in && p.in === "body")
      : [];
  });

  handlebars.registerHelper("queryParams", function(operations, options) {
    return operations.parameters
      ? operations.parameters.filter(p => p.in && p.in === "query")
      : [];
  });

  handlebars.registerHelper("pathParams", function(operations, options) {
    return operations.parameters
      ? operations.parameters.filter(p => p.in && p.in === "path")
      : [];
  });

  handlebars.registerHelper("hasBodyParams", function(operations, options) {
    if (
      operations.parameters &&
      operations.parameters.find(p => p.in && p.in === "body") !== undefined
    ) {
      return options.fn(this);
    }
  });

  handlebars.registerHelper("hasQueryParams", function(operations, options) {
    if (
      operations.parameters &&
      operations.parameters.find(p => p.in && p.in === "query") !== undefined
    ) {
      return options.fn(this);
    }
  });

  handlebars.registerHelper("hasPathParams", function(operations, options) {
    if (
      operations.parameters &&
      operations.parameters.find(p => p.in && p.in === "path") !== undefined
    ) {
      return options.fn(this);
    }
  });

  handlebars.registerHelper("responseType", function(responses, code, options) {
    if (responses["200"] && responses["200"].schema) {
      return schemaType(responses["200"].schema);
    }
    return "void";
  });
}

module.exports = {
  addHelpers
};
