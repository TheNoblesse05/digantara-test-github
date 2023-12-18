import { Group, PerspectiveCamera, Raycaster, Vector2, WebGLRenderer } from 'three';
import Earth from './components/earth';
import Satellite from './components/satellite';
import Startfield from './components/starfield';

export default class SeedScene extends Group {
  private earth = new Earth();
  private starfield = new Startfield();
  private satellites = new Satellite();

  constructor() {
    super();
    this.add(this.earth, this.starfield, this.satellites);
  }

  update(raycaster:Raycaster, mouse:Vector2, camera:PerspectiveCamera, renderer:WebGLRenderer) {
    this.satellites.update(raycaster, mouse, camera, renderer);
  }
}
