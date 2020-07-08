import { Injectable, ElementRef } from '@angular/core';
import {
  Subject,
  pipe,
  Observable,
  Subscription,
  interval,
  fromEvent,
} from 'rxjs';
import {
  map,
  throttleTime,
  takeUntil,
  buffer,
  debounceTime,
  filter,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class appService {
  public hours = new Subject<number>();
  public minutes = new Subject<number>();
  public seconds = new Subject<number>();

  getHours(hours: number) {
    this.hours.next(hours);
  }

  getMinutes(minutes: number) {
    this.minutes.next(minutes);
  }

  getSeconds(seconds: number) {
    this.seconds.next(seconds);
  }

  deg = 6;
  hh = 0;
  mm = 0;
  ss = 0;

  isStarted = false;
  hasPaused = false;
  isWaiting = false;

  start$ = new Subject();

  doubleClick = new Subject<boolean>();

  clickWaitCount = 0;

  customIntervalObservable = interval(1000).pipe(
    takeUntil(this.doubleClick),
    map((value) => {
      return this.ss + this.deg;
    })
  );
  intervalSubscription: Subscription;

  stopWatch(isSubscribed) {
    if (isSubscribed) {
      this.intervalSubscription = this.customIntervalObservable.subscribe(
        (sec) => {
          this.ss = sec;
          this.getSeconds(this.ss);
          if (this.ss / (60 * this.deg) === 1) {
            this.ss = 0;
            this.mm = this.mm + 6;
            this.getMinutes(this.mm);

            if (this.mm / (60 * this.deg) === 1) {
              this.mm = 0;
              this.hh = this.hh + 6;
              this.getHours(this.hh);
            }
          }
        }
      );
    } else {
      this.intervalSubscription.unsubscribe();
    }
  }
  startStopClock() {
    if (this.isStarted === false) {
      // Start stopwatch (by calling setInterval() function
      this.stopWatch(true);
      this.isStarted = true;
      this.hasPaused = false;
    } else {
      this.ss = 0;
      this.mm = 0;
      this.hh = 0;
      this.getHours(this.hh);
      this.getMinutes(this.mm);
      this.getSeconds(this.ss);
      this.stopWatch(false);
      this.isStarted = false;
      this.hasPaused = true;
    }
  }

  resetClock() {
    if (this.hasPaused === false) {
      this.ss = 0;
      this.mm = 0;
      this.hh = 0;
      this.getHours(this.hh);
      this.getMinutes(this.mm);
      this.getSeconds(this.ss);
      this.stopWatch(false);
      this.stopWatch(true);
      !this.isStarted;
    }
  }

  waitClock(el: ElementRef) {
    if (this.isStarted) {
      const clicks$ = fromEvent(el.nativeElement, 'click');

      clicks$
        .pipe(
          buffer(clicks$.pipe(debounceTime(300))),
          map((list) => {
            return list.length;
          }),
          filter((x) => x === 2)
        )
        .subscribe(() => {
          this.stopWatch(false);
          this.isStarted = false;
          this.hasPaused = true;
          this.isWaiting = true;
          this.doubleClick.next();
        });
    }
  }
}
