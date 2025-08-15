import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateServiceService{
  private isOpenSubject = new BehaviorSubject<boolean>(true);
  isOpen$ = this.isOpenSubject.asObservable();

  private mobileBreakpoint = 768;

  constructor() {
    // Initialize with screen size check
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  toggle() {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  setState(isOpen: boolean) {
    this.isOpenSubject.next(isOpen);
  }

  private checkScreenSize() {
    if (window.innerWidth <= this.mobileBreakpoint) {
      this.isOpenSubject.next(false);
    }
  }
}
