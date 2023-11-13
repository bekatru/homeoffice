import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const SHOW_GRID = false

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


const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)


const spotLight = new THREE.SpotLight(0xFFEDCD)
spotLight.position.set(0, 3, 0)
spotLight.angle = Math.PI / 2.3
spotLight.power = 80
spotLight.penumbra = 1
spotLight.castShadow = true

scene.add(spotLight)

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}

animate();
