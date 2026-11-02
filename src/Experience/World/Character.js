import { SkeletonHelper } from 'three/webgpu'

import Experience from '../Experience.js'

export default class Character {
    constructor(){
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.resource = this.experience.resources.items.characterModel
        this.model = this.resource.scene

        this.scene.add(this.model)

        this.setDebug()
    }

    setDebug(){
        if(!this.experience.debug.active) return

        this.skeletonHelper = new SkeletonHelper(this.model)
        this.scene.add(this.skeletonHelper)
    }
}