import { SRGBColorSpace } from 'three/webgpu'
import { LeafTree } from 'tree-demo'
import Experience from '../Experience.js'

export default class Tree {
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.model = this.experience.resources.items.treeModel.scene
        this.model.position.set(0, 1, -5)

        this.setTextures()
        this.setTree()
    }

    async setTree(){
        this.leafTree = await LeafTree.create(this.experience.renderer.instance, { 
            object: this.model, 
            textures: this.textures,
            count: 10000,                  // hojas visibles
            capacity: 10000,              // máximo de hojas que se reserva en la GPU
            params: { leafSize: 0.12 }
        })
        this.scene.add(this.leafTree.object)
    }

    setTextures(){
        const items = this.experience.resources.items

        this.textures = [
            { texture: items.leafTexture01, weight: 35 },
            { texture: items.leafTexture02, weight: 35 },
            { texture: items.leafTexture03, weight: 15 },
            { texture: items.leafTexture04, weight: 5 },
            { texture: items.leafTexture05, weight: 10 }
        ]

        this.textures.forEach(({ texture }) => {
            texture.colorSpace = SRGBColorSpace
        })
    }

    update(){
        this.leafTree?.update(this.time.delta)
    }
}