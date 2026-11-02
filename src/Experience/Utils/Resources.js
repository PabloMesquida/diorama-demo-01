import { TextureLoader } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import sources from './../sources.js'

export default class Resources extends EventTarget {
    constructor(){
        super()

        this.setLoaders()
        this.startLoading()
    }

    setLoaders(){
        this.loaders = {
            gltf: new GLTFLoader(),
            texture: new TextureLoader()
        }
    }

    startLoading(){
        this.toLoad = sources.length
        this.loaded = 0
        this.items = {}

        if(this.toLoad === 0){
            queueMicrotask(() => {
                this.dispatchEvent(new Event('ready'))
            })

            return
        }

        for(const source of sources){
            const loader = this.loaders[source.type]

            if(!loader){
                throw new Error(`Unkown resource type: ${source.type}`)
            }

            loader.load(
                source.path,
                (file) => this.sourceLoaded(source, file),
                undefined,
                (error) => this.sourceFailed(source, error)
            )
        }
    }

    sourceLoaded(){}

    sourceFailed(){}
}