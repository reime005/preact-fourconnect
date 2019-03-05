import asyncPlugin from "preact-cli-plugin-async";
import envVars from "preact-cli-plugin-env-vars";
import preactCliTypeScript from "preact-cli-plugin-typescript";
import path from "path";

const substituteTypingsForCssModulesLoader = config => {
  // Match instances of { loader: 'css-loader', options { modules: true }}
  if (
    config.loader === "css-loader" &&
    config.options &&
    config.options.modules
  ) {
    config.loader = "typings-for-css-modules-loader";

    // Use of 'namedExport' and 'camelCase' are required:
    // https://github.com/Jimdo/typings-for-css-modules-loader/issues/20#issuecomment-334867043
    config.options.namedExport = true;
    config.options.camelCase = true;
  }

  // Recursively search for and replace instances of 'css-loader' per the above.
  for (const key of Object.keys(config)) {
    const value = config[key];
    if (typeof value === "object") {
      substituteTypingsForCssModulesLoader(value);
    }
  }
};

export default (config, env, helpers) => {
  config.node.process = true;
  config.node.Buffer = true;

  substituteTypingsForCssModulesLoader(config);

  preactCliTypeScript(config);
  envVars(config, env, helpers);
  asyncPlugin(config);

  // be able to make relative imports like 'src/components/board/board', not '../../src/components/board/board'
  config.resolve.modules.push(path.resolve("./"));
};
