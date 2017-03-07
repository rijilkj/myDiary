import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import {RequestOptions, Request, RequestMethod, URLSearchParams} from '@angular/http';

@Injectable()
export class ApiService{
	
	headers: Headers = new Headers({
            'content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
            Accept : 'application/json',

	});

	api_url: string = "http://172.31.28.183:3000/api";
	auth_url: string= "http://172.31.28.183:3000/api";

	constructor (private http: Http) {

	}

	private getJson (resp: Response) {
 
	   return resp.json();
	}

	private checkForError (resp: Response) : Response {

	    if (resp.status >=200 && resp.status <300 ){

	    	return resp;
	    }else{

	    	const error = new Error(resp.statusText);
	    	error['response'] = resp;
	    	console.error(error);
	    	throw error;
	    }
	}

	get (path: string ): Observable <any> {

		return this.http.get(`${this.api_url}${path}`, this.headers)
		 .map(this.checkForError)
		 .catch(err => Observable.throw(err))
		 .map(this.getJson);
	}
 
	post (path: string, body): Observable <any> {

		let opts: RequestOptions = new RequestOptions();
		opts.method = RequestMethod.Post;
		opts.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });

	    return this.http.post(`${this.api_url}${path}`,  body, opts)
		.map(this.checkForError)
		 .catch(err => Observable.throw(err))
		 .map(this.getJson);
	}

	authPost (path: string, body): Observable <any> {

		let urlSearchParams = new URLSearchParams();
		urlSearchParams.append('email', body.email);
		urlSearchParams.append('password', body.password);
		let params = urlSearchParams.toString();

		let opts: RequestOptions = new RequestOptions();
		opts.method = RequestMethod.Post;
		opts.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });

		return this.http.post(`${this.auth_url}${path}`, params, opts)
		.map(this.checkForError)
		 .catch(err => Observable.throw(err))
		 .map(this.getJson);
	}
	
	authPostTest (path: string, body): Observable <any> {

               return this.http.post(`${this.auth_url}${path}`,  JSON.stringify(body),this.headers)
                .map(this.checkForError)
                 .catch(err => Observable.throw(err))
                 .map(this.getJson);
        }

	delete (path: string ): Observable <any> {

		return this.http.delete(`${this.api_url}${path}`, this.headers)
		 .map(this.checkForError)
		 .catch(err => Observable.throw(err))
		 .map(this.getJson);
	}

	setHeaders (headers) {

		Object.keys(headers)
		.forEach(header => this.headers.set(header, headers[header]));
	}

}	
