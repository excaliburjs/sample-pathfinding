import { Actor, Vector, EasingFunctions, Engine } from "excalibur";
import { game, model } from "./main";
import { Resources } from "./resourcses";

// create and configure player, and his action buffer

class Player extends Actor {
  playerActionBuffer: any = [];
  playerActionStatus = "idle";

  constructor(options: any) {
    super(options);
    this.graphics.use(Resources.plrImage.toSprite());
  }

  _postupdate(engine: Engine<any>, delta: number): void {
    if (this.playerActionBuffer.length > 0) {
      if (this.playerActionStatus == "idle") {
        this.playerActionStatus = "moving";

        // monitor player move completion from
        // game events
        game.events.on("playerMoveComplete", () => {
          // this updates the HUD with the next tile data
          model.currentTileIndex = nextTile;
          this.playerActionStatus = "idle";
        });

        // get next tile off action buffer and moveTo
        const nextTile = this.playerActionBuffer.shift();

        this.moveToTile(nextTile);
      }
    } else {
      // action buffer empty, reset
      this.playerActionStatus = "idle";
    }
  }
  moveToTile(node: number) {
    //convert node, which is flat array index into x and y
    let x = node % 10;
    let y = Math.floor(node / 10);
    //get vector between player and tile
    let target = new Vector(x * 16 + 8, y * 16 + 8);
    player.actions.easeTo(target, 500, EasingFunctions.EaseInOutCubic);
    //delay 500 ms and then emit event for end of move
    setTimeout(() => {
      model.movesRemaining--; // this updates HUD with moves remaining data
      game.events.emit("playerMoveComplete");
    }, 500);
  }
}

export let player = new Player({
  pos: new Vector(8, 8),
  width: 16,
  height: 16,
});
