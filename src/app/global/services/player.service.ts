import {Injectable} from '@angular/core';
import {Loop, PlayerEventType, Video, VideoData} from "@/global/models";
import {BehaviorSubject, Observable} from "rxjs";
import {VideoLoop} from "@/global/models/menu.model";
import {PlayerEventService} from "@/global/services/player-event.service";
import {DUMMY_LOOP, DUMMY_VIDEO} from "@/global/const/loop.const";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private YT_UNSTARTED = -1;
  private YT_ENDED = 0;
  private YT_PLAYING = 1;
  private YT_PAUSED = 2;
  private YT_BUFFERING = 3;
  private YT_VIDEO_CUED = 5;

  private player: any = undefined;
  private currentLoop: Loop = DUMMY_LOOP;
  private currentVideo: Video = DUMMY_VIDEO;

  private _playerState : number = this.YT_UNSTARTED;

  private _videoData : VideoData = {
    isPlaying: false,
    title: 'Foo'
  }
  private _observableVideoData = new BehaviorSubject<VideoData>(this._videoData);

  get videoData$(): Observable<VideoData> {
    return this._observableVideoData.asObservable();
  }
  private set videoData(videoData: VideoData) {
    this._videoData = videoData;
    this._observableVideoData.next(videoData);
  }
  private _playerReady: boolean = false;
  private playerReadyObservable = new BehaviorSubject<boolean>(this._playerReady);
  get playerReady$(): Observable<boolean> {
    return this.playerReadyObservable.asObservable();
  }
  constructor(private playerEventService : PlayerEventService) {
    setInterval(() => this.checkTimestamp(), 100);
    this.playerEventService.event$.subscribe( e => this.bindPlayerEvents(e));
  }

  private checkTimestamp() {
    if (this._playerReady && this.YT_VIDEO_CUED !== this._playerState && this.currentLoop?.loop) {
      let currentTime : number = this.player.getCurrentTime();
      if (currentTime >= (this.currentLoop?.endSec ?? this.player.getDuration())
        || currentTime < (this.currentLoop?.beginSec ?? 0)) {
        this.player.seekTo(this.currentLoop?.beginSec ?? 0);
      }
    }
  }

  private bindPlayerEvents(e : PlayerEventType) {
    switch (e) {
      case PlayerEventType.RESTART:
        this.toStart();
        break;
      case PlayerEventType.PLAY_PAUSE:
        this.togglePlayResume();
        break;
      case PlayerEventType.INC_PLAYBACK_SPEED:
        break;
      case PlayerEventType.DEC_PLAYBACK_SPEED:
        break;
      case PlayerEventType.FWD_SEEK:
        break;
      case PlayerEventType.BWD_SEEK:
        break
      case PlayerEventType.TGL_LOOP:
        console.log("BEFORE" + this.currentLoop.loop)
        this.currentLoop.loop = !this.currentLoop.loop;
        console.log("AFTER" + this.currentLoop.loop)
        break;
      case PlayerEventType.MUTE:
        break;
      case PlayerEventType.INC_VOL:
        break;
      case PlayerEventType.DEC_VOL:
        break;
    }
  }
  private initPlayer() {
    let tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    (window as any)['onYouTubeIframeAPIReady'] = () => {
      this.player = new (window as any)['YT'].Player('player', {
        height: '100%',
        width: '100%',
        videoId: this.currentVideo?.ytId,
        playerVars: {
          rel: 0
        },
        events: {
          'onReady': this.onPlayerReady.bind(this),
          'onStateChange': this.onPlayerStateChange.bind(this)
        }
      });
    };
  }

  public loadVideoLoop(videoLoop: VideoLoop) {
    let previousYtId = this.currentVideo?.ytId;
    this.currentLoop = videoLoop.loop;
    this.currentVideo = videoLoop.video;


    if (!this.player) {
      this.initPlayer();
    } else {
      if (previousYtId !== videoLoop.video.ytId) {
        this.player.cueVideoById({
          'videoId': videoLoop.video.ytId,
          'startSec': videoLoop.loop.loop ? videoLoop.loop.beginSec : undefined
        });
      } else {
        if (videoLoop.loop.loop) {
          this.player.seekTo(videoLoop.loop.beginSec ?? 0);
        }
        this.player.setPlaybackRate(videoLoop.loop.playbackSpeed ?? 1);
      }
    }
  }

  private onPlayerReady(event: any) {
    this._playerReady = true;
    this.playerReadyObservable.next(this._playerReady);
  }

  private onPlayerStateChange(event: any) {
    this._playerState = event.data;
    this.videoData = {
      isPlaying: this._playerState === this.YT_PLAYING,
      title: this.player.getVideoData().title
    }
    if (this._playerState === this.YT_UNSTARTED) {
      this.player.setPlaybackRate(this.currentLoop?.playbackSpeed ?? 1);
    }
  }

  public toStart() {
    if (this.currentLoop?.loop) {
      this.player.seekTo(this.currentLoop?.beginSec ?? 0);
    } else {
      this.player.seekTo(0);
    }
  }

  public setStartSec(startSec: number) {
    this.currentLoop!.beginSec = startSec;
  }

  public setEndSec(endSec: number) {
    this.currentLoop!.endSec = endSec;
  }

  public setLoop(loopState: boolean) {
    this.currentLoop!.loop = loopState;
  }

  public setPlaybackRate(playbackSpeed: number) {
    this.currentLoop!.playbackSpeed = playbackSpeed;
    this.player.setPlaybackRate(playbackSpeed);
  }

  public togglePlayResume() {
    if (this._videoData.isPlaying) {
      this.player?.pauseVideo();
    } else {
      this.player?.playVideo();
    }
  }

  public getVideoIdFromURL(url: String) : string | undefined {
    let idExtractor = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    let match = url.match(idExtractor);
    let videoId = (match&&match[1].length==11)? match[1] : undefined;

    return videoId;
  }
}
