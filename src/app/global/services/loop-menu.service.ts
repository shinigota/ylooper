import {Injectable} from '@angular/core';
import {filter, map} from "rxjs";
import {Loop, PlayerEventFrom, PlayerEventType} from "@/global/models";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {LoopEventService} from "@/global/services/loop-event.service";

@Injectable({
  providedIn: 'root'
})
export class LoopMenuService {

  get selectedLoop$() {
    return this.loopEventService.loopEvent$
      .pipe(
        filter(e => e.type === PlayerEventType.LOAD_LOOP && e.value !== undefined),
        map(e => e.value as Loop)
      );
  }
  constructor(private route: ActivatedRoute,
              private loopEventService: LoopEventService) {

    this.route.firstChild?.paramMap.subscribe((params: ParamMap) => {
      let loopArr : any  = JSON.parse(atob(params.get('loop')!));
      let loop = {
          name: loopArr[1],
          playbackSpeed: loopArr[4],
          loop: !!loopArr[5],
          beginSec: loopArr[2],
          endSec: loopArr[3],
          videoId: loopArr[0]
      };
      this.loopEventService.pushEvent({from: PlayerEventFrom.APP, type: PlayerEventType.LOAD_LOOP, value: loop})
    });
  }

  public async selectVideoLoop(loop: Loop) {
    if (loop.videoId) {
      this.loopEventService.pushEvent({from: PlayerEventFrom.APP, type: PlayerEventType.LOAD_LOOP, value: loop});
    }
  }
}
