import { SRGBColorSpace, MeshBasicMaterial, Mesh, CylinderGeometry } from 'three/webgpu'
import { LeafTree } from 'tree-demo'
import Experience from '../Experience.js'

export default class Tree {
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.model = this.experience.resources.items.treeModel.scene
        this.model.position.set(0, 1, -5)
        this.model.scale.set(1.2,1.2,1.2)

        this.setTextures()
        this.setTree()
        this.setTrunk()
    }

    async setTree(){
        this.leafTree = await LeafTree.create(this.experience.renderer.instance, { 
            object: this.model, 
            textures: this.textures,
            count: 9000,                
            capacity: 9000,             
            params: { leafSize: 0.1, spontaneousFall: 0.02, regeneration: false }
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
    
    setTrunk(){
        const scale = this.model.scale.y
        const geometry = new CylinderGeometry(0.06 * scale, 0.13 * scale, 1.4 * scale)
        geometry.translate(0, 0.7 * scale, 0)

        this.trunk = new Mesh(geometry, new MeshBasicMaterial())
        this.trunk.position.copy(this.model.position)
        this.trunk.visible = false
        this.scene.add(this.trunk)
    }

    update(){
        this.leafTree?.update(this.time.delta)
    }
}