import {Injectable} from '@angular/core';
import {from, Observable} from "rxjs";
import {db, Video} from "@/global/models";

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  constructor() { }

  findById(id: string) {
    return db.videos.get(id);
  }

  insert(video: Video)  {
    return db.videos.add(video);
  }

  update(video: Video) {
    db.videos.update(video.ytId, video);
  }

  delete(video: Video) {
    db.videos.delete(video.ytId);
  }
}
