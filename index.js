import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const SHOW_GRID = false

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

if (SHOW_GRID) {
  const size = 10;
  const divisions = 10;
  const gridHelper = new THREE.GridHelper( size, divisions );

  scene.add( gridHelper );
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

const floorGeometry = new THREE.BoxGeometry( 10, .2, 10 );
const floorMaterial = new THREE.MeshBasicMaterial( {color: 0x595959} );
const floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );

floorMesh.position.set(0, -0.1, 0)

scene.add( floorMesh );

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}

animate();
