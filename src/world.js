// 37:03 - https://youtu.be/PxSb2thycmE?si=Hb7Ad018f4Zeu-FB&t=2223


import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

import { RandomNumberGenerator } from "./random";

// Define the cube geometry and material.
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x00d000});

// Main World class is responsible for creating the world.
export class World extends THREE.Group {
    constructor(size = { width: 32, height: 16 }) {
        super();

        this.size = size;

        this.data = [];
        this.parameters = {
            seed: 69,
            terrain: {
                scale: 80,
                magnitude: 0.4,
                offset: 0.5
            }
        };
    }

    // Main methods.
    generate() {
        this.initialiseTerrain();
        this.generateTerrain();
        this.generateMeshes();
    }

    initialiseTerrain() {
        // Clear the blocks data.
        this.data = [];

        // Main loop to go through all the blocks.
        for (let x = 0; x < this.size.width; x++) {
            const slice = [];

            for (let y = 0; y < this.size.height; y++) {
                const row = [];

                for (let z = 0; z < this.size.width; z++) {
                    row.push({
                        id: 0,
                        instanceId: null
                    });
                }
                
                slice.push(row);
            }

            this.data.push(slice);
        }
    }

    generateTerrain() {
        const generator = new RandomNumberGenerator(this.parameters.seed);
        const simplexNoise = new SimplexNoise(generator);
        
        for (let x = 0; x < this.size.width; x++) {
            for (let z = 0; z < this.size.width; z++) {
                const value = simplexNoise.noise(
                    x / this.parameters.terrain.scale,
                    z / this.parameters.terrain.scale
                );
                const scaledNoise = this.parameters.terrain.offset + this.parameters.terrain.magnitude * value;

                let height = Math.floor(this.size.height * scaledNoise);
                height = Math.max(0, Math.min(height, this.size.height));

                for (let y = 0; y <= height; y++) {
                    this.setBlockId(x, y, z, 1);
                }
            }
        }
    }

    generateMeshes() {
        // Remove the previous meshes inside.
        this.clear();

        // Create an instanced mesh for max performance.
        const maxNumberOfBlocks = this.size.width * this.size.width * this.size.height;
        const mesh = new THREE.InstancedMesh(geometry, material, maxNumberOfBlocks);
        mesh.count = 0;

        // Create a matrix for using mesh.setMatrixAt().
        const matrix = new THREE.Matrix4();

        // Main loop for creating the world.
        for (let x = 0; x < this.size.width; x++) {
            for (let y = 0; y < this.size.height; y++) {
                for (let z = 0; z < this.size.width; z++) {
                    const blockId = this.getBlock(x, y, z).id;
                    const blockInstanceId = mesh.count;

                    if (blockId !== 0) {
                        matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
                        mesh.setMatrixAt(blockInstanceId, matrix);
                        
                        this.setBlockInstanceId(x, y, z, blockInstanceId);
                        mesh.count++;
                    }
                }
            }
        }

        // Adding the instanced mesh to the group.
        this.add(mesh);
    }


    // Helper methods.
    getBlock(x, y, z) {
        if (this.inBounds(x, y, z))
            return this.data[x][y][z];
        return null;
    }

    setBlockId(x, y, z, id) {
        if (this.inBounds(x, y, z)) {
            this.data[x][y][z].id = id;
        }
    }

    setBlockInstanceId(x, y, z, instanceId) {
        if (this.inBounds(x, y, z)) {
            this.data[x][y][z].instanceId = instanceId;
        }
    }

    inBounds(x, y, z) {
        if (
            (x >= 0 && x < this.size.width) &&
            (y >= 0 && y < this.size.height) &&
            (z >= 0 && z < this.size.width)
        ) return true;
        return false;
    }
}