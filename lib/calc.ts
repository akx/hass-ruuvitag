import { TagData } from "./types";

export function calculateAcceleration(tagData: TagData): void {
  tagData.acceleration =
    Math.abs(tagData.accelerationX) +
    Math.abs(tagData.accelerationY) +
    Math.abs(tagData.accelerationZ);
}
