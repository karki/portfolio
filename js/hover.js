import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { WavesPass } from "./WavesPass";

const loader = new THREE.TextureLoader();
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

  positionImagePlaneToTheLowerRightCorner(
    plane,
    window.innerWidth,
    window.innerHeight,
    imageEdgePadding
  );

  plane.visible = false;

  return plane;
}

function positionImagePlaneToTheLowerRightCorner(
  plane,
  viewportWidth,
  viewportHeight,
  padding
) {
  const windowXEdgeCoordinate = viewportWidth / 2;
  const windowYEdgeCoordinate = viewportHeight / -2;

  plane.position.set(
    windowXEdgeCoordinate - (plane.scale.x / 2 + padding),
    windowYEdgeCoordinate + (plane.scale.y / 2 + padding),
    0
  );
}

let imageEdgePadding = window.innerWidth < 650 ? 20 : 70;
let currentVisibleImageIndex = 0;

let camera;
let renderer;
let composer;
let scene;

let wavesPass;

let uMouseVelocity = new THREE.Vector2(0, 0);
let newVelocity = new THREE.Vector2();

let uResolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

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
  wavesPass = new WavesPass(uResolution, uMouseVelocity);
  composer.addPass(renderPass);
  composer.addPass(wavesPass);
}

function animate() {
  requestAnimationFrame(animate);

  uMouseVelocity.lerp(new THREE.Vector2(0, 0), 0.1);

  wavesPass.material.uniforms["uMouseVelocity"].value = uMouseVelocity;

  composer.render();
}

window.addEventListener("mousemove", (e) => {
  newVelocity = new THREE.Vector2(
    THREE.MathUtils.clamp(e.movementX, -2, 2),
    THREE.MathUtils.clamp(e.movementY, -2, 2)
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

  uResolution = new THREE.Vector2(width, height);
  wavesPass.material.uniforms["uResolution"].value = uResolution;

  imageEdgePadding = width < 650 ? 20 : 70;

  imageMeshes.forEach((plane) => {
    positionImagePlaneToTheLowerRightCorner(
      plane,
      width,
      height,
      imageEdgePadding
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
