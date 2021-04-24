import { Component, OnInit } from '@angular/core';
import { EngineComponent } from '../engine/engine.component';
import {RightSideMenuComponent} from '../right-side-menu/right-side-menu.component';
import * as THREE from 'three-full';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { User } from '../_models';

@Component({
  providers: [EngineComponent],
  selector: 'app-top-tool-bar',
  templateUrl: './top-tool-bar.component.html',
  styleUrls: ['./top-tool-bar.component.css']
})
export class TopToolBarComponent implements OnInit {

  private engServ;
  private rsMenu;
  currentUser: User;

  constructor(private comp : EngineComponent,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.engServ = this.comp.getEngineService();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
  }

  onSignOut(){
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  onGoBack(){
    this.router.navigate(['']);
  }

  // Add menu functions
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Menubar.Add.js
  // Font converted using: http://gero3.github.io/facetype.js/
  // Font Loader for loading font: https://stackoverflow.com/questions/37314902/adding-text-in-three-js-over-some-object?rq=1
  onAddText()
  {
    let loader = new THREE.FontLoader();
    loader.load( '../../assets/fonts/Times_New_Roman_Cyr_Regular.json', ( font ) => {

        let inputText = window.prompt("Please enter your text", "Text");
        if (!inputText) inputText = "Text";

        let textGeometry = new THREE.TextGeometry( inputText, {

          font: font,

          size: 50,
          height: 10,
          curveSegments: 12,

          bevelThickness: 1,
          bevelSize: 1,
          bevelEnabled: true

        });

        let textMaterial = new THREE.MeshPhongMaterial(
          { color: 0xff0000, specular: 0xffffff }
        );

        let mesh = new THREE.Mesh( textGeometry, textMaterial );
        mesh.position.set(0,0,0);
        mesh.name='Text';
        this.engServ.addObject(mesh);

    });


  }

  onAddPlane()
  {
      let geometry = new THREE.PlaneBufferGeometry( 300, 300, 1, 1 );
      let material = new THREE.MeshStandardMaterial();
      let mesh = new THREE.Mesh( geometry, material );
      mesh.position.set(0,0,0);
      mesh.name = 'Plane';
      this.engServ.addObject(mesh);
  }

  onAddBox()
  {
      let geometry = new THREE.BoxBufferGeometry( 100, 100, 100, 1, 1, 1 );
      let mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
      mesh.name = 'Box';
      mesh.position.set(0,0,0);
      this.engServ.addObject(mesh);
  }

  onAddCircle()
  {
      let geometry = new THREE.CircleBufferGeometry( 100, 8, 0, Math.PI * 2 );
      let mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
      mesh.name = 'Circle';
      mesh.position.set(0,0,0);
      this.engServ.addObject(mesh);
  }

  onAddCylinder()
  {
      let geometry = new THREE.CylinderBufferGeometry( 50, 50, 200, 8, 1, false, 0, Math.PI * 2 );
      let mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
      mesh.name = 'Cylinder';
      mesh.position.set(0,0,0);
      this.engServ.addObject(mesh);
  }

  onAddSphere()
  {
      let geometry = new THREE.SphereBufferGeometry( 50, 80, 60, 0, Math.PI * 2, 0, Math.PI );
      let mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
      mesh.name = 'Sphere';
      mesh.position.set(0,0,0);
      this.engServ.addObject(mesh);
  }

  onAddIsosahedron()
  {
      let geometry = new THREE.IcosahedronBufferGeometry( 50, 0 );
      let mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
      mesh.name = 'Icosahedron';
      mesh.position.set(0,0,0);
      this.engServ.addObject(mesh);
  }

  onAddTorous()
  {
      let geometry = new THREE.TorusBufferGeometry( 100, 30, 8, 6, Math.PI * 2 );
      let mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
      mesh.name = 'Torus';
      mesh.position.set(0,0,0);
      this.engServ.addObject(mesh);
  }

  onAddTorousKnot()
  {
      let geometry = new THREE.TorusKnotBufferGeometry( 100, 30, 64, 8, 2, 3 );
      let mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
      mesh.name = 'TorusKnot';
      mesh.position.set(0,0,0);
      this.engServ.addObject(mesh);
  }

  onAddTube()
  {
      let path = new THREE.CatmullRomCurve3( [
        new THREE.Vector3( 2, 2, - 2 ),
        new THREE.Vector3( 2, - 2, - 0.6666666666666667 ),
        new THREE.Vector3( - 2, - 2, 0.6666666666666667 ),
        new THREE.Vector3( - 2, 2, 2 )
      ] );

      let geometry = new THREE.TubeBufferGeometry( path, 64, 100, 80, false );
      let mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
      mesh.name = 'Tube';
      mesh.position.set(0,0,0);
      this.engServ.addObject(mesh);
  }

  onAddLathe()
  {
      // https://threejs.org/docs/#api/en/geometries/LatheBufferGeometry
      let points = [];
      for ( let i = 0; i < 10; i ++ ) {
	        points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 100 + 5, ( i - 5 ) * 20 ) );
      }

