import { Config } from "./types";

export function getBaseConfig(): Config {
  return {
    interval: 30,
    debug: 0,
    tags: [],
    hassHost: process.env.HASS_HOST || "http://hassio/homeassistant/",
    hassToken: process.env.HASSIO_TOKEN,
  };
}

export function readConfig(path?: string): Config {
  const config = getBaseConfig();
  if (path) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      Object.assign(config, require(path));
    } catch (e) {
      console.warn("Unable to read config: " + e);
    }
  }
  return config;
}
