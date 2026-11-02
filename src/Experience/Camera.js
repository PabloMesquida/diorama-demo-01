import { PerspectiveCamera } from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import Experience from './Experience.js'

export default class Camera{
    constructor(){
        this.experience = new Experience()

        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes

        this.setInstance()
        this.setOrbitControls()
    }

    setInstance(){
        this.instance = new PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(12, 9, 14)
    }

    setOrbitControls(){
        this.controls = new OrbitControls(this.instance, this.canvas)

        this.controls.enableDamping = true
        this.controls.maxPolarAngle = Math.PI * 0.49
        this.controls.update()
    }

    resize(){
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update(){
        this.controls.update()
    }
}