import { BoxGeometry, Mesh, MeshStandardMaterial} from 'three/webgpu'

import Experience from '../Experience.js'

export default class Terrain {
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setLower()
        this.setUpper()
    }

    setLower(){
        const geometry = new BoxGeometry(10, 1, 5)
        geometry.translate(0, -0.5, 2.5)

        const material = new MeshStandardMaterial({ color: 0xff9900 })

        this.lower = new Mesh(geometry, material)
        this.lower.name = 'Terrain Lower'

        this.scene.add(this.lower)
    }

    setUpper(){
        const geometry = new BoxGeometry(10, 2, 5)
        geometry.translate(0, 0, -2.5)

        const material = new MeshStandardMaterial({ color: 0xff9900 })

        this.upper = new Mesh(geometry, material)
        this.upper.name = "Terrain Upper"

        this.scene.add(this.upper)
    }
}