import { FileLoader, TextureLoader } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

export default class Resources {
    constructor(){
        this.setLoaders()
    }

    setLoaders(){
        this.loaders = {
            gltf: new GLTFLoader(),
            texture: new TextureLoader(),
            binary: new FileLoader().setResponseType('arraybuffer')
        }
        this.loaders.gltf.setMeshoptDecoder(MeshoptDecoder)
    }

    async load(sources){
        const entries = await Promise.all(
            sources.map(async (source) => {
                const loader = this.loaders[source.type]
                if(!loader) throw new Error(`Unknown resource type: ${source.type}`)
                
                const file = await loader.loadAsync(source.path).catch((error) => {
                    throw new Error(`Failed to load "${source.name}" (${source.path})`, { cause: error })
                })

                return [source.name, file]
            })
        )

        this.items = Object.fromEntries(entries)
    }
}