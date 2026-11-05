import { WebGPURenderer, ACESFilmicToneMapping, PCFShadowMap } from 'three/webgpu'
import Experience from './Experience.js'

export default class Renderer {
    constructor(){
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes

        this.setInstance()
    }

    async init(){
        await this.instance.init()

        if(!this.instance.backend.isWebGPUBackend){
            throw new Error('WebGPUBackend is not available in this browser')
        }
    }

    async compile(){
        await this.instance.compileAsync(this.experience.scene, this.experience.camera.instance)
    }

    setInstance(){
        this.instance = new WebGPURenderer({ canvas: this.canvas, antialias: true,  alpha: false})
        this.instance.toneMapping = ACESFilmicToneMapping
        this.instance.toneMappingExposure = 1.5;
        this.instance.setClearColor(0x000000)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = PCFShadowMap
    }

    resize(){
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.setSize(this.sizes.width, this.sizes.height)
    }

    update(){
        this.instance.render(this.experience.scene, this.experience.camera.instance)
    }
}