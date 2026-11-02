import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three/webgpu'
import { StaticGroundDetector } from 'three-procedural-locomotion'

import Experience from '../Experience.js'
import Environment from './Environment.js'
import Terrain from './Terrain.js'
import Character from './Character.js'

export default class World {
    constructor(){
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.environment = new Environment()
        this.terrain = new Terrain()
        this.ground = new StaticGroundDetector([this.terrain.lower, this.terrain.upper])
        this.character = new Character(this.ground)

        this.setTestCube()
    }

    setTestCube(){
        const geometry = new BoxGeometry(1, 1, 1)
        const material = new MeshNormalMaterial()

        this.testCube = new Mesh(geometry, material)
        this.testCube.position.set(2, 0.5, 1)

        this.scene.add(this.testCube)
    }

    update(){
        this.character.update()
    }
} 