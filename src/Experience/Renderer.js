import { WebGPURenderer } from 'three/webgpu'
import Experience from './Experience.js'

export default class Renderer{
    constructor(){
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes

        this.setInstance()
        this.setAnimationLoop()
    }

    setInstance(){
        this.instance = new WebGPURenderer({ canvas: this.canvas, antialias: true})
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.setSize(this.sizes.width, this.sizes.height)
    }

    resize(){
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.setSize(this.sizes.width, this.sizes.height)
    }

    update(){
        this.instance.render(this.experience.scene, this.experience.camera.instance)
    }

    setAnimationLoop(){
        this.instance.setAnimationLoop((timestamp) => this.experience.time.tick(timestamp))
    }
}