import { BoxGeometry, Mesh} from 'three/webgpu'
import { GridMaterial } from 'grid-tsl'
import { createGridDebug } from 'grid-tsl/debug' 

import Experience from '../Experience.js'

export default class Terrain {
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.terrainMaterial = new GridMaterial({
            backgroundColor: "#297491",  
            crossColor: "#9da7ab",
            primaryColor: "#8a8f28",
            secondaryColor: "#8e9da3",
            projection: 'box',
            fade: true,
            primarySpacing: 10,
            secondarySpacing: 2,
            crossSpacing: 1,
            crossSize: 0.15
        })

        this.setDebug()

        this.setLower()
        this.setUpper()
    }

    setDebug(){
        if(!this.experience.debug.active) return

        createGridDebug(this.terrainMaterial, {
            renderer: this.experience.renderer.instance,
            title: 'Terrain grid',
        })
    }

    setLower(){
        const geometry = new BoxGeometry(100, 1, 100)
        geometry.translate(0, -0.5, 0)

        const material = this.terrainMaterial

        this.lower = new Mesh(geometry, material)
        this.lower.name = 'Terrain Lower'

        this.scene.add(this.lower)
    }

    setUpper(){
        const geometry = new BoxGeometry(10, 2, 10)
        geometry.translate(0, 0, -5)

        const material = this.terrainMaterial

        this.upper = new Mesh(geometry, material)
        this.upper.name = "Terrain Upper"

        this.scene.add(this.upper)
    }
}