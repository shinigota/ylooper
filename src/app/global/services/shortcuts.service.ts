import {Injectable} from '@angular/core';
import {PlayerEventFrom, PlayerEventType} from "@/global/models";
import {LoopEventService} from "@/global/services/loop-event.service";

@Injectable({
  providedIn: 'root'
})
export class ShortcutsService {

  private eventMap = new Map<string, PlayerEventType> ([
    ['o', PlayerEventType.RESTART],
    ["p", PlayerEventType.TGL_LOOP],
   /* ['o', PlayerEventType.PLAY_PAUSE],
    ['i', PlayerEventType.INC_PLAYBACK_SPEED],
    ["k", PlayerEventType.DEC_PLAYBACK_SPEED],
    ["j", PlayerEventType.BWD_SEEK],
    ["l", PlayerEventType.FWD_SEEK],
    ["p", PlayerEventType.TGL_LOOP],
    ["m", PlayerEventType.MUTE],
    ["y", PlayerEventType.INC_VOL],
    ["h", PlayerEventType.DEC_VOL], */
  ]);

  constructor(private loopEventService : LoopEventService) { }

  dispatchKeyPress(key: string) {
    if ( this.eventMap.has(key) ) {
      this.loopEventService.pushEvent({from: PlayerEventFrom.APP, type: this.eventMap.get(key) as PlayerEventType});
    }
  }

}
