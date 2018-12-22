import { Tag, TagConfig, TagData } from "./types";

export function presentUnconfiguredTag(tag: Tag, data: TagData) {
  const exampleConfig: TagConfig = {
    id: tag.id,
    name: "some-name",
    enabled: true,
    temperature: true,
    pressure: true,
    humidity: true,
    battery: true,
    acceleration: false,
    accelerationX: false,
    accelerationY: false,
    accelerationZ: false,
  };
  const buf = [
    `Found an unconfigured tag ${tag.id}. This will only be shown once per tag.`,
    `To help you identify this tag, its current information follows.`,
    `  ${JSON.stringify(data)}`,
    `To have its status posted to Home Assistant, add the following to the tags configuration:`,
    `  ${JSON.stringify(exampleConfig)}`,
  ];
  console.log(buf.join("\n"));
}
