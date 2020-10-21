import { Config } from "./types";

export function getBaseConfig(): Config {
  return {
    interval: 30,
    debug: 0,
    tags: [],
    supervisorRootUrl: "http://supervisor/core/",
    supervisorToken: process.env.SUPERVISOR_TOKEN,
  };
}

export function readConfig(path?: string): Config {
  const config = getBaseConfig();
  if (path) {
    try {
      Object.assign(config, require(path));
    } catch (e) {
      console.warn("Unable to read config: " + e);
    }
  }
  return config;
}
