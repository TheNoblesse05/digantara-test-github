import { PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
import SeedScene from './scene';
import './style.css';

(async () => {
  const scene = new Scene();
  const camera = new PerspectiveCamera();
  // Antialias can be turned off to increase performance
  // const renderer = new WebGLRenderer({antialias:false});
  const renderer = new WebGLRenderer();
  const controls = new OrbitControls(camera, renderer.domElement);
  const seedScene = new SeedScene();

  const stats = new Stats();
  const raycaster = new Raycaster();
  const mouse = new Vector2();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
  document.addEventListener( 'mousemove', onMouseMove );

  scene.add(seedScene);

  function onMouseMove( event:any ) {
    event.preventDefault();
    
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  function onAnimationFrameHandler() {
    stats.begin();
    // render should be done after the scene has been updated
    seedScene?.update && seedScene?.update(raycaster, mouse, camera, renderer);
    renderer.render(scene, camera);
    stats.end();
    window.requestAnimationFrame(onAnimationFrameHandler);
  };

  function windowResizeHandler() {
    const { innerHeight, innerWidth } = window;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.set(0, 0, 2);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    controls.minDistance = 0.7;
    controls.maxDistance = 10;
    controls.update();

    renderer.setSize(innerWidth, innerHeight);
  }

  windowResizeHandler();
  window.requestAnimationFrame(onAnimationFrameHandler);
  window.addEventListener('resize', windowResizeHandler);
  document.body.appendChild(renderer.domElement);
})();
