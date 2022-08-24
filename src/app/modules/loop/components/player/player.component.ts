import {Component, OnInit} from '@angular/core';
import {LoopMenuService} from "@/global/services/loop-menu.service";
import {PlayerService} from "@/global/services/player.service";
import {VideoLoop} from "@/global/models/menu.model";
import {filter} from "rxjs";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  constructor(private loopMenuService : LoopMenuService,
              private playerService : PlayerService) {
  }

  ngOnInit(): void {
    this.loopMenuService.selectedVideoLoop$
      .pipe(filter(x => x !== undefined))
      .subscribe((videoLoop) => {
      if (!!videoLoop) {
        this.playerService.loadVideoLoop(videoLoop as VideoLoop);
      }
    });
  }

}
