export interface TagConfig {
  id: string;
  name: string;
  enabled: boolean;
  temperature: boolean;
  pressure: boolean;
  humidity: boolean;
  battery: boolean;
  acceleration: boolean;
  accelerationX: boolean;
  accelerationY: boolean;
  accelerationZ: boolean;
  interval?: number;
}

export interface Config {
  interval: number;
  debug: 0;
  tags: TagConfig[];
  hassHost: string;
  hassToken?: string;
}

export interface Tag {
  id: string;
  on: (event: string, handler: (data: TagData) => void) => void;
}

export interface TagData {
  timestamp?: number;
  dataFormat?: number;
  rssi?: number;
  humidity: number;
  temperature: number;
  pressure: number;
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;
  acceleration?: number; // computed by ourselves
  battery: number;
}
