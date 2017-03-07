import { Component ,
  		 Output,
         EventEmitter
       } from '@angular/core';
import { AuthService } from '../services';
import { CanActivate, Router } from '@angular/router';

@Component({
	
	selector: 'app-bar',
    templateUrl: 'app/ui/appBar/template.html',
    styleUrls: ['app/ui/appBar/styles.css']	 
})

export class AppBar{

logoPath:string = null;
signOutPath:string=null;
userName:string;
@Output() fireUserDetail = new EventEmitter();
constructor(
			private auth: AuthService ,
			private router: Router
		){
			this.logoPath = "app/images/logo.png";
			this.signOutPath = "app/images/power.png";
			this.userName= window.localStorage.getItem(this.auth.USER);
			this.fireUserDetail.emit(this.userName);
		}
 
		logout () {

		  this.auth.signout()
		  .subscribe(resp => {
                this.router.navigate(['', 'auth']);
		  });
		}
};