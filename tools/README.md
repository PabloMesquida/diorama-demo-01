# Herramientas

Scripts que se corren a mano para generar assets. La demo no los usa al ejecutarse, y por eso tienen su propio `package.json`.

## `bake-rocks-distance.mjs`

Genera `public/textures/rocks/rocks_distance.bin`: la distancia a las rocas en una pequeña textura 3D. `setRockShading()` en `src/Experience/World/Terrain.js` la usa para oscurecer el terreno cerca de las rocas, en el piso y en las paredes.

### Cuándo correrlo

Cuando cambia `public/models/rocks/rocks.glb` o la posición de las rocas en `src/Experience/World/Rocks.js`.

### Cómo correrlo

1. Si cambió la posición, actualizá `OFFSET` en el script para que coincida con `this.model.position` de `Rocks.js`.
2. Desde esta carpeta:

   ```bash
   npm install
   npm run bake:rocks
   ```

3. El script sobrescribe el `.bin` e imprime una línea como esta:

   ```json
   {"dims":[144,14,115],"min":[-7.883,-0.2,-3.125],"size":[14.4,1.4,11.5],"range":1.4,"kb":226}
   ```

4. Si esos valores cambiaron, copialos en `setRockShading()`:

   | Valor | Dónde va |
   |---|---|
   | `dims` | `new Data3DTexture(data, 144, 14, 115)` |
   | `min` | el `vec3` que se resta de `positionWorld` |
   | `size` | el `vec3` que divide ese resultado |
   | `range` | el número que multiplica la lectura de la textura (`.r.mul(1.4)`) |

### Constantes del script

| Constante | Qué controla |
|---|---|
| `OFFSET` | Posición de las rocas en la escena. |
| `CELL` | Tamaño de cada celda, en metros. Más chico da más detalle y un archivo más pesado. |
| `RANGE` | Distancia máxima guardada, en metros. Es el valor máximo que puede tener `reach`. |
| `MIN_Y`, `MAX_Y` | Alturas que cubre la textura. Hoy cubren el terreno, de `y = 0` a `y = 1`. |

Para ajustar el efecto sin volver a hornear, cambiá `strength` y `reach` en `setRockShading()`.
