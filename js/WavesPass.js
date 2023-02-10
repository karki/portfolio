import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'
import * as THREE from 'three'
import { WavesMaterial } from './WavesMaterial'

export class WavesPass extends Pass {
    fsQuad
	material
    clock

	constructor(width, height, uMouseVelocity) {
        super()

		this.material = new WavesMaterial()
		this.fsQuad = new FullScreenQuad(this.material)
        this.clock = new THREE.Clock()

		this.material.uniforms.uResolution.value = new THREE.Vector2(width, height)
		this.material.uniforms.uMouseVelocity.value = uMouseVelocity
	}

	dispose() {
		this.material.dispose()
		this.fsQuad.dispose()
	}

	render(
		renderer,
		writeBuffer,
		readBuffer
	) {
		this.material.uniforms['tDiffuse'].value = readBuffer.texture
		this.material.uniforms['time'].value += this.clock.getDelta()

		if (this.renderToScreen) {
			renderer.setRenderTarget(null)
			this.fsQuad.render(renderer)
		} else {
			renderer.setRenderTarget(writeBuffer)
			if (this.clear) renderer.clear()
			this.fsQuad.render(renderer)
		}
	}
}