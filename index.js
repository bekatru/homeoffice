import * as THREE from 'three';
import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 2

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  ambientOcclusion: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.5
document.body.appendChild(renderer.domElement);

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//Loader
const loader = new GLTFLoader();
let mixer
loader.load(
  './assets/models/homeoffice.glb',
  function (gltf) {
    const model = gltf.scene

    const point = model.children
      .find(({name}) => name === 'Point').children
      .find(({name}) => name === 'Point_Orientation')

    const spot = model.children
      .find(({name}) => name === 'DeskLight').children
      .find(({name}) => name === 'DeskLight_Orientation')

    spot.castShadow = true
    spot.decay = 2
    spot.power = 4
    spot.shadow.camera.near = 0.001

    point.castShadow = true
    point.decay = 4
    point.shadow.camera.near = 0.1

    model.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true
      }
    });

    mixer = new THREE.AnimationMixer(model)
    const clips = gltf.animations,
      clip = THREE.AnimationClip.findByName(clips, 'DeskChairTopAction'),
      action = mixer.clipAction(clip);

    action.play()
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const clock = new THREE.Clock()

const ambientLight = new THREE.AmbientLight(0xFFE1BC, 0.4)
scene.add(ambientLight)

function animate() {
  if (mixer) mixer.update(clock.getDelta())
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
