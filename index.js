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

const floorGeometry = new THREE.BoxGeometry( 8, .2, 8 );
const floorMaterial = new THREE.MeshBasicMaterial( {color: 0x595959} );
const floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );

floorMesh.position.set(0, -0.1, 0)

scene.add( floorMesh );

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}

animate();
