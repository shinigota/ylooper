import {Loop, Video} from "@/global/models/db";

export interface MenuVideo {
  id: number;
  video: Video;

}

export interface MenuLoop {
  id: number;
  loop: Loop;
}

export interface VideoLoop {
  video: Video,
  loop: Loop
}
