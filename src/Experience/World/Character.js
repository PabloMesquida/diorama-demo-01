import { createProceduralHuman, rigifyMapping } from 'three-procedural-locomotion'
import { SkeletonHelper } from 'three/webgpu'

import Experience from '../Experience.js'

export default class Character {
    constructor(ground){
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.time = this.experience.time
        this.resource = this.experience.resources.items.characterModel
        this.model = this.resource.scene
        this.model.position.set(0, 0, 3)

        this.scene.add(this.model)

        this.human = createProceduralHuman({
            model: this.model,
            mapping: rigifyMapping,
            ground
        })

        this.setDebug()
    }

    setDebug(){
        if(!this.experience.debug.active) return

        this.skeletonHelper = new SkeletonHelper(this.model)
        this.scene.add(this.skeletonHelper)
        console.log('human warnings:', this.human.warnings)
    }

    update(){
        this.human.update(this.time.delta)
    }
}