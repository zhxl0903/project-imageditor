import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { EngineComponent } from './engine';
import { RightSideMenuComponent } from './right-side-menu/right-side-menu.component';
import { TopToolBarComponent } from './top-tool-bar/top-tool-bar.component';
import {Engine2DComponent} from './engine2d/engine2d.component';
import { CreditComponent } from './credit/credit.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate:[AuthGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'engine2d', component: Engine2DComponent},
    { path: 'engine3d', component:EngineComponent},
    { path: 'credit', component: CreditComponent},

    // otherwise redirect to homes
    { path: '**', redirectTo: 'login' }
];

export const routing = RouterModule.forRoot(appRoutes);
