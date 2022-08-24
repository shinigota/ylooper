import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {PlayerEventType} from "@/global/models";

@Injectable({
  providedIn: 'root'
})
export class PlayerEventService {
  private _eventSubject = new Subject<PlayerEventType>();

  set event(event : PlayerEventType) {
    this._eventSubject.next(event);
  }

  get event$() : Observable<PlayerEventType> {
    return this._eventSubject.asObservable();
  }

  constructor() { }
}
