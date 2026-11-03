import { HemisphereLight , DirectionalLight } from 'three/webgpu'

import Experience from '../Experience.js'

export default class Environment {
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setHemisphereLight()
        this.setDirectionalLight()
    }

    setHemisphereLight(){
        this.hemisphereLight = new HemisphereLight('#e4e6eb', '#3a3f46', 1.2)
        this.scene.add(this.hemisphereLight)
    }

    setDirectionalLight(){
        this.directionalLight = new DirectionalLight(0xe8e5d8, 1.5)
        this.directionalLight.position.set(-8, 12, 6)
        this.directionalLight.castShadow = true
        this.directionalLight.shadow.mapSize.set(2048, 2048)

        const shadowCamera = this.directionalLight.shadow.camera
        shadowCamera.left = -12
        shadowCamera.right = 12
        shadowCamera.top = 12
        shadowCamera.bottom = -12
        shadowCamera.near = 1
        shadowCamera.far = 40

        this.directionalLight.shadow.normalBias = 0.02

        this.scene.add(this.directionalLight)
    }
}