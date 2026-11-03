import { Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace } from 'three/webgpu'

import Experience from '../Experience.js'

export default class Dirt {
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setTextures()
        this.setMesh()
    }

    setTextures(){
        const items = this.resources.items

        this.textures = {
            color: items.dirtColorTexture,
            normal: items.dirtNormalTexture
        }

        this.textures.color.colorSpace = SRGBColorSpace

        const anisotropy = this.experience.renderer.instance.getMaxAnisotropy()
        for(const texture of Object.values(this.textures)){
            texture.anisotropy = anisotropy
        }
    }

    setMesh(){
        const geometry = new PlaneGeometry(6, 6)
        geometry.rotateX(- Math.PI * 0.5)
        geometry.translate(0, 1.005, -5)

        this.material = new MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal,
            transparent: true
        })

        this.mesh = new Mesh(geometry, this.material)
        this.mesh.name = 'Dirt'
        this.scene.add(this.mesh)
    }
}