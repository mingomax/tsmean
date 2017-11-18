import {Inject, Injectable} from '@angular/core';
import {User, UserWithoutId} from './user';
import {Observable} from 'rxjs/Observable';
import {WebUtils} from '@tsmean/utils';
import {Http} from '@angular/http';
import {ApiUrl} from './api-url';
import {NotifyService} from 'notify-angular';
import {LoginService} from './login.service';

import 'rxjs/add/observable/of';
import {ResourceService} from '../resource/resource.service';

@Injectable()
export class UserService {

  constructor(
    @Inject(ApiUrl) private apiUrl: string,
    private http: Http,
    private notifyService: NotifyService,
    private resourceService: ResourceService,
    private loginService: LoginService
  ) {}

  createUser(user: UserWithoutId, password: string): Observable<User> {
    const $data = this.http.post(this.usersApi, {
      user: user,
      password: password
    }).map(resp => resp.json().data);
    return $data.catch(this.handleError);
  }

  getUser(): Observable<User> {
    if (this.loginService.loggedIn()) {

      const fakeUser: User = {
        id: '1',
        email: 'hans@gmail.com',
        firstName: 'Hans',
        lastName: 'Mueller'
      };
      const fakeObservable = Observable.of(fakeUser);

      // const $data = this.http.get(WebUtils.urlJoin(this.apiUrl, 'user')).map(resp => resp.json().data);
      const $data = fakeObservable;

      return $data.catch(this.handleError);
    } else {
      throw new Error('cannot fetch user, since not logged in');
    }
  }

  getUserById(id: string): Observable<User> {
    return <Observable<User>>this.resourceService.getResource(id, 'users');
  }

  removeUser(id: string): Observable<void> {
    return this.resourceService.deleteResource(id, 'users');
  }

  updateUser(user: User): Observable<User> {
    return <Observable<User>>this.resourceService.updateResource(user, 'users');
  }


  private get usersApi(): string {
    return WebUtils.urlJoin(this.apiUrl, 'users');
  }

  private handleError(errorResp: any): Promise<any> {
    this.notifyService.error(errorResp.statusText);
    return Promise.reject(errorResp.statusText || errorResp);
  }

}
