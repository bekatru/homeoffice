import * as THREE from 'three';
import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';
import {
  HemisphereLightHelper,
  PointLightHelper,
  SpotLightHelper
} from "three";


const SHOW_GRID = false
const SHOW_LIGHT_HELPERS = false

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

if (SHOW_GRID) {
  const size = 8;
  const divisions = 8;
  const gridHelper = new THREE.GridHelper(size, divisions);

  scene.add(gridHelper);
}

//Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
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
    model.traverse(function (node) {
      const wallsObject = model.children.find(({name}) => name === 'Walls')
      const ceilingLamp = model.children.find(({name}) => name === 'CeilingLampBottom')
      const coffeeTable = model.children.find(({name}) => name === 'CoffeeTable')
      coffeeTable.castShadow = true
      coffeeTable.receiveShadow = false
      ceilingLamp.castShadow = false
      ceilingLamp.receiveShadow = false
      wallsObject.castShadow = false
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


const spotLight = new THREE.SpotLight(0xFFEDCD)
const spotLightHelper = new SpotLightHelper(spotLight)
spotLight.position.set(0, 2.5, 2.2)
spotLight.angle = Math.PI / 2.3
spotLight.power = 100
spotLight.penumbra = 1
spotLight.castShadow = true
spotLight.shadow.bias = -0.0005

const hemisphereLight = new THREE.HemisphereLight(0xFFEDCD)
const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight)
hemisphereLight.position.set(0, 2.5, 2.2)
hemisphereLight.intensity = 0.5

const pointLight = new THREE.PointLight(0xFFEDCD)
const pointLightHelper = new PointLightHelper(pointLight, 0.2)
pointLight.position.set(1.45, 1, -1)
pointLight.castShadow = true
pointLight.intensity = 0.5

const pointLight2 = new THREE.PointLight(0xFFEDCD)
const pointLightHelper2 = new PointLightHelper(pointLight2, 0.2)
pointLight2.position.set(-2.2, 0.9, -0.48)
pointLight2.castShadow = true
pointLight2.intensity = 0.5


scene.add(
  spotLight,
  hemisphereLight,
  pointLight,
  pointLight2
)

if (SHOW_LIGHT_HELPERS) {
  scene.add(
    spotLightHelper,
    hemisphereLightHelper,
    pointLightHelper,
    pointLightHelper2
  )
}

const clock = new THREE.Clock()

function animate() {
  if (mixer) mixer.update(clock.getDelta())
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