      let geometry = new THREE.LatheBufferGeometry( points, 12, 0, Math.PI * 2 );
      let mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { side: THREE.DoubleSide } ) );
      mesh.name = 'Lathe';
      mesh.position.set(0,0,0);

      this.engServ.addObject(mesh);

  }


  onAddSprite()
  {
      let sprite = new THREE.Sprite( new THREE.SpriteMaterial() );
      sprite.name = 'Sprite';
      sprite.scale.set(200, 200, 1)
      sprite.position.set(0,0,0);
      this.engServ.addObject(sprite);
  }

  onAddPointLight()
  {
    let color = 0xffffff;
    let intensity = 1;
    let distance = 0;

    let light = new THREE.PointLight( color, intensity, distance );
    light.name = 'PointLight';
    light.position.set( 10, 10, 0 );

    this.engServ.addObject(light);
  }

  onAddDirectionalLight()
  {
    let color = 0xffffff;
    let intensity = 1;

    let light = new THREE.DirectionalLight( color, intensity );
    light.name = 'DirectionalLight';
    light.target.name = 'DirectionalLight Target';

    light.position.set( 10, 10, 0 );

    this.engServ.addObject(light);
  }

  onAddSpotLight()
  {
    let color = 0xffffff;
    let intensity = 1;
    let distance = 0;
    let angle = Math.PI * 0.1;
    let penumbra = 0;

    let light = new THREE.SpotLight( color, intensity, distance, angle, penumbra );
    light.name = 'SpotLight';
    light.target.name = 'SpotLight Target';

    light.position.set( 10, 10, 0 );
    this.engServ.addObject(light);
  }

  onAddHemisphereLight()
  {
    let skyColor = 0x00aaff;
    let groundColor = 0xffaa00;
    let intensity = 1;

    let light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
    light.name = 'HemisphereLight';

    light.position.set( 10, 10, 0 );

    this.engServ.addObject(light);
  }

  onAddAmbientLight(){
		let color = 0x222222;

		let light = new THREE.AmbientLight( color );
		light.name = 'AmbientLight';

    light.position.set( 10, 10, 0 );

		this.engServ.addObject(light);
    this.engServ.select(light);
  }

  onAddImage(){
    this.engServ.insertImage();
  }

  // File Menu
  onNew()
  {
      if ( confirm( 'Unsaved data will be lost. Are you sure?' ) )
      {
        this.engServ.clear();
      }
  }

  // https://github.com/mrdoob/three.js/blob/master/editor/js/Menubar.File.js
  // https://www.quora.com/In-JavaScript-how-do-I-read-a-local-JSON-file
  onImport()
  {

    	let fileInput = document.createElement( 'input' );
    	fileInput.multiple = false;
    	fileInput.type = 'file';

      fileInput.click();
    	fileInput.addEventListener( 'change', () => {

        if (fileInput.files && fileInput.files[0]) {
          let reader = new FileReader();
          let json;

          reader.onload=(e:any)=>{
            try {
                json = JSON.parse(e.target.result);
                this.engServ.clear();
                this.engServ.fromJSON(json);

            } catch (error) {
                console.error(error);
            };
          };
          reader.readAsText(fileInput.files[0]);
    	}});
  }

  // exports json of editor
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Menubar.File.js
  onExport()
  {
      this.engServ.select(null);

      let output = this.engServ.toJSON();
      try {

			     output = JSON.stringify( output, this.parseNumber, '\t' );
			     output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		  } catch ( e ) {

			     output = JSON.stringify( output );

		  }

		  this.saveString( output, 'scene.json' );

  }

  parseNumber( key, value ) {

		return typeof value === 'number' ? parseFloat( value.toFixed( 6 ) ) : value;

	}

  // saves json given file name and blob
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Menubar.File.js
  save( blob, filename ) {

    let link = document.createElement( 'a' );
    link.style.display = 'none';
    document.body.appendChild( link )

		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.click();
    document.body.removeChild(link);
	}

  // saves json given string
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Menubar.File.js
  saveString( text, filename ) {
		this.save( new Blob( [ text ], { type: 'text/plain' } ), filename );
	}

  onScreenshot()
  {
      this.engServ.saveAsImage();

  }

  // editMenu

  onClearHistory()
  {


  }

  onRedo(){


  }

  onUndo()
  {


  }

}
