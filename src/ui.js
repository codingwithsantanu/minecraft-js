import GUI from "three/addons/libs/lil-gui.module.min.js";

export function createUI(world) {
    const gui = new GUI();

    // World size parameters.
    gui.add(world.size, "width", 8, 128, 1).name("Width");
    gui.add(world.size, "height", 8, 64, 1).name("Height");

    // World seed parameters.
    const terrain = gui.addFolder("Terrain");
    terrain.add(world.parameters, "seed", 0, 10000).name("Seed");
    terrain.add(world.parameters.terrain, "scale", 10, 100).name("Scale");
    terrain.add(world.parameters.terrain, "magnitude", 0, 1).name("Magnitude");
    terrain.add(world.parameters.terrain, "offset", 0, 1).name("Offset");

    gui.onChange(() => {
        world.generate();
    });
}