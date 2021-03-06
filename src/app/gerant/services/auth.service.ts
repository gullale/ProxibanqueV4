
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/of';
import { Gerant } from '../gerant';




@Injectable()
export class AuthService {
  private userObs = new ReplaySubject<Gerant>(1);
  private isLoggedInObs = new ReplaySubject<boolean>(1);

  constructor(@Inject(DOCUMENT) private document) {
    this.checkCurrentUser();
  }

  getCurrentUser(): Observable<Gerant> {
    return this.userObs.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInObs.asObservable();
  }

  /**
   * Check if we already have a current user (cookie).
   */
  checkCurrentUser() {
    let user;
    const userCookie = this.getCookie('user');
    if (userCookie) {
      const userData2 = JSON.parse(userCookie);
      user = new Gerant(userData2);
    }
    this.userObs.next(user);
    this.isLoggedInObs.next(!!user);
  }

  signIn(): Observable<Gerant> {
    // const userData2= {login: 'bobo', password: '12345'}
    const userData2= {id:1, nom:'bob', prenom:'dudu',login: 'bobo', password: '12345'};
    this.setCookie('user', JSON.stringify(userData2));
    this.checkCurrentUser();
    return Observable.of(new Gerant(userData2));
  }

  signOut(): Observable<any> {
    // console.log('deleteCookie');
    this.deleteCookie('user');
    this.checkCurrentUser();
    return Observable.of(undefined);
  }

  //
  // Private methods
  //

  private setCookie(name: string, value: string) {
    this.document.cookie = `${name}=${value}`;
  }

  /**
   * Quick & dirty way to extract a specific cookie
   * from the cookie string.
   *
   * Cookie string format: "name=Vince; foo=bar"
   */
  private getCookie(name: string = ''): string {
    const allCookiesString = this.document.cookie;
    const index1 = allCookiesString.indexOf(name);
    if (index1 !== -1) {
      let index2 = allCookiesString.indexOf(';', index1);
      index2 = index2 === -1 ? allCookiesString.length : index2;
      const cookieString = allCookiesString.slice(index1, index2);
      return cookieString.split('=')[1];
    }
  }

  deleteCookie(name: string) {
    this.document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
