import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {db, Loop, Video} from "@/global/models";
import {from} from "rxjs";
import {liveQuery} from "dexie";
import {LoopMenuService} from "@/global/services/loop-menu.service";

@Component({
  selector: 'app-loop-menu-video',
  templateUrl: './loop-menu-video.component.html',
  styleUrls: ['./loop-menu-video.component.scss']
})
export class LoopMenuVideoComponent implements OnInit {
  @Input()
  video !: Video;

  @Output()
  selectVideoId = new EventEmitter<string>();

  selectedLoopId: number = -1;
  loops: Loop[] = [];

  constructor(private loopMenuService : LoopMenuService) {
    this.loopMenuService.selectedLoop$
      .subscribe(loop =>
      {
        this.selectedLoopId = loop.id ?? -1}
      );
  }

  ngOnInit(): void {
    from(liveQuery(() => db.loops.where("videoId").equals(this.video.ytId).toArray()))
      .subscribe(loops => this.loops = loops);
  }

  selectLoop(loop: Loop) {
    this.loopMenuService.selectVideoLoop(loop);
    this.selectVideoId.emit(loop.videoId);
  }
}
