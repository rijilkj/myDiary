import { Component } from '@angular/core';
import { AuthService } from '../services';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-container',
  templateUrl: 'app/containers/auth/template.html',
  styleUrls: ['app/containers/auth/styles.css']
}) 

export class Auth {
	
	user = {
		email: '',
		password: ''
	}

	error:string=null;
    
    validateLogin: boolean= true;
 
	mode: string = 'signin';
	linkText: string = 'Don\'t you have an account?';
	logoPath:string;
	constructor(
		private router: Router,
		private auth: AuthService 
		){
			 this.logoPath = "app/images/logo.png";
		}

	changeMode() {

		if (this.mode=== 'signin'){
			this.mode = 'signup';
			this.linkText = 'Already have an account?';
		}else{
			this.mode = 'signin';
			this.linkText = 'Don\'t you have an account?';

		}
	}

	authenticate () {
	alert("test");
        /*this.validateLogin=true;
        this.auth.authenticate(`/${this.mode}`, this.user)
		.do((res: any)=>this.isValid(res))
		.do((res: any)=>this.auth.setAuth(res))
		.subscribe((res)=>{
			this.auth.setAuth(res);
			this.router.navigate([''])});	*/
	}
	
    isValid (res){
                if(res.status){
                        this.validateLogin=true;
                } else{
                        this.validateLogin=false;
                        this.error=res.error;
                }
    }
}
 
