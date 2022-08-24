import {Loop, Video} from '@/global/models/db';
//
// export let LOOPS: Loop[] = [
//   {
//     id: 1,
//     name: "Don't Damn Me",
//    // url: 'https://www.youtube.com/watch?v=odLKbomK6zk',
//     beginSec: 205,
//     endSec: 213,
//     loop: true,
//     playbackSpeed: 0.5,
//   },
//   {
//     id: 2,
//     name: "Nightrain",
//     //url: 'https://www.youtube.com/watch?v=xUQV6x0Hm2o',
//     beginSec: 0,
//     endSec: 5,
//     loop: true,
//     playbackSpeed: 1,
//   }
// ];
//
export const DUMMY_LOOP: Loop = {
  name: 'Awesome loop',
  beginSec: 4,
  endSec: 5,
  playbackSpeed: 0.75,
  loop: true,
  videoId: 'sDj72zqZakE'
};

export const DUMMY_VIDEO: Video = {
  name: 'Waffle falling over',
  ytId: 'sDj72zqZakE'
};
