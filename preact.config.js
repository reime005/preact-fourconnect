import asyncPlugin from "preact-cli-plugin-async";
import envVars from "preact-cli-plugin-env-vars";
import preactCliTypeScript from "preact-cli-plugin-typescript";

export default (config, env, helpers) => {
  config.node.process = true;
  config.node.Buffer = true;

  envVars(config, env, helpers);
  asyncPlugin(config);
  preactCliTypeScript(config);
};
