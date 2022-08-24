import {Injectable, OnInit} from '@angular/core';
import {PlayerService} from "@/global/services/player.service";
import {PlayerEventService} from "@/global/services/player-event.service";
import {PlayerEventType} from "@/global/models";

@Injectable({
  providedIn: 'root'
})
export class ShortcutsService {

  private eventMap = new Map<string, PlayerEventType> ([
    ['u', PlayerEventType.RESTART],
    ['o', PlayerEventType.PLAY_PAUSE],
    ['i', PlayerEventType.INC_PLAYBACK_SPEED],
    ["k", PlayerEventType.DEC_PLAYBACK_SPEED],
    ["j", PlayerEventType.BWD_SEEK],
    ["l", PlayerEventType.FWD_SEEK],
    ["p", PlayerEventType.TGL_LOOP],
    ["m", PlayerEventType.MUTE],
    ["y", PlayerEventType.INC_VOL],
    ["h", PlayerEventType.DEC_VOL],
  ]);

  constructor(private playerEventService : PlayerEventService) { }

  dispatchKeyPress(key: string) {
    if ( this.eventMap.has(key) ) {
      this.playerEventService.event = this.eventMap.get(key) as PlayerEventType;
    }
  }

}
