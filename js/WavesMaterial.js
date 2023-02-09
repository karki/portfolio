import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export class WavesMaterial extends THREE.ShaderMaterial {
	constructor() {
		super({
			uniforms: {
				// we'll keep the naming convention here since the CopyShader
				// also used a tDiffuse texture for the currently rendered scene.
				tDiffuse: { value: null },
				// we'll pass in the canvas size here later
				uResolution: {
					value: new THREE.Vector2(1, 1)
				},
                time: { value: 0.1 }
			},
			fragmentShader, // to be imported from another file
			vertexShader // to be imported from another file
		})
	}
}