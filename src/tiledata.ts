// for tilemap creation, create tiles with a sprite info and
// a collider setting for Graph parsing

function weightedRandom<T>(options: { value: T; weight: number }[]): T {
    const total = options.reduce((sum, o) => sum + o.weight, 0);
    let r = Math.random() * total;
    for (const o of options) {
        if ((r -= o.weight) <= 0) return o.value;
    }
    return options[options.length - 1].value; // fallback
}

const grassTileIndices = [
    {value: 2, weight: 1},
    {value: 1, weight: 3},
    {value: 0, weight: 6},
];

export class Grass {
    sprite = [weightedRandom(grassTileIndices), 0];
    collider: boolean = false;
}

export class Tree {
    sprite = [3, 0];
    collider: boolean = true;
}

// load tiles array with tiles, doing this separately so that i can
// a-> use it for Excalibur's tilemap
// and b-> pass it to Graph for pathfinding
export const tiles = [
    new Grass(),
    new Grass(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Tree(),
    new Tree(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Tree(),
    new Tree(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Tree(),
    new Tree(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Tree(),
    new Grass(),
    new Grass(),
    new Grass(),
    new Grass(),
];
