import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { rxjs/Rx };
import {ApiService} from './api';
import {Observable} from 'rxjs/Observable';
import {URLSearchParams} from '@angular/http';

 
@Injectable()
export class AuthService implements CanActivate {

        JWT_KEY :string = 'retain_tocken';
        JWT: string ='';
        USER:string="userName";
        constructor(
                private router: Router,
                private api: ApiService
        ) {
                const token = window.localStorage.getItem(this.JWT_KEY);

                if (token) {

                        this.setJwt(token,'');
                }
         }

        setJwt(jwt: string, user:string) {

                window.localStorage.setItem(this.JWT_KEY, jwt);
                if (user){
                	window.localStorage.setItem(this.USER, user);
                }
                this.api.setHeaders({Authorization: `Bearer ${jwt}`});
                this.JWT= window.localStorage.getItem(this.JWT_KEY);
        }

        isAuthorized(): boolean {

                return Boolean(this.JWT);
        }

        canActivate () : boolean {

                const canActivate = this.isAuthorized();
                this.onCanActivate(canActivate);
                return canActivate;
        }

        onCanActivate (canActivate: boolean) {

                if (!canActivate){

                        this.router.navigate(['', 'auth']);
                 } 
        }
        authenticate (path, credits): Observable <any> {
 
                return this.api.authPost(`${path}`, credits)
                .do((res: any) => this.setAuth(res))
                .map((res: any) => res);
        }
        
        signout () {
                  let token= window.localStorage.getItem(this.JWT_KEY);
                  let urlSearchParams = new URLSearchParams();
                  urlSearchParams.append('token', token); 
                  let params = urlSearchParams.toString();
                  let path= "/logOut";
                  window.localStorage.removeItem(this.JWT_KEY);
                  return this.api.post(path, params);

        }

        setAuth (res){
                if(res.status){
                        this.setJwt(res.token,res.data);
                }else{
                        this.JWT='';
                } 
                return res;
    }
}