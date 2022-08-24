import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {db, Loop} from '../models/';

@Injectable({
  providedIn: 'root'
})
export class LoopsService {

  constructor() { }

  findById(id: number): Observable<Loop | undefined> {
    return from(db.loops.get(id));
    //return of(LOOPS.find(l => l.id == id));
  }

  findByVideoId(videoId: string) {
    return from(db.loops.where("videoId").equals(videoId).toArray());
  }

  insert(loop: Loop) : Observable<number> {
    loop.id = undefined;
    return from(db.loops.add(loop));
  }

  update(loop: Loop) {
    db.loops.update(loop.id!, loop);
  }

  delete(loop: Loop) {
    if (loop.id) {
      from(db.loops.delete(loop.id))
        .subscribe(() => {
          if (loop.videoId) {
            this.findByVideoId(loop.videoId).subscribe((loops) => {
              if (loops.length === 0) {
                db.videos.delete(loop.videoId!);
              }
            });
          }
        });
    }
    loop.id = undefined;
  }
}
