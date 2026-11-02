import { AmbientLight, DirectionalLight } from 'three/webgpu'

import Experience from '../Experience.js'

export default class Environment {
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setAmbientLight()
        this.setDirectionalLight()
    }

    setAmbientLight(){
        this.ambientLight = new AmbientLight(0xffffff, 0.5)
        
        this.scene.add(this.ambientLight)
    }

    setDirectionalLight(){
        this.directionalLight = new DirectionalLight(0xffffff, 1.5)
        this.directionalLight.position.set(4, 6, 3)

        this.scene.add(this.directionalLight)
    }
}