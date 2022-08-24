import {NgModule} from "@angular/core";

import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTreeModule} from "@angular/material/tree";

@NgModule({
  declarations : [ ],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatInputModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatTreeModule,
  ],
  exports : [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatInputModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatTreeModule,
  ]
})
export class AngularModule { }
