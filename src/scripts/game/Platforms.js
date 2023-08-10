import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Platform } from "./Platform";

export class Platforms {
  constructor() {
    this.platforms = [];
    this.container = new PIXI.Container();

    this.createPlatform({
        rows: 4,
        cols: 5,
        x: 150,
        y: 500
    })

    this.createPlatform({
      rows: 2,
      cols: 2,
      x: 650,
      y: 400
    })

    this.createPlatform({
      rows: 2,
      cols: 2,
      x: 950,
      y: 300
    })

    this.createPlatform({
      rows: 2,
      cols: 2,
      x: 1250,
      y: 200
    })
  }

  createPlatform(data) {
    const platform = new Platform(data.rows, data.cols, data.x, data.y);
    this.container.addChild(platform.container);
    this.platforms.push(platform);
    this.current = platform;
  }

  update() {

  }

  destroy() {
    this.platforms.forEach(platform => platform.destroy())
    this.container.destroy()
  }
}