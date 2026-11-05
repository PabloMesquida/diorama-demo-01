// Bakes the distance to the rocks into a small 3D grid, so the terrain material
// can darken near them on any face (see setRockShading in World/Terrain.js).
//
// Run it again if the rocks change or move:
//   cd tools
//   npm install
//   npm run bake:rocks
//
// Then copy the values it prints into setRockShading:
//   dims  -> new Data3DTexture(data, x, y, z)
//   min   -> vec3 subtracted from positionWorld
//   size  -> vec3 that divides it
//   range -> the value that multiplies the texture
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { MeshoptDecoder } from 'meshoptimizer'
import * as THREE from 'three'
import { MeshBVH } from 'three-mesh-bvh'

const INPUT = new URL('../public/models/rocks/rocks.glb', import.meta.url)
const OUTPUT = new URL('../public/textures/rocks/rocks_distance.bin', import.meta.url)

const OFFSET = [0, -0.5, -5.75] // this.model.position in World/Rocks.js
const CELL = 0.1 // metres per voxel
const RANGE = 1.4 // metres: farther than this counts as this far (the most `reach` can be)
const MIN_Y = -0.2 // height covered: the terrain goes from y = 0 to y = 1
const MAX_Y = 1.2

await MeshoptDecoder.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder })
const root = (await io.read(fileURLToPath(INPUT))).getRoot()

const positions = []
const element = [0, 0, 0]
const point = new THREE.Vector3()
const matrix = new THREE.Matrix4()

for (const node of root.listNodes()) {
  const mesh = node.getMesh()
  if (!mesh) continue

  matrix.fromArray(node.getWorldMatrix())

  for (const primitive of mesh.listPrimitives()) {
    const position = primitive.getAttribute('POSITION')
    const indices = primitive.getIndices()
    const count = indices ? indices.getCount() : position.getCount()

    for (let i = 0; i < count; i++) {
      position.getElement(indices ? indices.getScalar(i) : i, element)
      point.set(element[0], element[1], element[2]).applyMatrix4(matrix)
      positions.push(point.x + OFFSET[0], point.y + OFFSET[1], point.z + OFFSET[2])
    }
  }
}

const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
geometry.computeBoundingBox()
const box = geometry.boundingBox
const bvh = new MeshBVH(geometry)

const min = [box.min.x - RANGE, MIN_Y, box.min.z - RANGE]
const max = [box.max.x + RANGE, MAX_Y, box.max.z + RANGE]
const dims = [0, 1, 2].map((axis) => Math.ceil((max[axis] - min[axis]) / CELL))
const size = dims.map((cells) => +(cells * CELL).toFixed(3))

const data = new Uint8Array(dims[0] * dims[1] * dims[2])
const target = {}
const voxel = new THREE.Vector3()

for (let z = 0; z < dims[2]; z++) {
  for (let y = 0; y < dims[1]; y++) {
    for (let x = 0; x < dims[0]; x++) {
      voxel.set(min[0] + (x + 0.5) * CELL, min[1] + (y + 0.5) * CELL, min[2] + (z + 0.5) * CELL)
      const hit = bvh.closestPointToPoint(voxel, target, 0, RANGE)
      const distance = hit ? hit.distance : RANGE
      data[x + y * dims[0] + z * dims[0] * dims[1]] = Math.round(255 * Math.min(distance / RANGE, 1))
    }
  }
}

fs.writeFileSync(OUTPUT, data)

console.log(JSON.stringify({ dims, min: min.map((value) => +value.toFixed(3)), size, range: RANGE, kb: Math.round(data.length / 1024) }))
