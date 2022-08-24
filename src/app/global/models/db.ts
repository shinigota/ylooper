import Dexie, {Table} from "dexie";

export interface Loop {
  id?: number;
  videoId: string;
  name: string;
  //url: string;
  beginSec?: number;
  endSec?: number;
  playbackSpeed: number;
  loop: boolean;
}

export interface Video {
  ytId: string;
  name?: string;
}

export interface Folder {
  id?: number;
  parentFolderId?: number;
  name: string;
}

export class AppDB extends Dexie {
  loops!: Table<Loop, number>;
  videos!: Table<Video, string>;

  constructor() {
    super('ylooperDexieDatabase');
    this.version(1).stores({
      videos: 'ytId',
      loops: '++id, videoId',
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    const demoVideoId = await db.videos.add({
      name: 'Waffle falling over',
      //url: 'https://www.youtube.com/watch?v=sDj72zqZakE',
      ytId: 'sDj72zqZakE'
    });
    await db.loops.add({
      name: 'Funny loop',
      beginSec: 4,
      endSec: 5,
      playbackSpeed: 0.75,
      loop: true,
      videoId: 'sDj72zqZakE'
    });
  }
}

export const db = new AppDB();
