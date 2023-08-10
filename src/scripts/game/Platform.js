import * as PIXI from "pixi.js";
import * as Matter from 'matter-js';
import { App } from '../system/App';
import { Diamond } from "./Diamond";

export class Platform {
  constructor(rows, cols, x, y) {
    this.rows = rows
    this.cols = cols
    this.tileSize = PIXI.Texture.from("tile").width
    this.width = this.tileSize * this.cols
    this.height = this.tileSize * this.rows

    this.createContainer(x, y)
    this.createTiles()

    // Specify the speed of the platform.
    this.dx = App.config.platforms.moveSpeed
    this.createBody()
    this.diamonds = []
    this.createDiamonds()
  }

  createContainer(x, y) {
    this.container = new PIXI.Container();
    this.container.x = x
    this.container.y = y
  }

  createTiles() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.createTile(row, col)
      }
    }
  }

  createTile(row, col) {
    const texture = row === 0 ? "platform" : "tile" 
    const tile = App.sprite(texture);
    this.container.addChild(tile);
    tile.x = col * tile.width;
    tile.y = row * tile.height;
  }

  createBody() {
    // Create a physical body.
    this.body = Matter.Bodies.rectangle(this.width / 2 + this.container.x,
                                        this.height / 2 + this.container.y,
                                        this.width, this.height,
                                        {friction: 0, isStatic: true})

    // Add the created body to the engine.
    Matter.World.add(App.physics.world, this.body)

    // Save a reference to the platform object itself 
    // for further access from the physical body object.
    // Sorry, I don't actually understand this line.
    this.body.gamePlatform = this
  }

  createDiamonds() {
    const y = App.config.diamonds.offset.min + Math.random() * (
              App.config.diamonds.offset.max - App.config.diamonds.offset.min)

    for (let i = 0; i < this.cols; i++) {
      if (Math.random() < App.config.diamonds.chance) {
        this.createDiamond(this.tileSize * i, -y)
      }
    }
  }

  createDiamond(x, y) {
    const diamond = new Diamond(x, y)
    this.container.addChild(diamond.sprite)
    diamond.createBody()
    this.diamonds.push(diamond)
  }

  destroy() {
    Matter.World.remove(App.physics.world, this.body)
    this.diamonds.forEach(diamond => diamond.destroy())
    this.container.destroy()
  }
}