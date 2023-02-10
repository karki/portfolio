import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { WavesPass  } from './WavesPass';

var img = document.getElementById('texture');

var texture;
var plane;
var uMouseVelocity = new THREE.Vector2(0,0);

var camera;
var renderer;
var composer;
var scene;

var imageElement = document.createElement('img');
imageElement.onload = function(e) {
    texture = new THREE.Texture( this );
    texture.needsUpdate = true;
    init();
    animate();
    img.style.display = 'none';
};

imageElement.src = img.src;

function init(w, h) {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 10 );
    camera.position.z = 1;

    scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry( 1, 1 );
    const material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );
    plane = new THREE.Mesh( geometry, material );
    plane.geometry.scale(img.clientWidth, img.clientHeight, 1)
    scene.add( plane );

    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const wavesPass = new WavesPass(window.innerWidth, window.innerHeight, uMouseVelocity)
    composer.addPass(renderPass);
    composer.addPass(wavesPass);
}

function animate() {
    requestAnimationFrame( animate );
    composer.render();
};

document.addEventListener('mousemove', (e) => {
    const newVelocity = new THREE.Vector2(
        THREE.MathUtils.clamp(e.movementX, -2, 2),
        THREE.MathUtils.clamp(e.movementY, -10, 10)
    )
    uMouseVelocity.lerp(newVelocity, 0.1)
});

window.addEventListener('resize', () => {
    const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.getSize(size)
    console.log(size);

    renderer.setSize( width, height );
});

