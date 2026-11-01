import { Scene, Color } from 'three/webgpu'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'

let instance = null

export default class Experience {
    constructor(canvas){
        if(instance) return instance
        instance = this
        window.experience = this

        this.canvas = canvas
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new Scene()
        this.scene.background = new Color('#203040')
        this.camera = new Camera()
        this.renderer = new Renderer()

        this.sizes.addEventListener('resize', () => this.resize())
        this.time.addEventListener('tick', () => this.update())
    }

    resize(){
        this.camera.resize()
        this.renderer.resize()
    }

    update(){
        this.camera.update()
        this.renderer.update()   // siempre último
    }
}