import * as Matter from 'matter-js'
import { App } from "../system/App";
import { Scene } from "../system/Scene";
import { Background } from "./Background"
import { Platforms } from "./Platforms";
import { Hero } from "./Hero";
import { LabelScore } from './LabelScore';

export class Game extends Scene {
  create() {
    this.createBackground()
    this.createPlatforms()
    this.createHero()
    this.setEvents()
    this.createUI()
  }

  setEvents() {
    Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this))
  }

  onCollisionStart(event) {
    const colliders = [event.pairs[0].bodyA, event.pairs[0].bodyB]
    const hero = colliders.find(body => body.gameHero)
    const platform = colliders.find(body => body.gamePlatform)
    const diamond = colliders.find(body => body.gameDiamond)

    if (hero && platform) {
      this.hero.stayOnPlatform(platform.gamePlatform)
    }

    if (hero && diamond) {
      this.hero.collectDiamond(diamond.gameDiamond)
    }
  }

  createBackground() {
    this.bg = new Background()
    this.container.addChild(this.bg.container)
  }

  createPlatforms() {
    this.platforms = new Platforms();
    this.container.addChild(this.platforms.container);
  }

  createHero() {
    this.hero = new Hero();
    this.keyboard = require('pixi.js-keyboard')
    this.container.addChild(this.hero.sprite);
    this.container.interactive = true
    var keys = {'a': 0, 'd': 0, 'w': 0}
    // TODO: Here you have to fix the hero's movements. Hero can move left and right 
    // and jump at constant speed (with A-W-D keys).
    window.addEventListener('keydown', (event) => {
      console.log(event.key)
      keys[event.key] += 1

      if (keys['a'] > 0) {
          if (keys['a'] === keys['w'] || keys['w'] > 0) {
            this.hero.jumpLeft()
          } else {
            this.hero.moveLeft()
          }
        
      } else if (keys['d'] > 0) {
        if (keys['d'] === keys['w'] || keys['w'] > 0) {
          this.hero.jumpRight()
        } else {
          this.hero.moveRight()
        }

      } else if (keys['w'] > 0) {
        this.hero.startJump()
      }
    })
  
    window.addEventListener('keyup', (event) => {
      keys[event.key] = 0
    })

    this.hero.sprite.once("die", () => {
      App.scenes.start("Game")
    })
  }

  destroy() {
    Matter.Events.off(App.physics, 'collisionStart', this.onCollisionStart.bind(this))
    App.app.ticker.remove(this.update, this)
    this.bg.destroy()
    this.hero.destroy()
    this.platforms.destroy()
    this.labelScore.destroy()
  }

  createUI() {
    this.labelScore = new LabelScore()
    this.container.addChild(this.labelScore)
    this.hero.sprite.on("score", () => {
      this.labelScore.renderScore(this.hero.score)
    })
  }

  update(dt) {
    this.bg.update(dt)
    this.platforms.update(dt);
  }
}
