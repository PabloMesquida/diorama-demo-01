import { Scene, Color } from 'three/webgpu'

import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Resources from './Utils/Resources.js'
import Debug from './Utils/Debug.js'
import World from './World/World.js'

import sources from './sources.js'

let instance = null

export default class Experience {
    constructor(canvas){
        if(instance) return instance
        instance = this
        window.experience = this

        this.canvas = canvas

        this.init().catch((error) => console.error(error))
    }

    async init(){
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new Scene()
        this.scene.background = new Color('#203040')

        this.camera = new Camera()
        this.renderer = new Renderer()
        
        this.sizes.addEventListener('resize', () => this.resize())

        await this.renderer.init()

        this.debug = new Debug()

        this.resources = new Resources()
        await this.resources.load(sources)

        this.world = new World()

        await this.renderer.compile()

        
        this.time.addEventListener('tick', () => this.update())
        this.renderer.instance.setAnimationLoop((t) => this.time.tick(t))
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