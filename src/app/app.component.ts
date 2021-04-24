

import { Component ,ViewContainerRef} from '@angular/core';
import { Router } from '@angular/router';


@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    //mode = '2d';
    title = 'app';
    constructor(
        public vcRef: ViewContainerRef
    ) {
    }
}
