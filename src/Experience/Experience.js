let instance = null

export default class Experience {
    constructor(canvas){
        if(instance) return instance
        instance = this
        window.experience = this

        this.canvas = canvas
    }
}