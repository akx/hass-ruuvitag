import ruuvi from "node-ruuvitag";
import packageInfo from "./package.json";

import { readConfig } from "./lib/config";
import Manager from "./lib/Manager";
import { Tag, TagData } from "./lib/types";

console.log(`This is ${packageInfo.name} ${packageInfo.version}, terrrrrrrve`);

const config = readConfig(process.env.OPTIONS_JSON_PATH || "/data/options.json");
if (!config.hassToken) {
  console.warn("Config: no HASSIO_TOKEN, will probably not be able to post data");
}

const manager = new Manager(config);
ruuvi.on("found", (tag: Tag) => {
  tag.on("updated", (data: TagData) => manager.handleRuuviUpdate(tag, data));
});
