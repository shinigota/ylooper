import {Injectable} from '@angular/core';
import {filter, map} from "rxjs";
import {Loop, PlayerEventFrom, PlayerEventType} from "@/global/models";
import {LoopEventService} from "@/global/services/loop-event.service";

@Injectable({
  providedIn: 'root'
})
export class LoopMenuService {

  get selectedLoop$() {
    return this.loopEventService.loopEvent$
      .pipe(
        filter(e => e.type === PlayerEventType.SELECT_LOOP && e.value !== undefined),
        map(e => e.value as Loop)
      );
  }
  constructor(private loopEventService: LoopEventService) { }

  public async selectVideoLoop(loop: Loop) {
    if (loop.videoId) {
      this.loopEventService.pushEvent({from: PlayerEventFrom.APP, type: PlayerEventType.SELECT_LOOP, value: loop});
      this.loopEventService.pushEvent({from: PlayerEventFrom.APP, type: PlayerEventType.LOAD_LOOP, value: loop});
    }
  }
}
