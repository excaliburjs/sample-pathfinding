//// c:/programming/exGraph/src/main.ts
//// Main entry point for Excalibur

import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { Engine, DisplayMode, TileMap, Vector, Loader } from "excalibur";
import { ExcaliburAStar, ExcaliburGraph, GraphTileMap, aStarNode, GraphNode } from "@excaliburjs/excalibur-pathfinding";
import { Resources, rlSS } from "./resourcses";
import { Tree, tiles } from "./tiledata";
import { player } from "./player";

// setup Peasy-UI for dom rendering
// data model
export const model = {
  hudWidth: 800,
  hudHeight: 600,
  currentTileIndex: 0,
  targetTileIndex: 0,
  movesRemaining: 0,
  showHUD: false,

  showWarning: false,
  warningColor: "white",
  warningText: "CLICKING A TREE WILL BE IGNORED",
  inputDiagonal: undefined as HTMLInputElement | undefined,
  inputAlgo: undefined as HTMLInputElement | undefined,
  algoDuration: "0.0",
  diagClicked: () => {
    myDijkstraGraph.resetGraph();
    if (model.inputDiagonal) {
      if (model.inputDiagonal.checked) {
        myDijkstraGraph.addTileMap(myGraphTileMap, true);
      } else {
        myDijkstraGraph.addTileMap(myGraphTileMap);
      }
    }
  },
};

// dom template with bindings
const template = `
<style> 
    canvas{ 
        position: fixed; 
        top:50%; 
        left:50%; 
        transform: translate(-50% , -50%); 
    }
    hud-layer{
        position: fixed;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        width: \${hudWidth}px;
        height: \${hudHeight}px;
        border: 1px solid black; 
        pointer-events: none;
          
    }
    hud-flex {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        pointer-events: none;
    }
    #current, #target, #remaining, #duration {
        font-size: 20px;
        margin: 5px;
    }
    #target {
      color: \${warningColor};
    }
    #warning {
        color: red;
        width: 100%;
        text-align: center;
        font-size: 30px;
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
      }

      hud-input {
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: auto;
        position: fixed;
        bottom: 5px;
        left: 5px;
        border: 2px solid white;
        border-radius: 10px;
        wrap-text: true;
        width: 15%;
      }

      hud-instructions {
        text-align: center;
        display: flex; 
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
        position: fixed;
        top: 20%;
        left: 5px ;
        width: 15%;
        wrap-text: true;
        border: 2px solid white;
        border-radius: 10px;
      }
</style> 
<div> 
    <canvas id='cnv'> </canvas> 
    <hud-layer>
        <hud-flex>
          <div id='current' \${===showHUD}>Current Tile: \${currentTileIndex} </div>
          <div id='target' \${===showHUD}>Target Tile: \${targetTileIndex} </div>
          <div id='remaining' \${===showHUD}>Moves Remaining: \${movesRemaining} </div>
          <div id='duration' \${===showHUD}>Algo Duration: \${algoDuration}ms </div>
        </hud-flex>
        <hud-input \${===showHUD}>
          <label for='inputAlgo'>Choose Algorithm</label>
          <select id='inputAlgo' \${==>inputAlgo}>
            <option value='astar'>A*</option>
            <option value='dijkstra'>Dijkstra</option>
          </select> 
          <label for='inputDiagonal'>Allow Diagonals</label>
          <input id='inputDiagonal' type='checkbox' \${click@=>diagClicked} \${==>inputDiagonal}> </input>
        </hud-input>
        
        <hud-instructions \${===showHUD}>
          <label>Instructions</label>
          <p>Click on an open tile to move to it</p>  
        </hud-instructions>
        <div id='warning' \${===showWarning}>\${warningText}</div>
    </hud-layer>
    
</div>`;
await UI.create(document.body, model, template).attached;

//create Excalibur game
export const game = new Engine({
  width: 800, // the width of the canvas
  height: 600, // the height of the canvas
  canvasElementId: "cnv", // the DOM canvas element ID, if you are providing your own
  displayMode: DisplayMode.Fixed, // the display mode
  pixelArt: true,
});

const loader = new Loader();
for (const resource of Object.values(Resources)) loader.addResource(resource);

