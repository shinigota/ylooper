import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, from, of} from "rxjs";
import {PlayerService} from "@/global/services/player.service";
import {LoopsService} from "@/global/services/loops.service";
import {db, Loop, PlayerEventFrom, PlayerEventType, Video, VideoData} from "@/global/models";
import {VideosService} from "@/global/services/videos.service";
import {DUMMY_LOOP} from "@/global/const/loop.const";
import {Clipboard} from '@angular/cdk/clipboard';
import {LoopEventService} from "@/global/services/loop-event.service";


@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss']
})
export class PlayerControlsComponent {
  private videoData : VideoData = {
    isPlaying: false,
    title: 'Foo'
  };

  private _currentLoop: Loop = DUMMY_LOOP;

  get currentLoop() {
    return this._currentLoop;
  }

  get isPlaying(): boolean {
    return this.videoData.isPlaying;
  }

  form = new FormGroup({
    name: new FormControl(''),
    url: new FormControl('', Validators.required),
    loop: new FormControl(true, Validators.required),
    beginSec: new FormControl(null,),
    endSec: new FormControl(null),
    playbackSpeed: new FormControl(1, Validators.required),
  });

  constructor(private playerService: PlayerService,
              private loopService: LoopsService,
              private videoService: VideosService,
              private clipboard: Clipboard,
              private loopEventService: LoopEventService) {

    this.playerService.videoData$.subscribe((videoData) => {
      this.videoData = videoData
    });

    this.loopEventService.loopEvent$.subscribe(event => {
      if (event.from == PlayerEventFrom.USER)
        return;

      let valToPatch : any = {};
      if (event.value?.videoId)
        valToPatch.url = 'https://www.youtube.com/watch?v=' + event.value?.videoId;
      if (event.value?.name)
        valToPatch.name = event.value?.name;
      if (event.value?.beginSec)
        valToPatch.beginSec = this.secondsToFormatedMinutes(event.value?.beginSec);
      if (event.value?.endSec)
        valToPatch.endSec = this.secondsToFormatedMinutes(event.value?.endSec);
      if (event.value?.playbackSpeed)
        valToPatch.playbackSpeed = event.value?.playbackSpeed;
      if (event.value?.loop !== undefined)
        valToPatch.loop = event.value?.loop;

      this.form.patchValue(valToPatch, {emitEvent: false});

      if (event.type == PlayerEventType.LOAD_LOOP) {
        this._currentLoop = event.value as Loop;
      }
    })

    this.bindFormInputsToPlayer();
}

  private bindFormInputsToPlayer() {
    this.form.controls['url'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      this.loopEventService.pushEvent({from: PlayerEventFrom.USER, type: PlayerEventType.CUSTOM, value: {videoId: this.playerService.getVideoIdFromURL(this.form.controls['url'].value)}});

    });

    this.form.controls['beginSec'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      this.loopEventService.pushEvent({from: PlayerEventFrom.USER, type: PlayerEventType.CUSTOM, value: {beginSec: this.formatedMinutesToSeconds(value) as number}});
    });

    this.form.controls['endSec'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      this.loopEventService.pushEvent({from: PlayerEventFrom.USER, type: PlayerEventType.CUSTOM, value: {endSec: this.formatedMinutesToSeconds(value) as number}});
    });

    this.form.controls['playbackSpeed'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.loopEventService.pushEvent({from: PlayerEventFrom.USER, type: PlayerEventType.CUSTOM, value: {playbackSpeed: value}});
    });

    this.form.controls['loop'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.loopEventService.pushEvent({from: PlayerEventFrom.USER, type: PlayerEventType.CUSTOM, value: {loop: value}});
    });
  }

  togglePlayPause() {
    this.playerService.togglePlayResume();
  }

  updateLoop() {
    this.loopService.update(this.formToVideo(), this.formToLoop());
  }

  saveLoopAsNew() {
    let tmpLoop = this.formToLoop();
    tmpLoop.id = undefined;

    db.videos.get(this.playerService.getVideoIdFromURL(this.form.controls['url'].value) ?? 'none').then( matchingVideo => {
      let before = of("0");
      if (!matchingVideo) {
        before = from(this.videoService.insert(this.formToVideo()));
      }
      before.subscribe(videoId => {
        this.loopService.insert(tmpLoop).then((id) => {
          tmpLoop.id = id;
          this._currentLoop = tmpLoop;
          this.loopEventService.pushEvent({from: PlayerEventFrom.APP, type: PlayerEventType.SELECT_LOOP, value: this.currentLoop});
        })
      });
    });
  }

  deleteLoop() {
    this.loopService.delete(this.formToLoop());
    if (this._currentLoop)
      this._currentLoop.id = undefined;
  }

  share() {
    let base64data : string = btoa(JSON.stringify(this.formToMinimalLoop()));
    let path = 'http://www.benjamin-barbe.fr/ylooper/loops/' + base64data;

    this.clipboard.copy(path);
  }

  private formToMinimalLoop(): any  {
    return [
      this.playerService.getVideoIdFromURL(this.form.controls['url'].value) ?? undefined,
      this.form.controls['name'].value,
      this.formatedMinutesToSeconds(this.form.controls['beginSec'].value)!,
      this.formatedMinutesToSeconds(this.form.controls['endSec'].value)!,
      this.form.controls['playbackSpeed'].value,
      +this.form.controls['loop'].value,
    ];
  }

  private formToLoop(): Loop {
    return {
      id: this._currentLoop.id,
      videoId: this.playerService.getVideoIdFromURL(this.form.controls['url'].value) ?? '',
      name: this.form.controls['name'].value,
      beginSec: this.formatedMinutesToSeconds(this.form.controls['beginSec'].value),
      endSec: this.formatedMinutesToSeconds(this.form.controls['endSec'].value),
      playbackSpeed: this.form.controls['playbackSpeed'].value,
      loop: this.form.controls['loop'].value
    }
  }

  private formToVideo(): Video {
    return {
      ytId: this.playerService.getVideoIdFromURL(this.form.controls['url'].value) ?? '',
      name: this.videoData.title,
    }
  }

  private secondsToFormatedMinutes(seconds: number): string {
    let minutes: number = Math.floor(seconds / 60);
    let remainingSec: string = (seconds % 60).toString().padStart(2, '0s');

    return `${minutes}:${remainingSec}`
  }

  private formatedMinutesToSeconds(formattedMinutes: string): number | undefined {
    let regex = new RegExp('([0-9]+):([0-9]{2})');
    let matches = formattedMinutes.match(regex);

    if (matches) {
      return parseInt(matches[1]) * 60 + parseInt(matches[2]);
    }

    return undefined;
  }
}
