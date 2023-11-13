import * as THREE from 'three';
import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';
import {PointLightHelper} from "three";


const SHOW_GRID = false
const SHOW_LIGHT_HELPERS = true

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

if (SHOW_GRID) {
  const size = 8;
  const divisions = 8;
  const gridHelper = new THREE.GridHelper( size, divisions );

  scene.add( gridHelper );
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
loader.load(
  './assets/models/homeoffice.glb',
  function (gltf) {
    gltf.scene.traverse(function (node) {
      const wallsObject = gltf.scene.children.find(({ name }) => name === 'Walls')
      const skateboard = gltf.scene.children.find(({ name }) => name === 'Skateboard')
      skateboard.receiveShadow = false
      wallsObject.castShadow = false
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true
      }

    });
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);


const spotLight = new THREE.SpotLight(0xFFEDCD)
spotLight.position.set(0, 3, 0)
spotLight.angle = Math.PI / 2.3
spotLight.power = 60
spotLight.penumbra = 1
spotLight.castShadow = true

const hemisphereLight = new THREE.HemisphereLight(0xFFEDCD)
hemisphereLight.position.set(0, 3, 0)
hemisphereLight.intensity = 0.3

const pointLight = new THREE.PointLight(0xFFEDCD)
const pointLightHelper = new PointLightHelper(pointLight, 0.4)
pointLight.castShadow = true
pointLight.intensity = 0.5
pointLight.position.set(1.45, 1, -1)

const pointLight2 = new THREE.PointLight(0xFFEDCD)
const pointLightHelper2 = new PointLightHelper(pointLight2, 0.2)
pointLight2.castShadow = true
pointLight2.intensity = 0.5
pointLight2.position.set(-2.2, 0.9, -0.48)



scene.add(
  spotLight,
  hemisphereLight,
  pointLight,
  pointLight2
)

if (SHOW_LIGHT_HELPERS) {
  scene.add(
    pointLightHelper,
    pointLightHelper2
  )
}

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}

animate();
