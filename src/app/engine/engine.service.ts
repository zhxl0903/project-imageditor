import * as THREE from 'three-full'
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private canvas;
  private renderer;
  private camera;
  private scene;
  private controls = {orbit:null, transformControl: null};
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private onDownPosition: THREE.Vector2 = new THREE.Vector2();
  private onUpPosition: THREE.Vector2 = new THREE.Vector2();
  private contW = window.innerWidth-300;
  private contH = window.innerHeight-64;
  private raycaster = new THREE.Raycaster();
  private selected = null;
  private materials = {};
  private geometries = {};
  private textures = {};
  private models = {};
  private objects = [];
  private helpers = {};
  private selectionBox = new THREE.BoxHelper();
  private box = new THREE.Box3();
  private nativeElement;

  // sets default camera
  private DEFAULT_CAMERA1 = new THREE.PerspectiveCamera( 50, this.contW / this.contH, 1, 3000);

  private DEFAULT_BACKGROUND_COLOR =  0xcccccc;
  private DEFAULT_BACKGROUND_COLOR2 =  0x000000;

  createScene(elementId: string, nativeElement): void {

    this.nativeElement = nativeElement;

    this.DEFAULT_CAMERA1.name = 'Camera';
    this.DEFAULT_CAMERA1.position.set( 0, 0, 3000 );
    this.DEFAULT_CAMERA1.lookAt( 0, 0, 0 );

    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = <HTMLCanvasElement>document.getElementById(elementId);

    // this.contW = this.canvas.clientWidt;
    this.contW = window.innerWidth-300;
    this.contH = window.innerHeight-64;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,                      // transparent background
      antialias: true,                  // smooth edges
      preserveDrawingBuffer: true       // allows taking screenshots
    });


    this.renderer.setSize(this.contW, this.contH);
    this.renderer.setPixelRatio( window.devicePixelRatio );

    // create the scene
    this.scene = new THREE.Scene();


    // Camera
    this.camera = new THREE.PerspectiveCamera(50, this.contW / this.contH, 1, 3000);
    this.camera.position.set(0, 1000, 300);
    this.camera.lookAt( 0, 0, 0 );


    // Grid Helper
    let gridHelper =  new THREE.GridHelper( 1000, 10 )
    this.scene.add( gridHelper);
    this.objects.push(gridHelper);

    // soft white light
    this.scene.background = new THREE.Color( this.DEFAULT_BACKGROUND_COLOR );

    // Ligthing
    let light = new THREE.PointLight(0xFFFFFF, 1, 1000000);

    // Specify the light's position
    light.position.set(1, 1, 100 );
    this.addObject(light);

    light = new THREE.PointLight(0xFFFFFF, 1, 1000000);

    // // Specify the light's position
    light.position.set(1, 1, -100 );
    this.addObject(light);

    let loader = new THREE.TextureLoader();

    // create a plane geometry for the image with a width of 10
    // and a height that preserves the image's aspect ratio
    // var geometry = new THREE.BoxBufferGeometry( 10, 7.5, 1 );
    let geometry = new THREE.PlaneGeometry(100, 100*0.75);

    let texture = new THREE.TextureLoader().load('./assets/img/test.jpg', this.renderUpdate);
    this.textures[texture.uuid] = texture;
	  texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    // Load an image file into a custom material
    let material = new THREE.MeshLambertMaterial({
                    color: "white",
                    map: texture,
                    side: THREE.DoubleSide
                  });

    let material2 = new THREE.MeshLambertMaterial({
                    color: "white",
                    map: texture,
                    side: THREE.DoubleSide
                  });

    // Controls

    // orbit
    this.controls.orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);

    this.controls.orbit.update();

    // transform controls
    this.controls.transformControl = new THREE.TransformControls( this.camera, this.renderer.domElement );

    // combines our image geometry and material into a mesh
    let mesh = new THREE.Mesh(geometry, material);
    let mesh2 = new THREE.Mesh(geometry, material2);

    // set the position of the image mesh in the x,y,z dimensions
    mesh.position.set(1,1,1);
    mesh2.position.set(100,100,100);
    this.objects.push(this.controls.transformControl);

    // add the image to the scene
    this.addObject(mesh);
    this.addObject(mesh2);
    this.scene.add(this.controls.transformControl);
    this.addSelectionBox();
  }

  // -----------------------------------
  // Event listeners
  // -----------------------------------

  onDocumentMouseMove = (event) => {
      event.preventDefault();

      // gets bounding box parameters of canvas
      // this.canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
      let rect = this.canvas.getBoundingClientRect();

      // computes normalized mouse positions
      this.mouse.x = ( (event.clientX - rect.left) / rect.width ) * 2 - 1;
      this.mouse.y = ( -(event.clientY - rect.top) / rect.height ) * 2 + 1;
  };

  // gets objects intersecting with mouse position
  getIntersects(objs){

      this.raycaster.setFromCamera(this.mouse, this.camera);
      return this.raycaster.intersectObjects(objs);

  }

  // removes mesh given mesh
  // https://stackoverflow.com/questions/40694372/what-is-the-right-way-to-remove-a-mesh-completely-from-the-scene-in-three-js?rq=1
  removeMesh(mesh)
  {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
      mesh = null;

      this.renderUpdate();
  }

  // selects an object
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
  select(object)
  {
      // returns if object is already selected
      if (this.selected === object) return;

      this.selectionBox.visible = false;
		  this.controls.transformControl.detach();

      // prevents selection of camera or scene
		  if ( object !== null && object !== this.scene && object !== this.camera ) {

			     this.box.setFromObject(object);

           // sets selection box if box is not empty
			     if (this.box.isEmpty() === false) {

				      this.selectionBox.setFromObject( object );
				      this.selectionBox.visible = true;

			     }

           // sets selected object and attaches transform controls
           this.selected = object;
			     this.controls.transformControl.attach( object );

		  }
      else
      {
        this.selected = null;
      }

		  this.renderUpdate();
  }

  onDocumentMouseDown = (event) => {

      // https://github.com/mrdoob/three.js/blob/master/editor/js/Viewport.js

      event.preventDefault();

      // gets mouse down position
      this.onDownPosition.x = this.mouse.x;
      this.onDownPosition.y = this.mouse.y;

      // adds event listener for mousedown
      this.canvas.addEventListener( 'mouseup', this.onMouseUp, false );
  };

  onMouseUp = (event) => {

      // https://stackoverflow.com/questions/33142079/three-js-transformcontrols
      // https://github.com/mrdoob/three.js/blob/master/editor/js/Viewport.js

      event.preventDefault();

      // gets mouse up position
      this.onUpPosition.x = this.mouse.x;
      this.onUpPosition.y = this.mouse.y;

      // selects object iff mouse down position = downposition
      if (this.onDownPosition.distanceTo( this.onUpPosition ) === 0 ) {
          let intersects = this.getIntersects(this.objects);

          // an object is selected
          if(intersects.length > 0){

              // Updates transform controls if object selected is Mesh
              let object = intersects[0].object;

              if ( object.userData.object !== undefined ) {

                  // selects helper
                  this.select(object.userData.object);

              }
              else {

                  // selects object
                  this.select(object)
              }

          }
          else {

              // deselect
              this.select(null);
          }

          this.renderUpdate();
      }

      // removes event listener for mouseup
      this.canvas.removeEventListener( 'mouseup', this.onMouseUp, false );
  };

  // -----------------------------------
  // Updates
  // -----------------------------------

  // sets scene given scene 1
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
  setScene(scene1) {

      // sets scene uuid and name
  		this.scene.uuid = scene1.uuid;
  		this.scene.name = scene1.name;

      // deselects objects
      this.select(null);

      // sets scene background and fog if they exist
  		if ( scene1.background !== null ) this.scene.background = scene1.background.clone();
  		if ( scene1.fog !== null ) this.scene.fog = scene1.fog.clone();

      // sets scene user data
  		this.scene.userData = JSON.parse( JSON.stringify( scene1.userData ) );

      // adds objects to new scene

      let object_list = [];
      scene1.children.forEach((ele)=>{
          object_list.push(ele);
      });


      object_list.forEach((ele)=>{
        if(this.isNotSceneHelper(ele)) this.addObject(ele);
      });

      this.renderUpdate();
  };

  // Returns True iff object is not a scene helper or controls
  isNotSceneHelper(ele)
  {
    // checks object is not a scene helper
    if (!(ele instanceof THREE.TransformControls) && !(ele instanceof THREE.GridHelper) &&
     !(ele instanceof THREE.BoxHelper) && !(ele instanceof THREE.Box3) && !(ele instanceof THREE.Object3D)
    && !(ele instanceof THREE.LineSegments) || (ele.isMesh || ele.isLight) )
    {
      // checks object is not a helper with a picker
      if(!(ele.isMesh && ele.children.length > 0 && ele.children[0].name=='picker'))
      {
        return true;
      }
    }
    return false;

  }

   // adds object given object obj
   // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
  addObject(obj) : void {

      obj.traverse( ( child ) => {

          // adds geometries and materials of object
          if ( child.geometry !== undefined ) this.addGeometry(child.geometry);
          if ( child.material !== undefined ) this.addMaterial(child.material);

          this.addHelper( child );
      } );

      // adds children of object

      this.scene.add(obj);

      obj.traverse((child)=>{
          this.objects.push(child);
      });
      this.renderUpdate();
   };



   // adds selection box
   addSelectionBox(){

      this.selectionBox.material.depthTest = false;
	    this.selectionBox.material.transparent = true;
	    this.selectionBox.visible = false;

      this.scene.add(this.selectionBox);
   };

  // Generates particles given path, range, and particle size
  // https://github.com/mrdoob/three.js/blob/master/examples/webgl_points_sprites.html
  addParticles(sprite_path, range, particle_size){
      let vertices = [];
      let textureLoader = new THREE.TextureLoader();
      let sprite1 = textureLoader.load(sprite_path);

      for ( let i = 0; i < 100000; i ++ ) {
  		    let x = Math.random() * range*2 - range;
  		    let y = Math.random() * range*2 - range;
  		    let z = Math.random() * range*2 - range;
  		    vertices.push(new THREE.Vector3(x, y, z));
  	  }
      let geometry1 = new THREE.BufferGeometry().setFromPoints(vertices);
      geometry1.setDrawRange(0, range);

      let points = new THREE.Points(geometry1, new THREE.PointsMaterial({
          size: particle_size,
          map: sprite1,
          transparent: false,
          color: "yellow"
      }));

      points.rotation.x = Math.random() * 6;
      points.rotation.y = Math.random() * 6;
      points.rotation.z = Math.random() * 6;

      this.scene.add(points);
      this.objects.push(points);
  }

  // removes object given object obj
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
  removeObject(obj) {

      // removes helper of object
		  obj.traverse(  (child) => {

			     this.removeHelper( child );

		  });

      // removes object from scene
      let parent = (obj.parent == null) ? this.scene : obj.parent;
      parent.remove(obj);

      // detaches control
      if(this.selected == this.controls.transformControl.object)
      {
          this.selected=null;
          this.controls.transformControl.detach();
      }

      // removes object and its children
      obj.traverse( ( child ) => {
			     this.objects.splice( this.objects.indexOf( child ), 1 );
		  } );

      this.renderUpdate();

  }

  // returns function for adding helper to an object
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
  addHelper = ((() => {

      let geometry = new THREE.SphereBufferGeometry( 4, 4, 2 );
      let material = new THREE.MeshBasicMaterial( { color: 0xff0000, visible: false } );

      return ( object ) => {

        let helper;

        if ( object.isCamera ) {

          helper = new THREE.CameraHelper( object, 1 );

        } else if ( object.isPointLight ) {
          helper = new THREE.PointLightHelper( object, 1 );

        } else if ( object.isDirectionalLight ) {

          helper = new THREE.DirectionalLightHelper( object, 1 );

        } else if ( object.isSpotLight ) {

          helper = new THREE.SpotLightHelper( object, 1 );

        } else if ( object.isHemisphereLight ) {

          helper = new THREE.HemisphereLightHelper( object, 1 );

        } else if ( object.isSkinnedMesh ) {

          helper = new THREE.SkeletonHelper( object );

        } else {

          // no helper for this object type
          return;

        }

        // adds picker box
        let picker = new THREE.Mesh( geometry, material );
        picker.name = 'picker';
        picker.userData.object = object;
        helper.add( picker );
        this.scene.add( helper );
        this.helpers[ object.id ] = helper;
        this.objects.push(helper.getObjectByName( 'picker' ));

    };

  })());

  // removes helper given object
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
  removeHelper = ( object ) => {

  		if ( this.helpers[ object.id ] !== undefined ) {

  			let helper = this.helpers[ object.id ];
        let parent = (helper.parent == null) ? this.scene : helper.parent;
  			parent.remove( helper );

        // removes picker
        delete this.helpers[ object.id ];
        this.objects.splice( this.objects.indexOf( helper.getObjectByName( 'picker' ) ), 1 );
  		}

	};

  // adds fog to scene
  addFog = (color, near, far) =>
  {
      this.scene.fog = new THREE.Fog(new THREE.Color(color), near, far);
  };

  // removes fog from scene
  removeFog = () =>
  {
      this.scene.fog = null;
  };

  // adds FogExp2 to scene
  addFogExp2 = (color, density) =>
  {
      this.scene.fog = new THREE.FogExp2(new THREE.Color(color), density);
  };

  isLight(obj)
  {
    return (obj instanceof THREE.Light);
  }

  // clears editor
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
  clear() {

      // sets camera to deafult camera and clears fog
      this.camera.copy(this.DEFAULT_CAMERA1);
      this.scene.background = new THREE.Color( this.DEFAULT_BACKGROUND_COLOR );
      this.scene.fog = null;

      // clears selection
      this.select(null);

      let objs = this.scene.children;

      // removes objects in scene except for transform control
      while ( objs.length > 0 ) {
          this.removeObject( objs[0] );
      }

      // clears editor
      this.geometries = {};
      this.materials = {};
      this.textures = {};
      this.objects = [];

      // adds transform Controls
      this.scene.add(this.controls.transformControl);
      this.objects.push(this.controls.transformControl);

      // adds gridHelper
      let gridHelper =  new THREE.GridHelper( 1000, 10 )
      this.scene.add( gridHelper);
      this.objects.push(gridHelper);
      this.addSelectionBox();

      // sets camera
      this.camera.position.set(0, 1000, 300);
      this.camera.lookAt( 0, 0, 0 );



      this.renderUpdate();
  }

  // adds geometry given geometry geom
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
  addGeometry(geom) {

      // adds geometry
      this.geometries[geom.uuid] = geom;
  }

  // adds material given material material1
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
  addMaterial(material1) {
      this.materials[material1.uuid]=material1;
  }

  // json
  // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
  // loads from json
  // Note: scene is not cleared
  fromJSON(json) {

      	let loader = new THREE.ObjectLoader();

      	// backwards; json is scene

      	if ( json.scene === undefined ) {

      		this.setScene( loader.parse( json ) );
      		return;

      	}

        // sets camera
      	this.camera = this.camera.copy(loader.parse( json.camera ));
        this.camera.aspect = this.DEFAULT_CAMERA1.aspect;
      	this.camera.updateProjectionMatrix();

        // sets scene
      	this.setScene( loader.parse( json.scene ) );

  }

  // converts to json
  toJSON(){

    	return {

    		metadata: {},
    		camera: this.camera.toJSON(),
    		scene: this.scene.toJSON(),

    	};
  }

  // initializes periodic rendering and adds event listeners
  animate(): void {
    window.addEventListener('DOMContentLoaded', this.onDOMContentLoaded);

    window.addEventListener('resize', this.resize);

    // adds events for controls
    this.controls.orbit.addEventListener( 'change', this.renderUpdate );
    this.controls.transformControl.addEventListener( 'change', () => {

        // updates helper of object if helper is defined
        let object = this.controls.transformControl.object;
        if ( object !== undefined ) {

            this.selectionBox.setFromObject( object );

            if ( this.helpers[ object.id ] !== undefined ) {

                this.helpers[ object.id ].update();

            }
        }

        this.renderUpdate();

    });
    this.controls.transformControl.addEventListener( 'dragging-changed', ( event ) => {
                                                      this.controls.orbit.enabled = ! event.value;
                                                   });
    // // adds event listeners
    this.canvas.addEventListener('mousemove', this.onDocumentMouseMove, false);
    this.canvas.addEventListener('mousedown', this.onDocumentMouseDown, false);

    document.addEventListener( 'keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  // dom content loaded event handler
  onDOMContentLoaded = (event) => {
    event.preventDefault();
    this.render();
  };

  // key up event handler
  onKeyUp = ( event ) => {
      event.preventDefault();
      switch ( event.keyCode ) {
        case 17: // Ctrl key up

          // disables translation / rotation snap
          this.controls.transformControl.setTranslationSnap( null );
          this.controls.transformControl.setRotationSnap( null );
          break;
      }
  };

  // key down event handler
  onKeyDown = ( event ) => {
      event.preventDefault();
      switch ( event.keyCode ) {
        case 81: // Q
          this.controls.transformControl.setSpace( this.controls.transformControl.space === "local" ? "world" : "local" );
          break;
        case 17: // Ctrl
          // enables translation / rotational snap
          this.controls.transformControl.setTranslationSnap( 100 );
          this.controls.transformControl.setRotationSnap( THREE._Math.degToRad( 15 ) );
          break;
        case 87: // W
          this.controls.transformControl.setMode( "translate" );
          break;
        case 69: // E
          this.controls.transformControl.setMode( "rotate" );
          break;
        case 82: // R
          this.controls.transformControl.setMode( "scale" );
          break;
        case 187:
        case 107: // +, =, num+
          this.controls.transformControl.setSize( this.controls.transformControl.size + 0.1 );
          break;
        case 189:
        case 109: // -, _, num-
          this.controls.transformControl.setSize( Math.max( this.controls.transformControl.size - 0.1, 0.1 ) );
          break;
        case 88: // X
          this.controls.transformControl.showX = ! this.controls.transformControl.showX;
          break;
        case 89: // Y
          this.controls.transformControl.showY = ! this.controls.transformControl.showY;
          break;
        case 90: // Z
          this.controls.transformControl.showZ = ! this.controls.transformControl.showZ;
          break;
        case 32: // Spacebar
          this.controls.transformControl.enabled = ! this.controls.transformControl.enabled;
          break;
        case 46: // Del
          if (this.selected){
              this.selectionBox.visible = false;
              this.removeObject(this.selected);
          }

          break;
      }
  };

  // render function
  render() {

    let time = Date.now() * 0.00005;

    requestAnimationFrame(() => {
      this.render();
    });

    this.renderUpdate();

  }

  // updates rendering
  renderUpdate = () => {

      this.scene.updateMatrixWorld();

      this.renderer.render(this.scene, this.camera);

  };

  // resizes window
  resize = (event) => {
    event.preventDefault();
    this.contW = window.innerWidth-300;
    this.contH = window.innerHeight-64;

    this.camera.aspect = this.contW / this.contH;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.contW, this.contH);
    this.renderUpdate();
  };

  // https://stackoverflow.com/questions/26193702/three-js-how-can-i-make-a-2d-snapshot-of-a-scene-as-a-jpg-image
  // saves screenshot
  saveAsImage() {
    let imgData, imgNode;
    let strDownloadMime = "image/octet-stream";

    try {
        let strMime = "image/jpeg";
        imgData = this.renderer.domElement.toDataURL(strMime);

        this.saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");

    } catch (e) {
        console.log(e);
        return;
    }

  }

  saveFile = function (strData, filename) {

      let link = document.createElement('a');
      if (typeof link.download === 'string') {
          document.body.appendChild(link); //Firefox requires the link to be in the body
          link.download = filename;
          link.href = strData;
          link.click();
          document.body.removeChild(link); //remove the link when done
      }
  };

  // https://stackoverflow.com/questions/20693405/user-uploaded-textures-in-three-js
  // Uploads image and inserts image
  insertImage = function(){

    // creates form for upload
    let link = document.createElement('input');
    link.type = "file";

    // adds event listener to upload form
    link.addEventListener('change', ()=>{

        // sets image upload element and texture
        let image = document.createElement( 'img' );
        let texture = new THREE.Texture( image );
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        image.onload = function()  {
            texture.needsUpdate = true;
        };

        // uploads image and assigns to image
        if (link.files && link.files[0]) {
          let reader = new FileReader();

          reader.onload = (e:any) => {
              image.src = e.target.result;
          };

          reader.readAsDataURL(link.files[0]);

          // removes upload form
          document.body.removeChild(link);
        }
        else
        {
            return;
        }

        // prepares and adds image mesh to scene
        let geometry = new THREE.PlaneGeometry(100, 100*0.75);
        let material = new THREE.MeshLambertMaterial({
                        color: "white",
                        map: texture,
                        side: THREE.DoubleSide
                      });

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(1,1,1);
        this.addObject(mesh);
    });

    document.body.appendChild(link);
    link.click();
  };

  // Updates selectionbox and helpers of selected object
  updateSelection()
  {
    let object = this.controls.transformControl.object;
    if ( object !== undefined ) {

        this.selectionBox.setFromObject( object );

        if ( this.helpers[ object.id ] !== undefined ) {

            this.helpers[ object.id ].update();

        }
    }

    this.renderUpdate();
  }

  // getters and setters
  getBackgroundColor = () =>
  {
      if(!this.scene) return null;
      return this.scene.background.getHexString();
  };

  setBackgroundColor = (color) =>
  {
      this.scene.background=new THREE.Color(color);
  };

  getFog = () =>
  {
      if(!this.scene) return null;
      return(this.scene.fog);
  };

  getSelected = () =>
  {
      return(this.selected);
  };

  getObjects = () =>
  {
      return(this.objects);
  }


}
