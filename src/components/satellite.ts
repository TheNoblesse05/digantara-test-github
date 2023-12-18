import { Mesh, InstancedMesh, MeshBasicMaterial, SphereGeometry, Object3D, Raycaster, Vector2, PerspectiveCamera, WebGLRenderer } from 'three';
import { DIVISOR } from '../constants';
import { hideFetching } from '../dom';
import { fetchTles, getSatPosition, satRecArr } from '../services/tles';

export default class Satellite extends Mesh {
  private tles: { name: string; tleLine1: string; tleLine2: string }[]  = [];
  // Creating an instanced mesh to send one render/draw call
  // Reducing the number of widthSegments and hightSegments to increase performance while still maintaining the spherical shape of the satellite
  private sharedGeometry = new SphereGeometry(0.004, 16 ,8 );
  private sharedMaterial = new MeshBasicMaterial({ color: 0xffffff });
  private instancedMeshes: InstancedMesh = new InstancedMesh(this.sharedGeometry, this.sharedMaterial,0);

  constructor() {
    super();
    this.fetchTles();
    this.rotation.x = Math.PI / 2;
  }

  private fetchTles() {
    fetchTles()
    .then((d) => {
      this.tles = d;
      this.instancedMeshes = new InstancedMesh(this.sharedGeometry, this.sharedMaterial, this.tles.length);
      this.add(this.instancedMeshes);
      hideFetching();
    })
  }

  private propagatePositions(tles: typeof this.tles) {
    if (tles.length === 0) return;

    let temp = new Object3D();
    for (let i = 0; i < tles.length; i++) {
      const [x, y, z] = getSatPosition(satRecArr[i], new Date());
      temp.position.x = x/DIVISOR;
      temp.position.y = y/DIVISOR;
      temp.position.z = z/DIVISOR;
      temp.updateMatrix();
      this.instancedMeshes.setMatrixAt(i,temp.matrix);
    }
    this.instancedMeshes.instanceMatrix.needsUpdate = true;
  }

  showTooltip(camera:any, renderer:any, satName:string, latestMouseProjection:any) {
    let divElement = document.getElementById("tooltip");
  
    if (divElement && latestMouseProjection) {
      divElement.style.display = "block";
      divElement.style.opacity = "0";
  
      let canvasHalfWidth = renderer.domElement.offsetWidth / 2;
      let canvasHalfHeight = renderer.domElement.offsetHeight / 2;
  
      let tooltipPosition = latestMouseProjection.clone().project(camera);
      tooltipPosition.x = (tooltipPosition.x * canvasHalfWidth) + canvasHalfWidth + renderer.domElement.offsetLeft;
      tooltipPosition.y = -(tooltipPosition.y * canvasHalfHeight) + canvasHalfHeight + renderer.domElement.offsetTop;
  
      let tootipWidth = divElement.offsetWidth;
      let tootipHeight = divElement.offsetHeight;
  
      divElement.style.left = `${tooltipPosition.x - tootipWidth/2}px`;
      divElement.style.top = `${tooltipPosition.y - tootipHeight - 5}px`
  
      divElement.getElementsByClassName('tooltip-data')[0].innerHTML = satName;
  
      setTimeout(function() {
        divElement!.style.opacity = "1"
      }, 25);
    }
  }

  update(raycaster:Raycaster, mouse:Vector2, camera:PerspectiveCamera, renderer:WebGLRenderer) {
    this.propagatePositions(this.tles);

    raycaster.setFromCamera( mouse, camera );
    const intersection = raycaster.intersectObject( this.instancedMeshes );
    if ( intersection.length > 0 ) {
      let latestMouseProjection:object = intersection[0].point;
      let instanceId:number = intersection[0].instanceId!;
      let satName:string = this.tles[instanceId].name;
      this.showTooltip(camera, renderer, satName, latestMouseProjection);
    }

    return;
  }
}
