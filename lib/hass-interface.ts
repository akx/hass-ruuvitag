import fetch, { Response } from "node-fetch";
import { Config, Tag, TagConfig, TagData } from "./types";

interface Datum {
  url: string;
  payload: object;
}

interface HassStateData {
  state: number;
  attributes: { [key: string]: any };
}

interface WrappedResponseOrError {
  datum: Datum;
  response?: Response;
  error?: Error;
}

function doDatumRequest(config: Config, datum: Datum): Promise<WrappedResponseOrError> {
  return fetch(datum.url, {
    method: "post",
    body: JSON.stringify(datum.payload),
    headers: {
      "Content-Type": "application/json",
      "X-HA-Access": config.hassToken || "1",
    },
  })
    .then(response => ({ datum, response }))
    .catch(error => ({ datum, error }));
}

function reportResponse(tag: Tag, { datum, response, error }: WrappedResponseOrError) {
  if (error) {
    console.error(`tag ${tag.id}: failed 1 ${datum.url}: ${error}`);
    return;
  }
  if (response && response.status >= 400) {
    response.text().then(text => {
      console.error(`tag ${tag.id}: failed 2 ${datum.url}: ${text}`);
    });
  }
}

export function createTagDataPayloads(
  config: Config,
  tag: Tag,
  tagConfig: TagConfig,
  data: TagData,
): Datum[] {
  const postData: Datum[] = [];

  function addSimpleNumber(
    key: keyof TagConfig & keyof TagData,
    unit?: string,
    deviceClass?: string,
    scalingFactor: number = 1,
  ) {
    if (!tagConfig[key]) {
      // not enabled?
      return false;
    }
    const value = data[key];
    if (value !== undefined && Number.isFinite(value)) {
      const payload: HassStateData = { state: value * scalingFactor, attributes: {} };
      if (unit) {
        payload.attributes.unit_of_measurement = unit;
      }
      if (deviceClass) {
        payload.attributes.device_class = deviceClass;
      }

      postData.push({
        url: `${config.hassHost}api/states/sensor.${tagConfig.name}_${key}`,
        payload,
      });
      return true;
    }
  }

  addSimpleNumber("temperature", "°C", "temperature");
  addSimpleNumber("pressure", "hPa", "pressure", 1 / 100);
  addSimpleNumber("humidity", "%", "humidity");
  addSimpleNumber("battery", "mV");
  addSimpleNumber("acceleration", "mG");
  addSimpleNumber("accelerationX", "mG");
  addSimpleNumber("accelerationY", "mG");
  addSimpleNumber("accelerationZ", "mG");
  return postData;
}

export function postTag(config: Config, tag: Tag, tagConfig: TagConfig, data: TagData) {
  const postData = createTagDataPayloads(config, tag, tagConfig, data);
  if (config.debug & 1) {
    console.info(postData);
  }
  return Promise.all(postData.map(datum => doDatumRequest(config, datum))).then(
    responses => {
      responses.forEach(response => reportResponse(tag, response));
      return responses;
    },
  );
}

module.exports.postTag = postTag;
