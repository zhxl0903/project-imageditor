import { Injectable } from '@angular/core';
import "snapsvg-cjs";
import "./js/snap.svg.free_transform.js";


declare var Snap: any;

@Injectable({
  providedIn: 'root'
})

export class Engine2DService {

  // defines svg container element and svg canvas object
  private svgElement;
  private svgCanvas;
  private svgCanvasGroup;

  // defines snap.g object
  private selected_objects = [];

  private mouse = {x:0, y:0};

  //Create svg
  createSvg() {

    // gets svg canvas element and snap canvas object
    this.svgElement = document.getElementById('svg');
    this.svgCanvas = Snap("#svg");
    this.svgCanvasGroup = this.svgCanvas.group();

    this.svgCanvas.mousemove(this.onSVGMouseMove);
    document.addEventListener( 'keydown', this.onKeyDown);

  }

  // inserts image given path
  // returns inserted image object
  insertImage(path)
  {
    return(this.svgCanvasGroup.image(path, 280,80, 200,200 ));
  }

  // adds double click event to element given element
  // double click enables free transform tool on element
  // returns free transform tool object of element
  // Source: https://github.com/ibrierley/Snap.svg.FreeTransform/blob/master/index.html
  // Updates selection list on click
  // https://stackoverflow.com/questions/21337329/get-id-of-clicked-element-in-snap-svg
  addSelectionEvent(myEl)
  {
    let ft = this.svgCanvas.freeTransform(myEl, { snap: { rotate: 1 }, size: 8, draw: 'bbox'  });

    // sets properties of free transformer
    ft.attrs.rotate = 0;
    ft.apply();
    myEl.data('ftStatus', 0);

    // hides handles
    ft.hideHandles();

    // adds double click event of element
    myEl.dblclick( (e)=> {
        e.preventDefault();
        e.stopPropagation();

        if( myEl.data('ftStatus' ) ) {
            ft.hideHandles();
            this.selected_objects.splice( this.selected_objects.indexOf(myEl), 1 );
            myEl.data('ftStatus',0);
        } else {
            ft.showHandles();
            this.selected_objects.push(myEl);
            myEl.data('ftStatus',1);
        }
    });

    return ft;
  }

  // onmouse move event
  onSVGMouseMove = (event) => {
      event.preventDefault();

      // gets bounding box parameters of canvas
      let rect = this.svgElement.getBoundingClientRect();

      // computes normalized mouse positions
      this.mouse.x = ( (event.clientX - rect.left) / rect.width ) * 2 - 1;
      this.mouse.y = ( -(event.clientY - rect.top) / rect.height ) * 2 + 1;
  };

  onKeyDown = ( event ) => {
      event.preventDefault();
      switch ( event.keyCode ) {
        case 46: // Del

          // removes each selected object
          this.getSelectedObjects().forEach((ele)=>{
            ele.freeTransform.unplug();
            ele.remove();
          });

          // clears selected object list
          this.getSelectedObjects().length=0;
          break;
      }
    };


  // generates event for adding filter to an element
  addFilter(f)
  {
    return(function () {this.attr({ filter: f });});
  }

  clearSVGCanvas()
  {
    this.svgCanvas.clear();
  }

  // getters and setters
  getSelectedObjects()
  {
    return this.selected_objects;
  }

  getSVGCanvas()
  {
    return this.svgCanvas;
  }

  getSVGCanvasGroup()
  {
    return this.svgCanvasGroup;
  }

  getSVGElement()
  {
    return this.svgElement;
  }

  // exports svg
  export_svg()
  {
  }
}
