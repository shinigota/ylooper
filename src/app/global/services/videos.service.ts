import {Injectable} from '@angular/core';
import {from, Observable} from "rxjs";
import {db, Video} from "@/global/models";

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  constructor() { }

  findById(id: string): Observable<Video | undefined> {
    return from(db.videos.get(id));
  }

  findByUrl(url: string): Observable<Video | undefined> {
    return from(db.videos.where("url").equals(url).first());
  }

  insert(video: Video) : Observable<string> {
    return from(db.videos.add(video));
  }

  update(video: Video) {
    db.videos.update(video.ytId, video);
  }

  delete(video: Video) {
    db.videos.delete(video.ytId);
  }
}
