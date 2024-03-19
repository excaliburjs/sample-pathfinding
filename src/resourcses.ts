import { ImageSource, SpriteSheet } from "excalibur";

import dude from "./assets/dude.png";
import roguelikess from "./assets/roguelike.png";

const plrImage = new ImageSource(dude);
const kennyRougeLikePack = new ImageSource(roguelikess);
export const rlSS = SpriteSheet.fromImageSource({
  image: kennyRougeLikePack,
  grid: { columns: 57, rows: 31, spriteHeight: 16, spriteWidth: 16 },
  spacing: { margin: { x: 1, y: 1 } },
});

export const Resources = {
  plrImage,
  kennyRougeLikePack,
};
