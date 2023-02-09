import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { WavesPass  } from './WavesPass';

var img = document.getElementById('texture');
var clock = new THREE.Clock()

var texture;
var plane;
var uMouse = new THREE.Vector2(0,0);

var camera;
var renderer;
var composer;
var scene;

var imageElement = document.createElement('img');
imageElement.onload = function(e) {
    img.style.opacity = 0;
    texture = new THREE.Texture( this );
    texture.needsUpdate = true;
    init();
    animate();
};

imageElement.src = img.src;

function init(w, h) {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10 );
    camera.position.z = 1;

    scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry( 1, 1 );
    const material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );
    plane = new THREE.Mesh( geometry, material );
    plane.scale.set(1.0, img.clientHeight / img.clientWidth, 1.0);
    scene.add( plane );

    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const pencilLinesPass = new WavesPass()
    composer.addPass(renderPass);
    composer.addPass(pencilLinesPass);

    // var myEffect = {
    //     uniforms: {
    //         "tDiffuse": { value: null },
    //         "resolution": { value: new THREE.Vector2(1.,window.innerHeight/window.innerWidth) },
    //         "iChannel0":  { type: 't', value: composer.readBuffer },
    //         "uMouse": { value: new THREE.Vector2(-10,-10) },
    //         "uVelo": { value: 0 },
    //         "uTime": { value: 0.1 }
    //     },
    //     vertexShader: `
    //     varying vec2 vUv;

    //     void main() {
    //         vUv = uv;
    //         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
    //     }`,
    //     fragmentShader: `
    //     uniform sampler2D tDiffuse;
    //     uniform vec2 resolution;
    //     uniform sampler2D iChannel0;
    //     varying vec2 vUv;
    //     uniform vec2 uMouse;
    //     uniform float uTime;

    //     void main()  {
    //         vec2 newUV = -1.0 + 2.0 *vUv;

    //         float w = (0.5 - newUV.x) * (resolution.x / resolution.y);
    //         float h = 0.5 - newUV.y;
	//         float distanceFromCenter = sqrt(w * w + h * h);

    //         float sinArg = distanceFromCenter * 10.0 - uTime * 10.0;
	//         float slope = cos(sinArg) ;
    //         vec4 color = texture(iChannel0, newUV + normalize(vec2(w, h)) * slope * 0.05);

    //         gl_FragColor = color;
    //     }`
    //   }

    //   // clamp mouse velocity to a value between 0.05 and 0.10;
}

function animate() {
    // customPass.uniforms.uTime.value += clock.getDelta();
    requestAnimationFrame( animate );
    composer.render();
};

document.addEventListener('mousemove', (e) => {
    // mousemove / touchmove
    uMouse.x = ( e.clientX / window.innerWidth ) ;
    uMouse.y = 1. - ( e.clientY/ window.innerHeight );
});