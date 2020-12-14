import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { globals } from './globals';

@Injectable({
	providedIn: 'root'
})

export class AuthService {
	private globals = globals;
	private loginUrl = this.globals.SERVER_URL + "/api/auth/login";

	private increaseDate(date, months): Date {
		let increasedDate = date.setMonth(date.getMonth() + months);
		return new Date(increasedDate);
	}

	/**
	 * Login to zamunda.net
	 */
	login(credentials: { username: string, password: string }): Observable<boolean> {
		return new Observable(observer => {
			// Login is doing by GET request because
			// POST requests ignores credentails - and didn't save cookies.
			let loginGETurl = this.loginUrl
				+ '?username=' + credentials.username
				+ '&password=' + credentials.password;
			this.http.get(loginGETurl, { withCredentials: true }).subscribe(data => {
				observer.next(true);
				observer.complete();
			});
		});
	}

	/**
	 * Check login status
	 * 
	 * @return {Boolean} Boolean login status
	 */
	isLoggedIn(): boolean {
		if (!!this.cookieService.get('uid')) {
			return true;
		} else {
			return false;
		}
	}

	logout() {
		this.cookieService.deleteAll();
	}

	constructor(
		private cookieService: CookieService,
		private http: HttpClient
	) { }
}
