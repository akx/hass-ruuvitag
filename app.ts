import ruuvidriver from "ruuvidriver";
import packageInfo from "./package.json";

import { readConfig } from "./lib/config";
import Manager from "./lib/Manager";
import { Tag, TagData } from "./lib/types";

console.log(`This is ${packageInfo.name} ${packageInfo.version}, terrrrrrrve`);

const config = readConfig(process.env.OPTIONS_JSON_PATH || "/data/options.json");
if (!config.supervisorToken) {
  console.warn("Config: no SUPERVISOR_TOKEN, will probably not be able to post data");
}
ruuvidriver.init();
const ruuvi = ruuvidriver.getRuuvi();
const manager = new Manager(config);
ruuvi.on("found", (tag: Tag) => {
  tag.on("updated", (data: TagData) => manager.handleRuuviUpdate(tag, data));
});
