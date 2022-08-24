import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ModalComponent, ToolbarComponent} from "@/global/components";
import {AngularModule} from "@/modules/shared/angular.module";

@NgModule({
  declarations : [
    ToolbarComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    AngularModule
  ],

  exports : [
    HttpClientModule,
    ToolbarComponent,
    ModalComponent
  ],
})
export class SharedModule {  }
