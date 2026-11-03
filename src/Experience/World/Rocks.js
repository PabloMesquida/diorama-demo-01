import Experience from '../Experience.js'

export default class Rocks {
    constructor(){
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.resource = this.experience.resources.items.rocksModel
        this.model = this.resource.scene
        this.model.position.set(0, -0.5, -5.75)

        this.scene.add(this.model)
    }
}