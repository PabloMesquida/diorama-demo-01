import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three/webgpu'

import Experience from '../Experience.js'
import Environment from './Environment.js'

export default class World {
    constructor(){
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.addEventListener('ready', () => {
            this.environment = new Environment()
            this.setTestCube()
        })
    }

    setTestCube(){
        const geometry = new BoxGeometry(1, 1, 1)
        const material = new MeshNormalMaterial()

        this.testCube = new Mesh(geometry, material)
        this.scene.add(this.testCube)
    }
} 