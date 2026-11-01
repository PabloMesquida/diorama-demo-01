import { Timer } from 'three/webgpu'

export default class Time extends EventTarget{
    constructor(){
        super()

        this.timer = new Timer()
        this.timer.connect(document)

        this.delta = 0
        this.elapsed = 0
    }

    tick(timestamp){
        this.timer.update(timestamp)
        
        this.delta = Math.min(this.timer.getDelta(), 1 / 30)
        this.elapsed = this.timer.getElapsed()

        this.dispatchEvent(new Event('tick'))
    }
}