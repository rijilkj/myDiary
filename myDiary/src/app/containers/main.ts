import { Component } from '@angular/core';
import { AuthService } from '../services';

@Component({
	
	selector: 'main-container',
	templateUrl: 'app/containers/main/template.html',
  	styleUrls: ['app/containers/main/styles.css']
})


export class Main {
	 
	 userName:string;

	 constructor(
			private auth: AuthService 
		){
			this.userName= window.localStorage.getItem(this.auth.USER);
		 }

};
