import {Injectable} from '@angular/core';
import {BehaviorSubject, from} from "rxjs";
import {db, FlatLoop, Loop} from "@/global/models";
import {DUMMY_LOOP, DUMMY_VIDEO} from "@/global/const/loop.const";
import {VideoLoop} from "@/global/models/menu.model";
import {ActivatedRoute, ParamMap} from "@angular/router";

type SelectedFlatLoop = FlatLoop | undefined;

@Injectable({
  providedIn: 'root'
})
export class LoopMenuService {
  private _selectedVideoLoop : VideoLoop = {
    video: DUMMY_VIDEO,
    loop: DUMMY_LOOP
  };
  private _observableVideoLoop = new BehaviorSubject<VideoLoop | undefined>({
    video: DUMMY_VIDEO,
    loop: DUMMY_LOOP
  });

  constructor(private route: ActivatedRoute) {

    this.route.firstChild?.paramMap.subscribe((params: ParamMap) => {
      let loop : any  = JSON.parse(atob(params.get('loop')!));
      this._selectedVideoLoop = {
        video: {
          ytId: loop[0]
        },
        loop : {
          name: loop[1],
          playbackSpeed: loop[4],
          loop: !!loop[5],
          beginSec: loop[2],
          endSec: loop[3],
          videoId: loop[0]
        }
      };
      this._observableVideoLoop.next(this._selectedVideoLoop);

    });


  }
  get selectedVideoLoop$() {
    return this._observableVideoLoop.asObservable();
  }

  public async selectVideoLoop(loop: Loop) {
    if (loop.videoId) {
      let video = await db.videos.get(loop.videoId);
      this._selectedVideoLoop = {
        video: video!,
        loop: loop
      };
      this._observableVideoLoop.next(this._selectedVideoLoop);
    }
  }
}
