import {Injectable} from '@angular/core';
import {db, Loop, Video} from "@/global/models";

export interface Dump {version: number, data: {video: Video, loops: Loop[]}[]}

@Injectable({
  providedIn: 'root'
})
export class DexieDumpService {

  constructor() { }

  public async exportData() {
    const videos = await db.videos.toArray();
    const loops = await db.loops.toArray();

    let groupedData = videos.map(v => { return {
        video: v,
        loops: loops.filter(l => l.videoId === v.ytId)
      } });

    groupedData.forEach( vl => {
      vl.loops.forEach( l => {
        delete l.id;
      })
    });

    let dump : Dump = {
      version: db.verno,
      data: groupedData
    }

    return new Blob([JSON.stringify(dump)],{type: 'text/plain'});
  }

  public importData(dump : Dump) {
    dump.data.forEach( vl => {
      db.videos.add(vl.video);
      vl.loops.forEach( l => {
        db.loops.add(l);
      })
    })

  }
}
