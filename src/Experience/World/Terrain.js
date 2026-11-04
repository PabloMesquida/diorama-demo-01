import { BoxGeometry, Mesh} from 'three/webgpu'
import { GridMaterial } from 'grid-tsl'
import { createGridDebug } from 'grid-tsl/debug' 

import Experience from '../Experience.js'

export default class Terrain {
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.terrainMaterial = new GridMaterial({
            projection: 'box',
            backgroundColor: '#434c55',
            primaryColor: '#4e5861',
            primarySpacing: 5,
            primaryThickness: 0.01,
            secondaryColor: '#4e5861',
            secondarySpacing: 1,
            secondaryThickness: 0.01,
            crossColor: '#4e5861',
            crossSpacing: 2,
            crossSize: 0.22,
            crossThickness: 0.02,
            faceShading: 0.15,
            receiveShadows: true,
            shadowColor: '#000000',
            shadowIntensity: 0.25,
            matte: true,
            grain: 0.03,
            grainSize: 0.2,
            mottle: 0.05,
            mottleSize: 2.8,
            lineWear: 0.53,
            lightPool: 2.29,
            lightPoolRadius: 25,
            fade: true,
            fadeRadius: 40,
            fadeSoftness: 0.7,
            fadeCenter: [0, -5],
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
        this.lower.castShadow = true
        this.lower.receiveShadow = true
    }

    setUpper(){
        const geometry = new BoxGeometry(10, 2, 10)
        geometry.translate(0, 0, -5)

        const material = this.terrainMaterial

        this.upper = new Mesh(geometry, material)
        this.upper.name = "Terrain Upper"

        this.scene.add(this.upper)
        this.upper.castShadow = true
        this.upper.receiveShadow = true
    }
}