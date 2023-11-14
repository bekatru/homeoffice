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
renderer.toneMappingExposure = 1
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

    point.castShadow = true
    point.power = 60
    point.shadow.bias = -0.0001


    const lampRight = model.children
      .find(({name}) => name === 'LampRight').children
      .find(({name}) => name === 'LampRight_Orientation')

    lampRight.castShadow = true
    lampRight.power = 10
    lampRight.shadow.bias = -0.0001


    const lampLeft = model.children
      .find(({name}) => name === 'LampLeft').children
      .find(({name}) => name === 'LampLeft_Orientation')

    lampLeft.castShadow = true
    lampLeft.power = 10
    lampLeft.shadow.bias = -0.0001

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

function animate() {
  if (mixer) mixer.update(clock.getDelta())
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
