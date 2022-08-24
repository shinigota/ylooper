import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularModule} from "@/modules/shared/angular.module";
import {LoopModule} from "@/modules/loop/loop.module";
import {SideNavService} from "@/modules/loop/services/side-nav.service";
import {RouterModule} from "@angular/router";
import {appRoutes} from "@/app.routes";
import {SharedModule} from "@/modules/shared/shared.module";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule.forRoot(appRoutes),
        BrowserAnimationsModule,
        LoopModule,

        SharedModule,
        AngularModule
    ],
    providers: [SideNavService],
    exports: [ ],
    bootstrap: [AppComponent]
})
export class AppModule { }
