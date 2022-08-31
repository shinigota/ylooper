import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SideNavService} from "@/modules/loop/services/side-nav.service";
import {MatSidenav} from "@angular/material/sidenav";
import {PlayerService} from "@/global/services/player.service";
import {LoopMenuService} from "@/global/services/loop-menu.service";
import {LoopImportModalComponent} from "@/modules/loop/components/loop-import-modal/loop-import-modal.component";
import {LoopExportModalComponent} from "@/modules/loop/components/loop-export-modal/loop-export-modal.component";
import {LoopEventService} from "@/global/services/loop-event.service";
import {PlayerEventFrom, PlayerEventType} from "@/global/models";
import {DUMMY_LOOP} from "@/global/const/loop.const";

@Component({
  selector: 'app-loop',
  templateUrl: './loop.component.html',
  styleUrls: ['./loop.component.scss'],
  providers: [LoopMenuService]
})
export class LoopComponent implements OnInit, AfterViewInit {
  @ViewChild("importModal") private importModal !: LoopImportModalComponent;
  @ViewChild("exportModal") private exportModal !: LoopExportModalComponent;
  @ViewChild("drawer") private sideNav !: MatSidenav;

  private resizeTimeout: any;
  constructor(private sideNavService: SideNavService,
              private playerService: PlayerService,
              private loopEventService : LoopEventService) { }

  ngOnInit(): void {
    this.loopEventService.pushEvent({
      from: PlayerEventFrom.APP,
      type: PlayerEventType.LOAD_LOOP,
      value: DUMMY_LOOP
    });

    this.playerService.playerReady$.subscribe((playerReady) => {
      let playerContainer = document.getElementById('player-container');
      let player = document.getElementById('player');
      if (playerReady && playerContainer && player) {
        new ResizeObserver(() => {
          player!.hidden = true;
          clearTimeout(this.resizeTimeout);
          this.resizeTimeout = setTimeout(this.onResizeEnd, 300)
        }).observe(playerContainer!);
      }
    });
  }

  private onResizeEnd() {
    let player = document.getElementById('player');
    player!.hidden = false;

  }
  toggleSideNav() {
    this.sideNavService.toggle();
  }

  ngAfterViewInit(): void {
    this.sideNavService.setSideNav(this.sideNav);
  }

  import() {
    this.importModal.open();
  }

  export() {
    this.exportModal.open();
  }
}
