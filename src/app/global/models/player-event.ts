export enum PlayerEventType {
  RESTART,
  PLAY_PAUSE,
  INC_PLAYBACK_SPEED,
  DEC_PLAYBACK_SPEED,
  FWD_SEEK,
  BWD_SEEK,
  TGL_LOOP,
  MUTE,
  INC_VOL,
  DEC_VOL,
  CUSTOM,
  LOAD_LOOP,
  SELECT_LOOP
}

export enum PlayerEventFrom {
  APP,
  USER
}

export interface PlayerEvent {
  type: PlayerEventType;
  from: PlayerEventFrom;
  value?: PartialLoop;
}

export interface PartialLoop {
  id?: number;
  videoId?: string;
  name?: string;
  beginSec?: number;
  endSec?: number;
  playbackSpeed?: number;
  loop?: boolean;
}
