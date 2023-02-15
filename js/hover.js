import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { WavesPass } from "./WavesPass";

const imageEdgePadding = 70;

let currentVisibleImageIndex = 0;
const loader = new THREE.TextureLoader();

var uMouseVelocity = new THREE.Vector2(0, 0);

const textures = document.getElementsByClassName("texture");
const imageMeshes = [];

for (let i = 0; i < textures.length; i++) {
  const imageElement = textures[i];

  loader.load(imageElement.src, function (texture) {
    texture.needsUpdate = true;

    imageMeshes.push(
      createImagePlane(
        imageElement.clientWidth,
        imageElement.clientHeight,
        texture
      )
    );

    // Only init after all images on the page have been loaded.
    if (imageMeshes.length == textures.length) {
      init();
      animate();
    }
  });
}

function createImagePlane(width, height, texture) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.scale.set(width, height, 1);

  const windowXEdgeCoordinate = window.innerWidth / 2;
  const windowYEdgeCoordinate = window.innerHeight / -2;

  plane.position.set(
    windowXEdgeCoordinate - (width / 2 + imageEdgePadding),
    windowYEdgeCoordinate + (height / 2 + imageEdgePadding),
    0
  );

  plane.visible = false;

  return plane;
}

let camera;
let renderer;
let composer;
let scene;

let wavesPass;

function init(w, h) {
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    0.1,
    10
  );
  camera.position.z = 1;

  scene = new THREE.Scene();
  scene.background = null;

  imageMeshes[currentVisibleImageIndex].visible = true;

  imageMeshes.forEach((mesh) => scene.add(mesh));

  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  wavesPass = new WavesPass(
    window.innerWidth,
    window.innerHeight,
    uMouseVelocity
  );
  composer.addPass(renderPass);
  composer.addPass(wavesPass);
}

function animate() {
  requestAnimationFrame(animate);

  composer.render();
}

document.addEventListener("mousemove", (e) => {
  const newVelocity = new THREE.Vector2(
    THREE.MathUtils.clamp(e.movementX, -2, 2),
    THREE.MathUtils.clamp(e.movementY, -10, 10)
  );
  uMouseVelocity.lerp(newVelocity, 0.1);
});

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  (camera.left = window.innerWidth / -2),
    (camera.right = window.innerWidth / 2),
    (camera.top = window.innerHeight / 2),
    (camera.bottom = window.innerHeight / -2),
    (camera.aspect = width / height);
  camera.updateProjectionMatrix();

  wavesPass.material.uniforms["uResolution"].value = new THREE.Vector2(
    width,
    height
  );

  const windowXEdgeCoordinate = width / 2;
  const windowYEdgeCoordinate = height / -2;

  imageMeshes.forEach((plane) => {
    plane.position.set(
      windowXEdgeCoordinate - (plane.scale.x / 2 + imageEdgePadding),
      windowYEdgeCoordinate + (plane.scale.y / 2 + imageEdgePadding),
      0
    );
  });

  renderer.setSize(width, height);
});

// onClick raycasting things
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.addEventListener("click", (event) => {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    imageMeshes[currentVisibleImageIndex].visible = false;

    if (currentVisibleImageIndex == imageMeshes.length - 1) {
      currentVisibleImageIndex = 0;
    } else {
      currentVisibleImageIndex++;
    }

    imageMeshes[currentVisibleImageIndex].visible = true;
  }
});
