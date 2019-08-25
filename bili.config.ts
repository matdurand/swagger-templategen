import { Config } from "bili";

const config: Config = {
  input: "generator.js",
  babel: {
    minimal: true
  },
  output: {
    fileName: "index.js",
    format: ["cjs"],
    moduleName: "swagger-templategen"
  }
};

export default config;
