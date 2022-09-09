import {Component, OnInit, ViewChild} from '@angular/core';
import {db, Video} from "@/global/models";
import {liveQuery} from "dexie";
import {LoopMenuService} from "@/global/services/loop-menu.service";
import {from} from "rxjs";
import {LoopImportModalComponent} from "@/modules/loop/components/loop-import-modal/loop-import-modal.component";
import {LoopExportModalComponent} from "@/modules/loop/components/loop-export-modal/loop-export-modal.component";

@Component({
  selector: 'app-loop-menu',
  templateUrl: './loop-menu.component.html',
  styleUrls: ['./loop-menu.component.scss']
})

export class LoopMenuComponent implements OnInit {
  @ViewChild("importModal") private importModal !: LoopImportModalComponent;
  @ViewChild("exportModal") private exportModal !: LoopExportModalComponent;
  private videos$ = from(liveQuery(() => db.videos.toArray()));

  currentPlayingVideoId: string = '0';
  clickedVideoId: string = '0';

  videos : Video[] = [];

  constructor(private menuService : LoopMenuService) {
    this.videos$.subscribe(videos => this.videos = videos);
    this.menuService.selectedLoop$
      .subscribe(loop => {
        this.currentPlayingVideoId = loop.videoId ?? '0'
        this.clickedVideoId = this.currentPlayingVideoId;
      });
  }

  ngOnInit(): void {

  }

  onSelectVideoId(videoId: string) {
    this.currentPlayingVideoId = videoId;
  }

  import() {
    this.importModal.open();
  }

  export() {
    this.exportModal.open();
  }

  onClickOnVideo(ytId: string) {
    this.clickedVideoId = ytId;
  }
}
