import { BoxGeometry, Data3DTexture, LinearFilter, Mesh, RedFormat} from 'three/webgpu'
import { positionWorld, texture3D, uniform, vec3 } from 'three/tsl' 
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

        this.setRockShading()
        
        this.setDebug()

        this.setLower()
        this.setUpper()
    }

    setRockShading(){
        const data = new Uint8Array(this.experience.resources.items.rocksDistance)

        const texture = new Data3DTexture(data, 144, 14, 115)
        texture.format = RedFormat
        texture.minFilter = LinearFilter
        texture.magFilter = LinearFilter
        texture.needsUpdate = true

        this.rockShading = {
            strength: uniform(0.7),
            reach: uniform(0.6)
        }

        const uvw = positionWorld.sub(vec3(-7.883, -0.2, -3.125)).div(vec3(14.4, 1.4, 11.5))
        const distance = texture3D(texture, uvw).r.mul(1.4)
        const shade = distance.div(this.rockShading.reach).saturate().oneMinus().pow(1.6).mul(this.rockShading.strength).oneMinus()

        this.terrainMaterial.colorNode = this.terrainMaterial.colorNode.mul(shade)
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