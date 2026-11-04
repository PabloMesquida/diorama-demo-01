import { StaticGroundDetector } from 'three-procedural-locomotion'

import Experience from '../Experience.js'
import Environment from './Environment.js'
import Terrain from './Terrain.js'
import Character from './Character.js'
import Rocks from './Rocks.js'
import Dirt from './Dirt.js'
import Tree from './Tree.js' 

export default class World {
    constructor(){
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.environment = new Environment()
        this.terrain = new Terrain()
        this.rocks = new Rocks()
        this.dirt = new Dirt()
        this.tree = new Tree()
        this.ground = new StaticGroundDetector([this.terrain.lower, this.terrain.upper, this.rocks.model])
        this.character = new Character(this.ground)
    }

    update(){
        this.character.update()
        this.tree.update()
    }
} 