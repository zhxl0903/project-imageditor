import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { EngineComponent } from './engine/engine.component';
import {Engine2DComponent} from './engine2d/engine2d.component';
import { TopToolBarComponent } from './top-tool-bar/top-tool-bar.component';
import { MatMenuModule, MatButtonModule, MatIconModule, MatSidenavModule, MatTabsModule, MatListModule, GestureConfig} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RightSideMenuComponent } from './right-side-menu/right-side-menu.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { routing }        from './app.routing';

import { AlertComponent } from './_components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';

import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {MatTreeModule} from '@angular/material/tree';
import { SideMenu2dComponent } from './engine2d/side-menu2d/side-menu2d.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { MatCardModule } from '@angular/material/card';
import { CreditComponent } from './credit/credit.component';


@NgModule({
  declarations: [
    AppComponent,
    Engine2DComponent,
    EngineComponent,
    TopToolBarComponent,
    RightSideMenuComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SideMenu2dComponent,
    CreditComponent
  ],
  imports: [
    MatCardModule,
    MatButtonToggleModule,
    MatTreeModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    FormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSliderModule,
    BrowserModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    ColorPickerModule,
    MatSelectModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig},

    // provider used to create fake backend
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
