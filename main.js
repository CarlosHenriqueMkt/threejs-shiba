  import * as THREE from 'three';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

  let scene, camera, renderer, controls, model, model02, environment, pmremGenerator

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );


  //Camera
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set( 0, 5, 15 );

  // Scene
  scene = new THREE.Scene();

  //Environment
  environment = new RoomEnvironment();
  pmremGenerator = new THREE.PMREMGenerator( renderer );
  scene.environment = pmremGenerator.fromScene( environment ).texture;
  environment.dispose();

  //Directional Light
  const light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 0, 1, 0 ); //default; light shining from top
  light.castShadow = true; // default false
  scene.add( light );

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default

  //Create a helper for the shadow camera (optional)
  const helper = new THREE.CameraHelper( light.shadow.camera );
  scene.add( helper );

  //Ambient Light
  const ambientLight = new THREE.AmbientLight( 0x06000b, 0.5 );
  scene.add( ambientLight );

  //Cubo afetado pela luz ambiente
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
  material.mapSize = new THREE.Vector2(2048, 2048)
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cube = new THREE.Mesh(cubeGeometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(5, 0.5, 5)
  scene.add(cube);

  //Axes
  scene.add(new THREE.AxesHelper(500))

  //Controls
  controls = new OrbitControls( camera, renderer.domElement );
  controls.update();

  //Background
  new RGBELoader()
            /* .setPath( '/public/' ) */
            .load( 'royal_esplanade_4k.hdr', function ( texture ) {
              
              texture.mapping = THREE.EquirectangularReflectionMapping;

              scene.background = texture;
              scene.environment = texture;

              // Shiba
              new GLTFLoader().load( 'models/shiba/scene.gltf', result => {
                model = result.scene;
                scene.add( model );
                model.position.set(7, 1, 3);
                model.receiveShadow = true;
                animate();
              });

              // Island
              new GLTFLoader().load( 'models/background/bg.gltf', result => {
                model02 = result.scene;
                scene.add(model02);
                model02.receiveShadow = true;
                animate();
              });
            } );

/*     function checkMeshesForLighting(object) {
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
    } */

  /*   function checkMeshesForReflectivity(object) {
      object.traverse( function( child ) {
        if ( child.isMesh ) {
          if ( child.material.reflectivity > 0 ) {
            console.log("The Mesh " + child.name + " reflects light.");
          } else {
            console.log("The Mesh " + child.name + " does not reflect light.");
          }
        }
      });
    } */
    
    function animate() {
      requestAnimationFrame( animate );
      controls.update();
      renderer.render( scene, camera );
    }

