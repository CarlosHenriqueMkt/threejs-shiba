import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

let scene, camera, renderer, controls, model, model02, directionalLight, environment, pmremGenerator


//Renderer
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Camera
camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 5, 15 );

//Environment
environment = new RoomEnvironment();
pmremGenerator = new THREE.PMREMGenerator( renderer );

// Scene
scene = new THREE.Scene();
scene.background = new THREE.Color( 0x06000b );
scene.environment = pmremGenerator.fromScene( environment ).texture;
environment.dispose();

//Directional Light
directionalLight = new THREE.DirectionalLight(0xffffff, 1)
scene.add(directionalLight)
directionalLight.position.set(10, 10, 10)
directionalLight.target.position.set(0, 0, 0)
scene.add(directionalLight.target)
directionalLight.intensity = 8;


console.log(directionalLight)

//Ambient Light
const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
scene.add( ambientLight );
console.log(ambientLight)

const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add( helper );

//Spotlight



//Axes
scene.add(new THREE.AxesHelper(500))

//Controls
controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// Shiba
new GLTFLoader().load( 'models/shiba/scene.gltf', result => {
    model = result.scene;
    scene.add( model );
    model.position.set(7, 1, 3);
    checkMeshesForLighting(model);
    checkMeshesForReflectivity(model)
    animate();
  });
  
  // Island
  new GLTFLoader().load( 'models/background/bg.gltf', result => {
    model02 = result.scene;
    scene.add(model02);
    checkMeshesForLighting(model02);
    checkMeshesForReflectivity(model02)
    animate();
  });
  
  function checkMeshesForLighting(object) {
    object.traverse( function( child ) {
      if ( child.isMesh ) {
        if ( child.material.emissive || child.material.color ) {
          child.castShadow = true;
          child.receiveShadow = true;
        } else {
          console.log("The Mesh " + child.name + " cannot be illuminated.");
        }
      }
    });
  }

  function checkMeshesForReflectivity(object) {
    object.traverse( function( child ) {
      if ( child.isMesh ) {
        if ( child.material.reflectivity > 0 ) {
          console.log("The Mesh " + child.name + " reflects light.");
        } else {
          console.log("The Mesh " + child.name + " does not reflect light.");
        }
      }
    });
  }
  
  function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
  }

