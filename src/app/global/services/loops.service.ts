import {Injectable} from '@angular/core';
import {db, Loop, Video} from '../models/';

@Injectable({
  providedIn: 'root'
})
export class LoopsService {

  constructor() { }

  findById(id: number) {
    return db.loops.get(id);
  }

  findByVideoId(videoId: string) {
    return db.loops.where("videoId").equals(videoId).toArray();
  }

  insert(loop: Loop) {
    loop.id = undefined;
    return db.loops.add(loop);
  }

  async update(video: Video, loop: Loop) {
    let existingVideo = await db.videos.get(loop.videoId);
    if(!existingVideo) {
      await db.videos.add(video);
    }
    await db.loops.update(loop.id!, loop);
  }

  async delete(loop: Loop) {
    if (loop.id) {
      await db.loops.delete(loop.id);

      let loops = await this.findByVideoId(loop.videoId)
      if (loops.length === 0) {
        await db.videos.delete(loop.videoId!);
      }
    }
    loop.id = undefined;
  }
}
