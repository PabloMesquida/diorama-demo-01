import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'

let instance = null

export default class Experience {
    constructor(canvas){
        if(instance) return instance
        instance = this
        window.experience = this

        this.canvas = canvas
        this.sizes = new Sizes()
        this.time = new Time()
    }
}