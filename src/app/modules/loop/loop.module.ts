import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoopComponent} from '../loop/loop.component';
import {SharedModule} from "@/modules/shared/shared.module";
import {AngularModule} from "@/modules/shared/angular.module";
import {PlayerComponent} from './components/player/player.component';
import {PlayerControlsComponent} from './components/player-controls/player-controls.component';
import {ReactiveFormsModule} from "@angular/forms";
import {LoopMenuComponent} from './components/loop-menu/loop-menu.component';
import {LoopMenuVideoComponent} from './components/loop-menu-video/loop-menu-video.component';
import {LoopImportModalComponent} from './components/loop-import-modal/loop-import-modal.component';
import {LoopExportModalComponent} from './components/loop-export-modal/loop-export-modal.component';


@NgModule({
  declarations: [
    LoopComponent,
    PlayerComponent,
    PlayerControlsComponent,
    LoopMenuComponent,
    LoopMenuVideoComponent,
    LoopImportModalComponent,
    LoopExportModalComponent
  ],
  exports: [
      LoopComponent,
      LoopImportModalComponent
  ],
  imports: [
    CommonModule,
    AngularModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class LoopModule { }
