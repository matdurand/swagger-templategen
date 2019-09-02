const fs = require("fs");
const path = require("path");
const swaggerTemplate = require("../../../src/generator");
const petstoreSwagger = require("./petstore.json");

const templateTypesFile = fs.readFileSync(path.join(__dirname, "./template-types.hbs"), "utf8");
const typesGeneratedCode = swaggerTemplate.generate(petstoreSwagger, templateTypesFile);

const templateClientFile = fs.readFileSync(path.join(__dirname, "./template-client.hbs"), "utf8");
const clientGeneratedCode = swaggerTemplate.generate(petstoreSwagger, templateClientFile, {
    clientName: "PetStoreClient"
});

const imports =
    'import { HttpService } from "@nestjs/common";\nimport { map } from "rxjs/operators";\nimport { AxiosRequestConfig } from "axios";\nimport * as uriTemplates from "uri-templates";';
fs.writeFileSync(
    "./swagger/petstore.client.generated.ts",
    imports + "\n\n" + typesGeneratedCode + "\n\n" + clientGeneratedCode
);
