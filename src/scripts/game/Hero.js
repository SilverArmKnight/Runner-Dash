import * as PIXI from "pixi.js"
import * as Matter from 'matter-js';
import { App } from '../system/App'

export class Hero {
  constructor() {
    this.createSprite();
    this.createBody()
    App.app.ticker.add(this.update, this)
    this.dy = App.config.hero.jumpSpeed
    this.dx = App.config.hero.moveSpeed
    this.platformSpeed = App.config.platforms.moveSpeed
    this.maxJumps = App.config.hero.maxJumps
    this.jumpIndex = 0
    this.moveIndex = 0
    this.score = 0
    this.keyboard = require('pixi.js-keyboard')
  }

  collectDiamond(diamond) {
    ++this.score
    Matter.World.remove(App.physics.world, diamond.body)
    if (diamond.sprite) {
      diamond.sprite.destroy()
      diamond.sprite = null
    }
    this.sprite.emit("score")
  }

  createSprite() {
    this.sprite = new PIXI.AnimatedSprite([
        App.res("walk1"),
        App.res("walk2")
    ]);

    this.sprite.x = App.config.hero.position.x;
    this.sprite.y = App.config.hero.position.y;

    this.sprite.loop = true;
    this.sprite.animationSpeed = 0.1;
    
    this.sprite.play();
  }

  createBody() {
    this.body = Matter.Bodies.rectangle(this.sprite.x + this.sprite.width / 2,
                                        this.sprite.y + this.sprite.height / 2,
                                        this.sprite.width, this.sprite.height,
                                        {friction: 0})
    Matter.World.add(App.physics.world, this.body)
    this.body.gameHero = this
  }

  startJump() {
    if (this.platform || this.jumpIndex == 0) {
      ++this.jumpIndex
      this.platform = null
      Matter.Body.setVelocity(this.body, {x: 0, y: - this.dy})
    }
  }

  // moveLeft()
  moveLeft() {
    if (this.platform || this.moveIndex == 0) {
      ++this.moveIndex
      Matter.Body.setVelocity(this.body, {x: - this.dx + this.platformSpeed, y: 4})
    }
  }

  // moveRight(). Testing
  moveRight() {
    if (this.platform || this.moveIndex == 0) {
      ++this.moveIndex
      Matter.Body.setVelocity(this.body, {x: this.dx, y: 4})
    }
  }

  jumpLeft() {
    if (this.platform || this.jumpIndex == 0 || this.moveIndex == 0) {
      ++this.jumpIndex
      ++this.moveIndex
      this.platform = null
      Matter.Body.setVelocity(this.body, {x: - this.dx + this.platformSpeed, y: - this.dy})
    }
  }

  jumpRight() {
    if (this.platform || this.jumpIndex == 0 || this.moveIndex == 0) {
      ++this.jumpIndex
      ++this.moveIndex
      this.platform = null
      Matter.Body.setVelocity(this.body, {x: this.dx, y: - this.dy})
    }
  }

  stayOnPlatform(platform) {
    this.platform = platform
    this.jumpIndex = 0
    this.moveIndex = 0
  }

  update() {
    this.sprite.x = this.body.position.x - this.sprite.width / 2
    this.sprite.y = this.body.position.y - this.sprite.height / 2
    

    
    if (this.sprite.y > window.innerHeight) {
      this.sprite.emit("die")
    } else if (this.sprite.x < 0) {
      this.sprite.x = 1
    } else if (this.sprite.x > window.innerWidth - 80) {
      // Check viewport
      this.sprite.x = window.innerWidth - 80
    } 
  }

  destroy() {
    App.app.ticker.remove(this.update, this)
    Matter.World.add(App.physics.world, this.body)
    this.sprite.destroy()
  }
}