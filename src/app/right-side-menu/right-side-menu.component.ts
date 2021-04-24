import { Component, Injectable, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EngineComponent } from '../engine/engine.component';
import * as THREE from 'three-full';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree'

interface FoodNode {
  name: string;
  object: any;
  children?: FoodNode[];
}

@Component({
  providers: [EngineComponent],
  selector: 'app-right-side-menu',
  templateUrl: './right-side-menu.component.html',
  styleUrls: ['./right-side-menu.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class RightSideMenuComponent {
  public engServ;
  private receive_checked = false;
  private cast_checked = false;
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  constructor(private breakpointObserver: BreakpointObserver, private comp : EngineComponent) {
    this.engServ = this.comp.getEngineService();
  }

  hasChild = (_: number, node: FoodNode) => {
    return !!node.children && node.children.length > 0;
  };

  formatLabel = (value: number) => {
    if (!value) {
      return 0;
    }

    if (value >= 1000) {
      return 1000;
    }

    return value;
  };

  formatLabel2 = (value: number) => {
    if (!value) {
      return 0;
    }

    if (value >= 0.01) {
      return 0.01;
    }

    return value;
  };

  ngOnInit() {
  }

  // gets backgorund color of scene
  getBackgroundColor()
  {
    let bkcolor = this.engServ.getBackgroundColor();
    return (bkcolor ? bkcolor : undefined);
  }

  // gets DataSource for Object Tree
  getSceneData()
  {
      return(this.engServ.getObjects().filter(ele => {
        return this.engServ.isNotSceneHelper(ele);
      }).map(ele => {
        return {name: String(ele.constructor.name), object: ele};
      }));
  }

  // gets fog color
  getFogColor()
  {
      let fog = this.engServ.getFog();
      return(fog ? fog.color.getHexString() : undefined);

  }

  // gets fog option
  getFogOption()
  {
      let fog = this.engServ.getFog();
      if (fog == null)
      {
        // no fog setting
        return "option1";
      }
      else if (fog instanceof THREE.Fog)
      {
        // linear fog setting
        return "option2";
      }
      else{
        // fogexp2 setting
        return "option3";
      }

  }

  // gets fog density hidden property based on fog type
  getFogDensityHidden()
  {
      return !(this.engServ.getFog() instanceof THREE.FogExp2);
  }

  // gets fog range hidden property based on fog type
  getFogRangeHidden()
  {
      return !(this.engServ.getFog() instanceof THREE.Fog);
  }

  // gets name of selected object
  getObjectName()
  {
      return this.engServ.getSelected() ? this.engServ.getSelected().name : "";
  }

  // Object Position, Rotation, and Scale setting getters
  getObjectX()
  {
      return this.engServ.getSelected() ? this.engServ.getSelected().position.x : "";
  }

  getObjectY()
  {
      return this.engServ.getSelected() ? this.engServ.getSelected().position.y : "";
  }
  getObjectZ()
  {
      return this.engServ.getSelected() ? this.engServ.getSelected().position.z : "";
  }

  getObjectRotationX()
  {
      return this.engServ.getSelected() ? this.engServ.getSelected().rotation._x : "";
  }

  getObjectRotationY()
  {
      return this.engServ.getSelected() ? this.engServ.getSelected().rotation._y : "";
  }
  getObjectRotationZ()
  {
      return this.engServ.getSelected() ? this.engServ.getSelected().rotation._z : "";
  }

  getObjectScaleX()
  {
      return this.engServ.getSelected() ? this.engServ.getSelected().scale.x : "";
  }

  getObjectScaleY()
  {
      return this.engServ.getSelected() ? this.engServ.getSelected().scale.y : "";
  }
  getObjectScaleZ()
  {
      return this.engServ.getSelected() ? this.engServ.getSelected().scale.z : "";
  }

  // gets selected object visibility
  getObjectVisibility()
  {
      let selected = this.engServ.getSelected();
      return(selected ? selected.visible : false);
  }

  // gets user data in string
  getUserData()
  {
    let selected = this.engServ.getSelected();
    return(selected ? JSON.stringify(selected.userData):"");
  }

  // gets fog range
  getFogRange()
  {
    let fog = this.engServ.getFog();
    if (fog instanceof THREE.Fog) return fog.far;
    return 0;
  }

  // gets fog density
  getFogExpDensity()
  {
    let fog = this.engServ.getFog();
    if (fog instanceof THREE.FogExp2) return fog.density;
    return 0;
  }

  // gets shadow receive property of selected object
  getShadowReceive()
  {
    let selected = this.engServ.getSelected();
    return(selected ? selected.receiveShadow : false);
  }

  // gets shadow cast property of selected object
  getShadowCast()
  {
    let selected = this.engServ.getSelected();
    return(selected ? selected.castShadow : false);
  }

  // gets object emissive color property of selected mesh
  getObjectEmissiveColor()
  {
    let selected = this.engServ.getSelected();
    if(!(selected instanceof THREE.Mesh)) return undefined;
    return(selected ? (selected.material ? selected.material.emissive.getHexString() : undefined) : undefined);
  }

  // gets object color property of selected mesh
  getObjectColor()
  {
    let selected = this.engServ.getSelected();
    if(!(selected instanceof THREE.Mesh)) return undefined;
    return(selected ? (selected.material ? selected.material.color.getHexString() : undefined) : undefined);
  }

  // gets object material tab hidden property of selected object
  getMaterialHidden()
  {
    let selected = this.engServ.getSelected();
    if(selected==null) return true;

    return(!(selected instanceof THREE.Mesh));
  }

  // gets text input object geometry hidden property
  getTextInputHidden()
  {
    let selected = this.engServ.getSelected();
    return (!selected || !(selected.geometry instanceof THREE.TextGeometry));
  }

  // event handler for onFogSelection
  onFogSelection(event:any):void{

    switch (event.value){
      case "option2":

        this.engServ.addFog(0x000000, 0, 300);

        break;
      case "option3":

        this.engServ.addFogExp2(0x000000, 0.001);

        break;
      default:
        this.engServ.removeFog();
        // No Fog
        break;

    }
    this.engServ.renderUpdate();
  }

  // event handler for onFogColorPickerChange
  onFogColorPickerChange(event: string):void{
    this.engServ.getFog().color=new THREE.Color(event);
    this.engServ.renderUpdate();
  }

  // event handler for onBackgroundColorPickerChange
  onBackgroundColorPickerChange(event: string):void{
    this.engServ.setBackgroundColor(event);
    this.engServ.renderUpdate();
  }

  //event handler for object name change
  onObjectNameChange(event)
  {
    let selected = this.engServ.getSelected();
    if(selected) selected.name=event.target.value;
  }

  // objectPositionChange event handlers
  onObjectXChange(event)
  {
    let selected = this.engServ.getSelected();
    if(selected)
    {
      selected.position.setX(this.filterNaN(event.target.value));
      this.engServ.updateSelection();
    }
  }

  onObjectYChange(event)
  {
    let selected = this.engServ.getSelected();
    if(selected)
    {
      selected.position.setY(this.filterNaN(event.target.value));
      this.engServ.updateSelection();
    }
  }

  onObjectZChange(event)
  {
    let selected = this.engServ.getSelected();
    if(selected)
    {
      selected.position.setZ(this.filterNaN(event.target.value));
      this.engServ.updateSelection();
    }
  }

  // ObjectRoationChange Handlers
  onObjectRotationXChange(event)
  {
    let selected = this.engServ.getSelected();
    if(selected)
    {
      selected.rotation.x=this.filterNaN(event.target.value);
      this.engServ.updateSelection();
    }
  }

  onObjectRotationYChange(event)
  {
    let selected = this.engServ.getSelected();
    if(selected)
    {
      selected.rotation.y=this.filterNaN(event.target.value);
      this.engServ.updateSelection();
    }
  }

  onObjectRotationZChange(event)
  {
    let selected = this.engServ.getSelected();
    if(selected)
    {
      selected.rotation.z=this.filterNaN(event.target.value);
      this.engServ.updateSelection();
    }

  }

  // Object Scale Event Handler
  onObjectScaleXChange(event)
  {
    let selected = this.engServ.getSelected();
    if(selected)
    {
      selected.scale.setX(this.filterZero(this.filterNaN(event.target.value)));
      this.engServ.updateSelection();
    }
  }

  onObjectScaleYChange(event)
  {
    let selected = this.engServ.getSelected();
    if(selected)
    {
      selected.scale.setY(this.filterZero(this.filterNaN(event.target.value)));
      this.engServ.updateSelection();
    }
  }

  onObjectScaleZChange(event)
  {
    let selected = this.engServ.getSelected();
    if(selected)
    {
      selected.scale.setZ(this.filterZero(this.filterNaN(event.target.value)));
      this.engServ.updateSelection();
    }
  }

  // Object Visiblity Slider Change
  onObjectVisibilityChange(event)
  {
    let selected = this.engServ.getSelected();

    if (!selected) return;

    selected.visible=event.checked;
    this.engServ.renderUpdate();
  }

  // Fog property change event handlers
  onFogDensitySliderChange(event)
  {
    let fog = this.engServ.getFog();
    if (fog instanceof THREE.FogExp2) fog.density=event.value;
    this.engServ.renderUpdate();
  }

  onFogRangeSliderChange(event)
  {
    let fog = this.engServ.getFog();
    if (fog instanceof THREE.Fog) fog.far=event.value;
    this.engServ.renderUpdate();
  }

  // shadow receive property event handler
  onShadowReceiveChange(event)
  {
    let selected = this.engServ.getSelected();
    if(selected) selected.receiveShadow=event.checked;
    this.engServ.renderUpdate();
  }

  // shadow cast property event handler
  onShadowCastChange(event)
  {
    let selected = this.engServ.getSelected();
    if(selected) selected.castShadow=event.checked;
    this.engServ.renderUpdate();
  }

  // selected object color change event handlers
  onObjectEmissiveColorChange(event)
  {
    let selected = this.engServ.getSelected();
    if(!(selected instanceof THREE.Mesh)) return;
    if(selected.material==null) return;
    selected.material.emissive = new THREE.Color(event);
    this.engServ.renderUpdate();
  }

  onObjectColorChange(event)
  {
    let selected = this.engServ.getSelected();
    if(!(selected instanceof THREE.Mesh)) return;
    if(selected.material==null) return;
    selected.material.color = new THREE.Color(event);
    this.engServ.renderUpdate();
  }

  // objects menu click event handler
  onObjectMenuItemClick(ele)
  {
    this.engServ.select(ele.object);
    this.engServ.renderUpdate();
  }

  // returns prepared number in Float from string
  // returns 0 if string is parsed to NaN
  filterNaN(num)
  {
    let n = parseFloat(num);
    return(isNaN(n) ? 0.0 : n);
  }

  // filters zero and changes to 0.01
  filterZero(num)
  {
    return(num==0 ? 0.0000000001 : num);
  }
}
