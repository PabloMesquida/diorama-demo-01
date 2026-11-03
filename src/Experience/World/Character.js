import { createProceduralHuman, rigifyMapping } from 'three-procedural-locomotion'
import { Raycaster, SkeletonHelper, Vector2 } from 'three/webgpu'

import Experience from '../Experience.js'

export default class Character {
    constructor(ground){
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.time = this.experience.time
        this.resource = this.experience.resources.items.characterModel
        this.model = this.resource.scene
        this.model.position.set(0, 0, 3)
        this.ground = ground

        this.scene.add(this.model)

        this.model.traverse((child) => {
            if(child.isMesh){
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        this.human = createProceduralHuman({
            model: this.model,
            mapping: rigifyMapping,
            ground
        })

        this.setClickToMove()

        // this.setDebug()
    }

    setClickToMove(){
        const canvas = this.experience.canvas
        const sizes = this.experience.sizes
        const camera = this.experience.camera.instance

        const raycaster = new Raycaster()
        const pointer = new Vector2()
        const down = { x: 0, y: 0 }

        canvas.addEventListener('pointerdown', (event) => {
            down.x = event.clientX
            down.y = event.clientY
        })

        canvas.addEventListener('click', (event) => {
            if(Math.hypot(event.clientX - down.x, event.clientY - down.y) > 5) return

            pointer.x = (event.clientX / sizes.width) * 2 - 1
            pointer.y = - (event.clientY / sizes.height) * 2 + 1
            raycaster.setFromCamera(pointer, camera)

            const hit = raycaster.intersectObjects(this.ground.targets)[0]
            if(hit) this.human.moveTo(hit.point, { run: event.shiftKey })
        })
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