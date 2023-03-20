import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, model, model02, directionalLight

// Scene

scene = new THREE.Scene();
scene.background = new THREE.Color(0x06000b)

//Camera
camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 5, 5, 15 );

//Light
directionalLight = new THREE.DirectionalLight(0xffffff, 1)
scene.add(directionalLight)
directionalLight.position.set(10, 10, 10)
directionalLight.target.position.set(0, 0, 0)
scene.add(directionalLight.target)


const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add( helper );

//Axes
scene.add(new THREE.AxesHelper(500))

//Renderer
renderer = new THREE.WebGLRenderer();
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Controls
controls = new OrbitControls( camera, renderer.domElement );
controls.update();

//Shiba
new GLTFLoader().load( 'models/shiba/scene.gltf', result => {
    model = result.scene
	scene.add( model );
    model.position.set(7, 1, 3)
    scene.add(model)
    animate()

});

//Island
new GLTFLoader().load( 'models/background/bg.gltf', result => {
    model02 = result.scene
    scene.add(model02)
    animate()

});

function animate() {
	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}

