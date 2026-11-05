import { createProceduralHuman, rigifyMapping } from 'three-procedural-locomotion'
import { Raycaster, SkeletonHelper, Vector2, Vector3, Quaternion } from 'three/webgpu'

import Experience from '../Experience.js'

const ROUTE_START = new Vector3(2.5, 0, 7.6)
const ROUTE = [
    new Vector3(2.5, 1, -0.6),   // arriba de las rocas
    new Vector3(-0.5, 1, -3.9),  // acá empieza a rodear el árbol
    new Vector3(-0.6, 1, -5),
    new Vector3(-0.38, 1, -5.47),
    new Vector3(0.13, 1, -5.6),
    new Vector3(0.57, 1, -5.19),
    new Vector3(0.53, 1, -4.62),
    new Vector3(1.2, 1, -1.2)    // final, cerca del borde
]

export default class Character {
    constructor(ground, trunk, environmentMap){
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.time = this.experience.time
        this.resource = this.experience.resources.items.characterModel
        this.model = this.resource.scene
        this.model.position.set(0, 0, 5)
        this.model.rotation.set(0, Math.PI, 0)
        this.ground = ground
        this.trunk = trunk
        this.trunkNormal = new Vector3()
        this.touchingTrunk = false

        this.scene.add(this.model)

        this.model.traverse((child) => {
            if(child.isMesh){
                child.castShadow = true
                child.receiveShadow = true
                child.material.envMap = environmentMap
                child.material.envMapIntensity = 0.6
            }
        })

        this.human = createProceduralHuman({
            model: this.model,
            mapping: rigifyMapping,
            ground,
            touchables: [trunk],
            config: {
                idleArmAbduction: 19,
                runArmAbduction: 18,
                armAbduction: 15,
                variation: 2,
                idleStepThreshold: 0.2,
                shoulderDrop: 10,
                touchReachTime: 0.5,
                touchReleaseTime: 0.5,
                touchHoldTime: 5,
                touchMaxReach: 1,
            },
        })

        this.setClickToMove()

        this.routeIndex = null
        this.setRoute()

        this.setDebug()
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

    setTrunkNormal(){
        const center = this.trunk.position
        const position = this.human.position
        const velocity = this.human.velocity.clone().setY(0)

        // Del tronco hacia el personaje, un poco hacia adelante
        this.trunkNormal.set(position.x - center.x, 0, position.z - center.z).normalize()
        if(velocity.lengthSq() > 0.01) this.trunkNormal.addScaledVector(velocity.normalize(), 0.35).normalize()
    }

    updateTrunkTouch(){
        const inLoop = this.routeIndex !== null && this.routeIndex >= 3 && this.routeIndex <= 6

        if(!inLoop){
            if(this.touchingTrunk){
                this.human.releaseTouch()
                this.touchingTrunk = false
            }
            return
        }

        this.setTrunkNormal()

        const normal = this.trunkNormal
        const point = this.trunk.position.clone().addScaledVector(normal, 0.1)
        point.y = this.trunk.position.y + 1.2

        const phase = this.human.touchPhase('right')

        if(phase === 'none'){
            this.touchingTrunk = this.human.touch(point, { normal: normal.clone(), side: 'right', slide: false, hold: true })
            return
        }

        if(phase === 'release') return

        // Mueve la mano por el tronco (campos internos de la librería)
        const hand = this.human.locomotion.touch.hands.right
        hand.rotation.premultiply(new Quaternion().setFromUnitVectors(hand.normal, normal))
        hand.normal.copy(normal)
        hand.point.copy(point)

        const finger = hand.fingerLocal.clone().applyQuaternion(hand.rotation)
        hand.wrist.copy(point).addScaledVector(normal, hand.palmThickness).addScaledVector(finger, -hand.palmLength)
    }

    setRoute(){
        document.querySelector('.route-button').addEventListener('click', () => this.startRoute())
    }

    startRoute(){
        this.model.position.copy(ROUTE_START)
        this.model.rotation.set(0, Math.PI, 0)
        this.human.reset()

        this.routeIndex = 0
        this.human.moveTo(ROUTE[0])
    }

    updateRoute(){
        if(this.routeIndex === null) return

        const position = this.human.position
        const target = ROUTE[this.routeIndex]
        if(Math.hypot(position.x - target.x, position.z - target.z) > 0.6) return

        this.routeIndex++

        if(this.routeIndex === ROUTE.length) this.routeIndex = null
        else this.human.moveTo(ROUTE[this.routeIndex])
    }

    update(){
        this.updateRoute()
        this.updateTrunkTouch()
        this.human.update(this.time.delta)
    }
}