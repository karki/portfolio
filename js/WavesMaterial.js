import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export class WavesMaterial extends THREE.ShaderMaterial {
	constructor() {
		super({
			uniforms: {
				tDiffuse: { value: null },
				uResolution: {
					value: new THREE.Vector2(1, 1)
				},
                time: { value: 0.1 },
				uMouseVelocity: {
					value: new THREE.Vector2(0, 0)
				}
			},
			fragmentShader,
			vertexShader
		})
	}
}