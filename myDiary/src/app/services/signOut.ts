import {Injectable} from '@angular/core';
import { AuthService } from './auth';

@Injectable()
export class SignOut {
	 
	constructor(
		private auth: AuthService 
		){
			this.auth.signout();
		}
};