import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { appService } from '../app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clock-view',
  templateUrl: './clock-view.component.html',
  styleUrls: ['./clock-view.component.scss'],
})
export class ClockViewComponent implements OnInit {
  // Getting DOM Elements
  @ViewChild('hr', { static: false }) hr: ElementRef;
  @ViewChild('mn', { static: false }) mn: ElementRef;
  @ViewChild('sc', { static: false }) sc: ElementRef;

  hoursChangedSub: Subscription;
  minutesChangedSub: Subscription;
  secondsChangedSub: Subscription;

  hours = 0;
  minutes = 0;
  seconds = 0;
  isStarted = false;

  rotate() {
    this.secondsChangedSub = this.appService.seconds.subscribe((seconds) => {
      this.seconds = seconds;
      this.sc.nativeElement.style.transform = `rotateZ(${this.seconds}deg)`;
    });
    this.minutesChangedSub = this.appService.minutes.subscribe((minutes) => {
      this.minutes = minutes;
      this.mn.nativeElement.style.transform = `rotateZ(${this.minutes}deg)`;
    });
    this.hoursChangedSub = this.appService.hours.subscribe((hours) => {
      this.hr.nativeElement.style.transform = `rotateZ(${this.hours}deg)`;
    });
  }

  onReset() {
    this.appService.resetClock();
    this.rotate();
  }

  onStartStop() {
    this.appService.startStopClock();
    this.rotate();
    this.isStarted = !this.isStarted;
  }

  onWait() {
    // this kinda violates DRY principle, but creating a whole other Subscription would've been even more cumbersome solution
    this.appService.waitClock();
    this.rotate();
    if (this.appService.clickWaitCount >= 2) {
      this.isStarted = false;
      console.log(this.isStarted);
    }
  }

  constructor(public appService: appService) {}

  ngOnInit(): void {}
}
