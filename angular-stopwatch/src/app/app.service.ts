import { Injectable } from '@angular/core';
import { Subject, pipe } from 'rxjs';
import { take, map } from 'rxjs/operators';

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
  clickWaitCount = 0;
  interval = null;
  /*     this.stopWatch();
    console.log(this.hh, this.mm, this.ss); */

  stopWatch() {
    this.ss = this.ss + this.deg;
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
  startStopClock() {
    if (!this.isStarted) {
      // Start stopwatch (by calling setInterval() function
      this.interval = setInterval(() => {
        this.stopWatch();
      }, 100);
      this.isStarted = true;
    } else {
      this.ss = 0;
      this.mm = 0;
      this.hh = 0;
      this.getHours(this.hh);
      this.getMinutes(this.mm);
      this.getSeconds(this.ss);
      window.clearInterval(this.interval);
      this.isStarted = false;
    }
  }

  resetClock() {
    this.ss = 0;
    this.mm = 0;
    this.hh = 0;
    this.getHours(this.hh);
    this.getMinutes(this.mm);
    this.getSeconds(this.ss);
    window.clearInterval(this.interval);
    this.interval = window.setInterval(() => {
      this.stopWatch();
    }, 1000);

    !this.isStarted;
  }

  waitClock() {
    this.clickWaitCount++;
    setTimeout(() => {
      this.clickWaitCount = 0;
    }, 300);
    if (this.clickWaitCount >= 2) {
      window.clearInterval(this.interval);
      this.isStarted = false;
    }
  }
}
