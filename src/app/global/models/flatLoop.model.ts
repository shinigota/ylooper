export interface FlatLoop {
  id?: number;
  videoId?: number;
  name: string;
  url: string;
  beginSec: number;
  endSec: number;
  playbackSpeed: number;
  loop: boolean;
  videoName: string;
}
