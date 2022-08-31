import {Injectable} from '@angular/core';
import {DUMMY_LOOP} from "@/global/const/loop.const";
import {Loop, PartialLoop, PlayerEvent, PlayerEventFrom, PlayerEventType} from "@/global/models";
import {BehaviorSubject} from "rxjs";
import {PlayerService} from "@/global/services/player.service";

@Injectable({
  providedIn: 'root'
})
export class LoopEventService {
  private _loop : Loop = DUMMY_LOOP;
  private _observableEvent = new BehaviorSubject<PlayerEvent>({from: PlayerEventFrom.APP, type: PlayerEventType.LOAD_LOOP, value: this._loop});

  get loopEvent$() {
    return this._observableEvent.asObservable();
  }

  constructor(private playerService : PlayerService) { }

  pushEvent(event: PlayerEvent) {
    let valueToEmit : PartialLoop = {};
    switch (event.type) {
      case PlayerEventType.RESTART:
        this.playerService.seekTo(this._loop.loop ? this._loop.beginSec ?? 0 : 0)
        break;
      case PlayerEventType.PLAY_PAUSE:
        this.playerService.togglePlayResume();
        break;
      case PlayerEventType.INC_PLAYBACK_SPEED:
        this._loop.playbackSpeed += 0.05;
        valueToEmit.playbackSpeed = this._loop.playbackSpeed;
        this.playerService.setPlaybackRate(this._loop.playbackSpeed);
        break;
      case PlayerEventType.DEC_PLAYBACK_SPEED:
        this._loop.playbackSpeed -= 0.05;
        valueToEmit.playbackSpeed = this._loop.playbackSpeed;
        this.playerService.setPlaybackRate(this._loop.playbackSpeed);
        break;
      case PlayerEventType.FWD_SEEK:
        this.playerService.seekTo(this.playerService.getCurrentTime() + 5);
        break;
      case PlayerEventType.BWD_SEEK:
        this.playerService.seekTo(this.playerService.getCurrentTime() - 5);
        break;
      case PlayerEventType.TGL_LOOP:
        this._loop.loop = !this._loop.loop;
        valueToEmit.loop = this._loop.loop;
        this.playerService.setLoop(this._loop.loop);
        break;
      case PlayerEventType.MUTE:
        break;
      case PlayerEventType.INC_VOL:
        break;
      case PlayerEventType.DEC_VOL:
        break;
      case PlayerEventType.CUSTOM:
        valueToEmit = event.value!;
        this._loop = {
          id: event.value!.id ?? this._loop.id,
          videoId: event.value!.videoId ?? this._loop.videoId,
          name: event.value!.videoId ?? this._loop.name,
          beginSec: event.value!.beginSec ?? this._loop.beginSec,
          endSec: event.value!.endSec ?? this._loop.endSec,
          playbackSpeed: event.value!.playbackSpeed ?? this._loop.playbackSpeed,
          loop: event.value!.loop ?? this._loop.loop
        }
        if (event.value!.videoId) {
          this.playerService.loadVideoLoop(this._loop);
        }
        if (event.value!.playbackSpeed) {
          this.playerService.setPlaybackRate(event.value!.playbackSpeed);
        }
        if (event.value!.beginSec) {
          this.playerService.setStartSec(event.value!.beginSec);
        }
        if (event.value!.endSec) {
          this.playerService.setEndSec(event.value!.endSec);
        }
        if (event.value!.loop !== undefined) {
          this.playerService.setLoop(event.value!.loop);
        }
        break;
      case PlayerEventType.LOAD_LOOP:
        valueToEmit = event.value!;
        this._loop = valueToEmit as Loop;
        this.playerService.loadVideoLoop(this._loop);
        break;
    }

    console.log('EVENT', PlayerEventType[event.type], {
      from: event.from,
      type: event.type,
      value: valueToEmit
    });

    this._observableEvent.next({
      from: event.from,
      type: event.type,
      value: valueToEmit
    });
  }
}
