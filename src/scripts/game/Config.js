import { Game } from "./Game";
import { Tools } from "../system/Tools";

export const Config = {
    score: {
      x: 10,
      y: 10,
      anchor: 0, 
      style: {
        fontFamily: "Verdana",
        fontWeight: "bold",
        fontSize: 44,
        fill: ["#FF7F50"]
      }
    },
    bgSpeed: 2,
    hero: {
      jumpSpeed: 15,
      moveSpeed: 4,
      maxJumps: 1,
      position: {
        x: 300,
        y: 350
      }
    },
    
    platforms: {
      ranges: {
        rows: {
          min: 2,
          max: 6
        },
        cols: {
          min: 3,
          max: 9
        },
        offset: {
          min: 60,
          max: 200
        }
      },
      moveSpeed: -1.5
    },

    diamonds: {
      chance: 1,
      offset: {
        min: 50,
        max: 100
      }
    },
    
    loader: Tools.massiveRequire(require["context"]('./../../sprites/', true, /\.(mp3|png|jpe?g)$/)),
    scenes: {
        "Game": Game
    }
};