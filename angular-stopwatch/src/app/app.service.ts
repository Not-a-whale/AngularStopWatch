import { Injectable, ElementRef } from '@angular/core';
import { Subject, pipe, Observable, Subscription, interval } from 'rxjs';
import { map } from 'rxjs/operators';

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

  clickWaitCount = 0;
  customIntervalObservable = Observable.create((observer) => {
    let count = this.deg;
    if (this.isWaiting) {
      count = this.ss + this.deg;
    }
    setInterval(() => {
      observer.next(count);
      count = this.ss + this.deg;
    }, 1000);
  });
  // subscription for interval observable
  intervalSubscription: Subscription;

  customTimeoutObservable = Observable.create((observer) => {
    setTimeout(() => {
      observer.next(0);
    }, 300);
  });
  timeoutSubscription: Subscription;

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

  waitClock() {
    if (this.isStarted) {
      this.clickWaitCount++;
      this.timeoutSubscription = this.customTimeoutObservable.subscribe(
        (nul) => {
          this.clickWaitCount = nul;
          this.timeoutSubscription.unsubscribe();
        }
      );
    }
    if (this.clickWaitCount >= 2) {
      this.stopWatch(false);
      this.isStarted = false;
      this.hasPaused = true;
      this.isWaiting = true;
    }
  }
}