// Create a tilemap
const tilemap = new TileMap({
  rows: 10,
  columns: 10,
  tileWidth: 16,
  tileHeight: 16,
});

// loop through tilemap cells
let tileIndex = 0;
for (let tile of tilemap.tiles) {
  // get sprite
  const sprite = rlSS.getSprite(tiles[tileIndex].sprite[0], tiles[tileIndex].sprite[1]);
  if (sprite) {
    // all spots gets grass, then if tree, gets tree
    tile.addGraphic(rlSS.getSprite(tiles[0].sprite[0], tiles[0].sprite[1]));
    if (tiles[tileIndex] instanceof Tree) {
      tile.addGraphic(sprite);
      tile.solid = true;
    }
  }
  tileIndex++;
}

// create graph for dijkstra
// configure graph tilemap size and pass in tiles
let myDijkstraGraph = new ExcaliburGraph();
let myGraphTileMap: GraphTileMap = {
  name: "myGraph",
  tiles: [...tiles],
  rows: 10,
  cols: 10,
};
myDijkstraGraph.addTileMap(myGraphTileMap);

// create astar instance
let myGraph = new ExcaliburAStar(tilemap);

// start game, add tilemap, and actor
await game.start(loader);
//show HUD layer, hidden by default
model.showHUD = true;
game.add(tilemap);
game.currentScene.camera.pos = new Vector(80, 80);
game.currentScene.camera.zoom = 3;
game.add(player);

// setup click event for each tile
game.input.pointers.primary.on("down", evt => {
  // gaurd conditions----------------------------------------
  // if you click outside of the tilemap, bail
  // if you click while moving, bail
  // if you click a tree, warn user and bail
  if (evt.worldPos == undefined) return;
  if (player.playerActionStatus == "moving") return;

  //get tile that was clicked
  const tile = game.currentScene.tileMaps[0].getTileByPoint(evt.worldPos);
  if (tile) model.targetTileIndex = tile.x + tile.y * 10;

  // gaurd condition
  if (tiles[model.targetTileIndex] instanceof Tree) {
    model.warningText = "CLICKING A TREE WILL BE IGNORED";
    showWarning();
    return;
  }

  //get player tile
  const playerTile = game.currentScene.tileMaps[0].getTileByPoint(player.pos);
  let playerTileIndex = 0;
  if (playerTile) playerTileIndex = playerTile.x + playerTile.y * 10;
  let targetTileIndex = 0;
  if (tile) targetTileIndex = tile.x + tile.y * 10;
  // const path = myGraph.shortestPath(myGraph.nodes.get(`${playerTileIndex}`)!, myGraph.nodes.get(`${targetTileIndex}`)!);
  const letDiag = model.inputDiagonal?.checked ? true : false;

  // pick which algorithm
  let startingIndex = 0;
  let path: GraphNode[] | aStarNode[] = [];

  if (model.inputAlgo?.value == "dijkstra") {
    path = myDijkstraGraph.shortestPath(
      myDijkstraGraph.nodes.get(`${playerTileIndex}`)!,
      myDijkstraGraph.nodes.get(`${targetTileIndex}`)!
    );

    model.algoDuration = myDijkstraGraph.duration.toFixed(3);
    model.movesRemaining = path.length - 1;
    startingIndex = 1;
    if (path.length == 1 && startingIndex == 1) {
      model.warningText = "UNREACHABLE TILE";
      showWarning();
    }
  } else if (model.inputAlgo?.value == "astar") {
    path = myGraph.astar(myGraph.getNodeByIndex(playerTileIndex), myGraph.getNodeByIndex(targetTileIndex), letDiag);

    model.algoDuration = myGraph.duration.toFixed(3);
    model.movesRemaining = path.length;
    if (path.length == 0) {
      model.warningText = "UNREACHABLE TILE";
      showWarning();
    }
  }

  // don't push the player's current tile, so we start at index 1
  for (let i = startingIndex; i < path.length; i++) {
    const nxtPath = path[i];
    player.playerActionBuffer.push(parseInt(nxtPath.id.toString()));
  }
});

// Utility function that manages the data model
// for peasy to flash the warning on the HUD
function showWarning() {
  model.showWarning = true;
  model.warningColor = "red";
  setTimeout(() => {
    model.showWarning = false;
    model.warningColor = "white";
  }, 2000);
}
