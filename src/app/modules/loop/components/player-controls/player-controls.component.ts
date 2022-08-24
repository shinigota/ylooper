import {Component} from '@angular/core';
import {LoopMenuService} from "@/global/services/loop-menu.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, of} from "rxjs";
import {PlayerService} from "@/global/services/player.service";
import {LoopsService} from "@/global/services/loops.service";
import {db, Loop, Video, VideoData} from "@/global/models";
import {VideosService} from "@/global/services/videos.service";
import {DUMMY_LOOP, DUMMY_VIDEO} from "@/global/const/loop.const";
import {VideoLoop} from "@/global/models/menu.model";
import {Clipboard} from '@angular/cdk/clipboard';
import {YOUTUBE_URL} from "@/global/const/app.const";


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
  private _currentVideo: Video = DUMMY_VIDEO;

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

  constructor(private loopMenuService: LoopMenuService,
              private playerService: PlayerService,
              private loopService: LoopsService,
              private videoService: VideosService,
              private clipboard: Clipboard) {

    this.playerService.videoData$.subscribe((videoData) => {
      this.videoData = videoData
    });

    this.loopMenuService.selectedVideoLoop$.subscribe((videoLoop) => {
      if (typeof videoLoop === undefined)
        return;
      this.initFromVideoLoop(videoLoop as VideoLoop);
    });

    this.form.controls['url'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      this.playerService.loadVideoLoop(this.formToVideoLoop());
    });

    this.form.controls['beginSec'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      this.playerService.setStartSec(this.formatedMinutesToSeconds(value) as number);
    });

    this.form.controls['endSec'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      this.playerService.setEndSec(this.formatedMinutesToSeconds(value) as number);
    });

    this.form.controls['playbackSpeed'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.playerService.setPlaybackRate(value);
    });

    this.form.controls['loop'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.playerService.setLoop(value);
    });
  }

  private initFromVideoLoop(videoLoop: VideoLoop) {
    this._currentLoop = videoLoop?.loop as Loop;
    this._currentVideo = videoLoop?.video as Video;
    this.form.controls['name'].setValue(this._currentLoop.name, {emitEvent: false});
    this.form.controls['url'].setValue(`${YOUTUBE_URL}${this._currentVideo.ytId}`, {emitEvent: false});
    this.form.controls['loop'].setValue(this._currentLoop.loop, {emitEvent: false});
    if (typeof (this._currentLoop.beginSec) !== undefined) {
      this.form.controls['beginSec'].setValue(this.secondsToFormatedMinutes(this._currentLoop.beginSec as number), {emitEvent: false});
    } else {
      this.form.controls['beginSec'].setValue('', {emitEvent: false});
    }
    if (typeof (this._currentLoop.endSec) !== undefined) {
      this.form.controls['endSec'].setValue(this.secondsToFormatedMinutes(this._currentLoop.endSec as number), {emitEvent: false});
    } else {
      this.form.controls['endSec'].setValue('', {emitEvent: false});
    }
    this.form.controls['playbackSpeed'].setValue(this._currentLoop.playbackSpeed, {emitEvent: false});
  }

  togglePlayPause() {
    this.playerService.togglePlayResume();
  }

  updateLoop() {
    this.loopService.update(this.formToLoop());
  }

  saveLoopAsNew() {
    let tmpLoop = this.formToLoop();
    tmpLoop.id = undefined;

    db.videos.get(this.playerService.getVideoIdFromURL(this.form.controls['url'].value) ?? 'none').then( matchingVideo => {
      let before = of("0");
      if (!matchingVideo) {
        before = this.videoService.insert(this.formToVideo());
      }
      before.subscribe(videoId => {
        this.loopService.insert(tmpLoop).subscribe((id) => {
          tmpLoop.id = id;
          this._currentLoop = tmpLoop;
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

  private formToVideoLoop(): VideoLoop {
    return {
      video: this.formToVideo() ,
      loop: this.formToLoop()
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
