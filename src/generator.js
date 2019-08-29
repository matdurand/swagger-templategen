function generate(
  swagger,
  templateFile,
  additionalProperties,
  additionalHandlebarsSetup
) {
  const Handlebars = require("handlebars");
  const helpers = require("./handlebars-helpers");
  helpers.addHelpers(Handlebars);
  if (additionalHandlebarsSetup) {
    additionalHandlebarsSetup(Handlebars);
  }

  const template = Handlebars.compile(templateFile);
  return template({
    ...swagger,
    ...additionalProperties
  });
}

module.exports = {
  generate
};
