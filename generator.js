const Handlebars = require("handlebars");
const helpers = require("./handlebars-helpers");
helpers.addHelpers(Handlebars);

function generate(swagger, templateFile, additionalProperties) {
  const template = Handlebars.compile(templateFile);
  return template({
    ...swagger,
    ...additionalProperties
  });
}

module.exports = {
  generate
};
