import { EngineService } from './engine.service';
import {AfterViewInit, ElementRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.css'],
})
export class EngineComponent implements OnInit {
  private canEleId = 'renderCanvas';

  constructor(private engServ: EngineService, private elementRef:ElementRef) {
  }

  ngOnInit() {
    this.engServ.createScene(this.canEleId, this.elementRef.nativeElement);
    this.engServ.animate();

  }

  getEngineService(){
    return(this.engServ);
  }

  ngOnDestroy() {

    // removes added event listeners
    document.removeEventListener("keydown", this.engServ.onKeyDown);
    document.removeEventListener("keyup", this.engServ.onKeyUp);
    document.removeEventListener("DOMContentLoaded", this.engServ.onDOMContentLoaded);
    document.removeEventListener("resize", this.engServ.resize);
  }

}
