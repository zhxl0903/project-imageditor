import {AfterViewInit, ElementRef, Component, OnInit } from '@angular/core';
import {Engine2DService} from './engine2d.service';


@Component({
  selector: 'app-engine',
  templateUrl: './engine2d.component.html',
  styleUrls: ['./engine2d.component.css']
})

export class Engine2DComponent implements OnInit {

  constructor(private engServ : Engine2DService, private elementRef:ElementRef){

  }

  ngOnInit(){
    this.engServ.createSvg();
    let ele= this.engServ.insertImage('./assets/img/test.jpg');
    this.engServ.addSelectionEvent(ele);
  }

  getEngineService()
  {
    return this.engServ;
  }

  ngOnDestroy() {

    // removes added event listeners
    document.removeEventListener("keydown", this.engServ.onKeyDown);
  }
}
