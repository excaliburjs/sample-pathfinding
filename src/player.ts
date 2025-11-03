import { Actor, Vector, EasingFunctions, Engine } from "excalibur";
import { game, model } from "./main";
import {plrWalk, plrImage} from "./resourcses";

// create and configure player, and his action buffer

class Player extends Actor {
  playerActionBuffer: any = [];
  playerActionStatus = "idle";

  constructor(options: any) {
    super(options);
    this.graphics.use(plrWalk);
    this.graphics.onPreDraw = (()=>{
        if(this.playerActionBuffer.length>0 || this.actions.getQueue().hasNext()){
            this.graphics.use(plrWalk);
        }
        else{
            this.graphics.use(plrImage);
        }
    })
  }

  _postupdate(engine: Engine<any>, delta: number): void {
    if (this.playerActionBuffer.length > 0 && !this.actions.getQueue().hasNext()) {
        // get next tile off action buffer and moveTo
        const nextTile = this.playerActionBuffer.shift();
        model.currentTileIndex = nextTile;
        this.moveToTile(nextTile);
      }
  }
  moveToTile(node: number) {
    //convert node, which is flat array index into x and y
    let x = node % 10;
    let y = Math.floor(node / 10);
    //get vector between player and tile
    let target = new Vector(x * 16 + 8, y * 16 + 8);
    player.actions.easeTo(target, 400, EasingFunctions.EaseInOutCubic).callMethod(()=>{
        model.movesRemaining--; // this updates HUD with moves remaining data
    });
  }
}

export let player = new Player({
  pos: new Vector(8, 8),
  width: 16,
  height: 16,
});
