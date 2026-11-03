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
        this.ambientLight = new AmbientLight(0xe4e6eb, 1)
        
        this.scene.add(this.ambientLight)
    }

    setDirectionalLight(){
        this.directionalLight = new DirectionalLight(0xe8e5d8, 1.5)
        this.directionalLight.position.set(4, 6, 3)

        this.scene.add(this.directionalLight)
    }
}