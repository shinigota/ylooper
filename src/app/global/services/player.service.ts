import {Injectable} from '@angular/core';
import {Loop, Video, VideoData} from "@/global/models";
import {BehaviorSubject, Observable} from "rxjs";
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
  private _currentVideo: Video = DUMMY_VIDEO;
  private _playerState : number = this.YT_UNSTARTED;

  private _videoData : VideoData = { isPlaying: false, title: 'Foo' };
  private _observableVideoData = new BehaviorSubject<VideoData>(this._videoData);

  private _playerReady: boolean = false;
  private playerReadyObservable = new BehaviorSubject<boolean>(this._playerReady);

  constructor() {
    setInterval(() => this.checkTimestamp(), 100);
  }

  get videoData$(): Observable<VideoData> {
    return this._observableVideoData.asObservable();
  }

  private set videoData(videoData: VideoData) {
    this._videoData = videoData;
    this._observableVideoData.next(videoData);
  }

  get playerReady$(): Observable<boolean> {
    return this.playerReadyObservable.asObservable();
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

  private initPlayer() {
    let tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    (window as any)['onYouTubeIframeAPIReady'] = () => {
      this.player = new (window as any)['YT'].Player('player', {
        height: '100%',
        width: '100%',
        videoId: this._currentVideo.ytId,
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

  private onPlayerReady(event: any) {
    console.log('ready');
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

  loadVideoLoop(loop: Loop) {
    let previousVideoId = this.currentLoop.videoId;
    this.currentLoop = loop;

    if (!this.player) {
      this.initPlayer();
    } else {
      if (previousVideoId !== loop.videoId) {
        this.player.cueVideoById({
          'videoId': loop.videoId,
          'startSec': loop.loop ? loop.beginSec : undefined
        });
      } else {
        if (loop.loop) {
          this.player.seekTo(loop.beginSec ?? 0);
        }
        this.player.setPlaybackRate(loop.playbackSpeed ?? 1);
      }
    }
  }

  seekTo(time: number) {
    this.player.seekTo(time);
  }

  getCurrentTime(): number {
    return this.player.getCurrentTime();
  }

  toStart() {
    if (this.currentLoop?.loop) {
      this.player.seekTo(this.currentLoop?.beginSec ?? 0);
    } else {
      this.player.seekTo(0);
    }
  }

  setStartSec(startSec: number) {
    this.currentLoop!.beginSec = startSec;
  }

  setEndSec(endSec: number) {
    this.currentLoop!.endSec = endSec;
  }

  setLoop(loopState: boolean) {
    this.currentLoop!.loop = loopState;
  }

  setPlaybackRate(playbackSpeed: number) {
    this.currentLoop!.playbackSpeed = playbackSpeed;
    this.player.setPlaybackRate(playbackSpeed);
  }

  togglePlayResume() {
    if (this._videoData.isPlaying) {
      this.player?.pauseVideo();
    } else {
      this.player?.playVideo();
    }
  }

  getVideoIdFromURL(url: String) : string | undefined {
    let idExtractor = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    let match = url.match(idExtractor);

    return (match&&match[1].length==11)? match[1] : undefined;
  }
}
