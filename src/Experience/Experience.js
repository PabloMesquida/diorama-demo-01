import { Scene, Color } from 'three/webgpu'

import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Resources from './Utils/Resources.js'
import Debug from './Utils/Debug.js'
import World from './World/World.js'


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
        this.resources = new Resources()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.debug = new Debug()
        this.world = new World()
        
        this.renderer.instance.setAnimationLoop((t) => this.time.tick(t))

        this.sizes.addEventListener('resize', () => this.resize())
        this.time.addEventListener('tick', () => this.update())
    }

    resize(){
        this.camera.resize()
        this.renderer.resize()
    }

    update(){
        this.camera.update()
        this.renderer.update() 
    }
}