import { Component, OnInit, ElementRef, ViewEncapsulation} from '@angular/core';
import {Engine2DComponent } from '../engine2d.component';
import {Engine2DService} from '../engine2d.service';
import "snapsvg-cjs";
import "../js/snap.svg.free_transform.js";
import {saveSvgAsPng} from'save-svg-as-png';
import { AuthenticationService } from '../../_services';
import { User } from '../../_models';
import { Router } from '@angular/router';

declare var Snap: any;

@Component({
  providers: [Engine2DComponent],
  selector: 'app-side-menu2d',
  templateUrl: './side-menu2d.component.html',
  styleUrls: ['./side-menu2d.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SideMenu2dComponent implements OnInit {

  public engServ: Engine2DService;
  public color: string = '#000000';
  currentUser: User;

  constructor(private comp : Engine2DComponent, private router: Router,
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

  // getters below

  ////////////////////////////////////////
  // event handlers below
  // inserts image from file
  onImageFileAdd(event)
  {

    // creates form for upload
    let link = document.createElement('input');
    link.type = "file";

    // adds event listener to upload form
    link.addEventListener('change', ()=>{

        // uploads image and assigns to image
        if (link.files && link.files[0]) {
          let reader = new FileReader();

          reader.onload = (e:any) => {
              let img = this.engServ.insertImage(e.target.result);

              this.engServ.addSelectionEvent(img);
          };

          reader.readAsDataURL(link.files[0]);

          // removes upload form
          document.body.removeChild(link);
        }
        else
        {
          return;
        }
    });

    document.body.appendChild(link);
    link.click();

  }

  // exports image to png
  onImageExport(event)
  {
    saveSvgAsPng(this.engServ.getSVGElement(), "save.png");
  }

  // applies filter to selected elements given filter f
  apply_filter_selected(f)
  {
    this.engServ.getSelectedObjects().forEach((ele)=>{
      ele.attr({ filter: this.engServ.getSVGCanvas().filter(f)});
    })
  }

  // applies blue filter to selected elements
  onBlurFilterApply(event)
  {
    let f = Snap.filter.blur(5, 10);
    this.apply_filter_selected(f);
  }

  // applies sepia filter to selected elements
  onSepiaFilterApply(event)
  {
    let f = Snap.filter.sepia(0.8);
    this.apply_filter_selected(f);
  }

  // applies gray scale filter to selected elements
  onGrayScaleFilterApply(event)
  {
    let f = Snap.filter.grayscale(0.8);
    this.apply_filter_selected(f);
  }

  // removes filters
  onHueRotateFilterApply(event)
  {
    let f = Snap.filter.hueRotate(90);
    this.apply_filter_selected(f);
  }

  // applies invert filter to selected elements
  onInvertFilterApply(event)
  {
    let f = Snap.filter.invert(1.0);
    this.apply_filter_selected(f);
  }

  // applies shadow filter to selected elements
  onShadowFilterApply(event)
  {
    let f = Snap.filter.shadow(0, 2, .3);
    this.apply_filter_selected(f);
  }

  // applies saturate filter to selected elements
  onSaturateFilterApply(event)
  {
    let f = Snap.filter.saturate(0.5);
    this.apply_filter_selected(f);
  }

  // removes filter
  onNoFilterApply(event)
  {
    this.engServ.getSelectedObjects().forEach((ele)=>{
      ele.attr({ filter: null});
    })
  }

  // inserts text
  onAddText(event)
  {
    // Gets text from user
    let inputText = window.prompt("Please enter your text", "Text");
    if (!inputText) inputText = "Text";

    // Adds text and text selection event
    let text = this.engServ.getSVGCanvasGroup().text(50, 50, inputText);

    this.engServ.addSelectionEvent(text);
  }

  // on delete text button handler
  onDeleteText(event)
  {
    let selected_objects = this.engServ.getSelectedObjects();

    // unplugs freetranform of each text element and removes each text element from dom
    selected_objects.forEach((ele)=>{
      if(ele.type=="text")
      {
        ele.freeTransform.unplug();
        ele.remove();
      }
    });

    // removes each text element from selected_objects list
    selected_objects.forEach((ele)=>{
      if(ele.type=="text")
      {
        selected_objects.splice( selected_objects.indexOf(ele), 1 );
      }

    });

  }

  // on font weight bold button click event handler
  onToogleBoldText(event)
  {
    let selected_objects = this.engServ.getSelectedObjects();

    // toogles font weight for each selected text element
    selected_objects.forEach((ele)=>{

      // toogles font weight iff element is text
      if(ele.type=="text")
      {
        let fontWeight = ele.attr("fontWeight");
        let newFontWeight = (!fontWeight || fontWeight==400) ? 700 : 400;
        ele.attr({fontWeight: newFontWeight});
      }
    });

  }

  // toogle text italics button click event handler
  onToogleItalics(event)
  {
    let selected_objects = this.engServ.getSelectedObjects();

    // toogles font style for each selected text element
    selected_objects.forEach((ele)=>{

      // toogles font style iff element is text
      if(ele.type=="text")
      {
        let fontStyle = ele.attr("fontStyle");
        let newFontStyle = (!fontStyle || fontStyle=="normal") ? "italic" : "normal";
        ele.attr({fontStyle: newFontStyle});
      }
    });

  }

  // toogle text decoration button click event handler
  onToogleUnderline(event)
  {
    let selected_objects = this.engServ.getSelectedObjects();

    // toogles text decoration for each selected text element
    selected_objects.forEach((ele)=>{

      // toogles text decoration iff element is text
      if(ele.type=="text")
      {
        let textDecoration = ele.attr("text-decoration");
        let newTextDecoration = (!textDecoration || textDecoration.startsWith("none")) ? "underline" : "none";
        ele.attr({"text-decoration": newTextDecoration});
      }
    });

  }

  // event handler for line insert button
  onLineInsert(event)
  {

    // inserts line
    let line = this.engServ.getSVGCanvasGroup().line(50, 50, 200, 50).attr({
                        cursor: 'move',
                        stroke: "#000",
                        strokeWidth: 3
                        });;
    this.engServ.addSelectionEvent(line);

  }

  // event handler for curve insert button
  onCurveInsert(event)
  {
    // inserts curve
    let curve = this.engServ.getSVGCanvasGroup().path("M100 100c50 30 50 30 100 0").attr({
                        cursor: 'move',
                        stroke: "#000",
                        fill: 'none',
                        strokeOpacity: 1,
                        strokeWidth: 3
                        });;

    this.engServ.addSelectionEvent(curve);

  }

  // event handler for circle insert button
  onCircleInsert(event)
  {
    // inserts circle
    let circle = this.engServ.getSVGCanvasGroup().circle(100,100,100).attr({
                        cursor: 'move',
                        stroke: "#000",
                        fill: 'none',
                        strokeOpacity: 1,
                        strokeWidth: 3
                        });;;

    this.engServ.addSelectionEvent(circle);

  }

  // event handler for rectangle insert button
  onRecInsert(event)
  {
    // inserts rectangle
    let rect = this.engServ.getSVGCanvasGroup().rect(100,100,300, 100 ).attr({
                        cursor: 'move',
                        stroke: "#000",
                        fill: 'none',
                        strokeOpacity: 1,
                        strokeWidth: 3
                        });;;

    this.engServ.addSelectionEvent(rect);

  }

  // event handler for square insert button
  onSquareInsert(event)
  {

    // inserts square
    let square = this.engServ.getSVGCanvasGroup().rect(100,100,100, 100).attr({
                        cursor: 'move',
                        stroke: "#000",
                        fill: 'none',
                        strokeOpacity: 1,
                        strokeWidth: 3
                        });;;

    this.engServ.addSelectionEvent(square);

  }

  // event handler for heart insert button
  // Heart parametric curve: https://www.quora.com/What-is-the-equation-that-gives-you-a-heart-on-the-graph
  onHeartInsert(event)
  {

    let pathString = "M300 290";
    let i, _x, _y;

    // generates points on the parametric curve for heart and appends to path string
    for (i = 0; i < 101; i += 1) {
        let a = 2 * Math.PI * i / 100;

        _x = 2*(16*Math.sin(a)**3) + 300;
        _y = -2*(13*Math.cos(a) - 5*Math.cos(2*a) - 2*Math.cos(3*a) - Math.cos(4*a)) + 300;

        _x = (_x<1e-10 ? 0.0: _x);
        _y = (_y<1e-10 ? 0.0: _y);

        pathString += "L" + _x + " " + _y;
    }

    pathString += "Z";

    // adds curve to snap canvas
    let curve = this.engServ.getSVGCanvasGroup().path(pathString).attr({
                        cursor: 'move',
                        stroke: "#000",
                        fill: 'none',
                        strokeOpacity: 1,
                        strokeWidth: 3
                        });

    // adds event handlers for selection
    this.engServ.addSelectionEvent(curve);
  }

  // event handler for triangle insert button
  onTriangleInsert(event)
  {

    // adds curve
    let triangle = this.engServ.getSVGCanvasGroup().polyline(300, 200, 400, 300, 200, 300, 300, 200).attr({
                        cursor: 'move',
                        stroke: "#000",
                        fill: 'none',
                        strokeOpacity: 1,
                        strokeWidth: 3
                        });

    this.engServ.addSelectionEvent(triangle);


  }

  // event handler for pentagon insert button
  onPentagonInsert(event)
  {

    // adds pentagon using polylines
    let pentagon = this.engServ.getSVGCanvasGroup().polyline(300, 200, 400, 300, 350, 400, 250, 400, 200, 300, 300, 200).attr({
                        cursor: 'move',
                        stroke: "#000",
                        fill: 'none',
                        strokeOpacity: 1,
                        strokeWidth: 3
                        });

    this.engServ.addSelectionEvent(pentagon);
  }

  // event handler for star insert button
  onStarInsert(event)
  {

    // adds star using polylines
    let star = this.engServ.getSVGCanvasGroup().polyline(350, 75, 379, 161, 469, 161, 397, 215,
                        423, 301, 350, 250, 277, 301, 303, 215, 231, 161, 321, 161, 350, 75).attr({
                        cursor: 'move',
                        stroke: "#000",
                        fill: 'none',
                        strokeOpacity: 1,
                        strokeWidth: 3
                        });

    this.engServ.addSelectionEvent(star);
  }

  // rotation event handler
  onRotate(event: any, left: boolean)
  {
    // gets selected objects
    let selected_objects = this.engServ.getSelectedObjects();

    // applies roation to each selected element
    selected_objects.forEach(function(ele){
      let ft = ele.freeTransform;
      ft.attrs.rotate -= (left ? 90 : -90);
      ft.apply();
    })

  }

  // Flip event handler
  // Horizontal Flip iff horizontal
  onObjectFlip(event: any, horizontal: boolean)
  {
    // gets selected objects
    let selected_objects = this.engServ.getSelectedObjects();

    // applies flip to each selected element
    selected_objects.forEach(function(ele){
      let ft = ele.freeTransform;
      if(horizontal)
      {
        ft.attrs.scale.y *= -1;
      }
      else
      {
        ft.attrs.scale.x *= -1;
      }

      ft.apply();
    })

  }

  getSelectedColor () {
    return("#000000");
  }

  onSelectedColorChange(event: any) {
    let selected_objects = this.engServ.getSelectedObjects();
    this.color = event;
    
    selected_objects.forEach(function(ele){
      ele.attr({"fill": event});
    })
  }



}
