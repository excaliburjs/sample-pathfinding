import {Animation, AnimationStrategy, ImageSource, SpriteSheet} from "excalibur";

import dude from "./assets/dude.png";
import tiles from "./assets/tiles.png";
import roguelikess from "./assets/roguelike.png";

const dudeSpritesheet = new ImageSource(dude)
const PlayerSheet = SpriteSheet.fromImageSource({
    image: dudeSpritesheet,
    grid: {columns: 3, rows: 1, spriteHeight: 16, spriteWidth: 16}
});
export const plrImage = PlayerSheet.sprites[0];

export const plrWalk = new Animation({
    // put your desired frame numbers here
    frames: [0, 1, 0, 2].map((i) => ({
        graphic: PlayerSheet.sprites[i],
        duration: 200,
    })),
    strategy: AnimationStrategy.Loop,
})
const kennyRougeLikePack = new ImageSource(roguelikess);
export const rlSS = SpriteSheet.fromImageSource({
    image: kennyRougeLikePack,
    grid: {columns: 57, rows: 31, spriteHeight: 16, spriteWidth: 16},
    spacing: {margin: {x: 1, y: 1}},
});

const tilesSource = new ImageSource(tiles);
export const TileSheet = SpriteSheet.fromImageSource({
    image: tilesSource,
    grid: {columns: 4, rows: 1, spriteHeight: 16, spriteWidth: 16},
});

export const Resources = {
    dudeSpritesheet,
    kennyRougeLikePack,
    tilesSource
};
