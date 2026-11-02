import { Inspector } from 'three/addons/inspector/Inspector.js'

import Experience from '../Experience.js'

export default class Debug {
    constructor(){
        this.experience = new Experience()

        this.active = window.location.hash === '#debug'

        if(this.active){
            this.experience.renderer.instance.inspector = new Inspector()
        }
    }
}