import { calculateAcceleration } from "./calc";
import { postTag } from "./hass-interface";
import { presentUnconfiguredTag } from "./help";
import { Config, Tag, TagData } from "./types";

export default class Manager {
  private lastUpdateTimestamps: { [id: string]: number } = {};
  private tagDatas: { [id: string]: TagData } = {};
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public handleRuuviUpdate = (tag: Tag, data: TagData): void => {
    const tagConfig = this.config.tags.find(c => c.id === tag.id);
    if (!tagConfig && !this.tagDatas[tag.id]) {
      presentUnconfiguredTag(tag, data);
    }
    const timestamp = +new Date();
    calculateAcceleration(data);

    this.tagDatas[tag.id] = { ...data, timestamp };
    const lastUpdateTs = this.lastUpdateTimestamps[tag.id] || 0;
    if (!(tagConfig && tagConfig.enabled)) {
      return;
    }
    const interval = (tagConfig.interval || 0 || this.config.interval) * 1000;
    if (interval > 0 && timestamp - lastUpdateTs >= interval) {
      this.lastUpdateTimestamps[tag.id] = timestamp;
      postTag(this.config, tag, tagConfig, data);
    }
  };
}
