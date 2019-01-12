import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as $ from 'jquery';
import { globals } from './globals';
import { TorrentModel } from './torrent-model';


@Injectable({
	providedIn: 'root'
})
export class TorrentService {
	private globals = globals;

	private torrentDescriptionUrl = this.globals.SERVER_URL + '/api/torrent/description';
	private recomendedTorrentsUrl = this.globals.SERVER_URL + '/api/torrent/recommended';
	private torrentSearchUrl = this.globals.SERVER_URL + '/api/torrent/search';

	getRecommended(): Observable<TorrentModel[]> {
		return this.http.get<TorrentModel[]>(this.recomendedTorrentsUrl, {withCredentials: true});
	}

	search(str: string, page: number): Observable<any> {
    str = str === 'emptysearch' ? '' : str;
    str = encodeURIComponent(str);
    return this.http.post(this.torrentSearchUrl, {
        searchString: str,
        page: page - 1
    }, {withCredentials: true});
	}

	getTorrentDetails(torrentUrl: string): Observable<any> {
		return new Observable(observer => {
			this.getTorrentDetailsHTML(torrentUrl).subscribe(html => {
				observer.next(null);
				console.log(torrentUrl);
				let detailsObject = this.parseTorrentDetailsHTML(html, torrentUrl);
				if (detailsObject.error) {
					console.log("Torrent Details error: ", detailsObject.error);
				  observer.error();
				} else {
				  observer.next(detailsObject);
				}
				observer.complete();
			});
		});
	}

	getTorrentDownloadUrl(torrentGoDownloadUrl: string): Observable<any> {
			return this.http.get(torrentGoDownloadUrl, {
				withCredentials: true,
				responseType: 'text',
				headers: {
					"Accept": "application/x-bittorrent"
				}
			});
	}
	
	private getTorrentDetailsHTML(torrentUrl: string): Observable<any> {
		return this.http.get(this.globals.SERVER_URL + '/api/torrent/description', {
			params: {
				url: torrentUrl
			},
			withCredentials: true,
			responseType: 'text'
		});
	}

	private getTorrentName(html): string {
		const $HTML = $(html);
		return $HTML.find('h1').text();
	}

	private getTorrentGoDownloadUrl(html): string {
		if (!html) throw new ReferenceError('html is not defined');
		if ((html instanceof $) === false) {
		    html = html.replace(new RegExp('src=', 'g'), '_src=');
		    html = $(html);
		}
		let goDownloadUrl = html.find('a.index').first().attr('href');
		if (goDownloadUrl.indexOf('/') !== 0) {
		    goDownloadUrl = '/' + goDownloadUrl;
		}
		let downloadUrl = this.globals.ZAMUNDA_HOST + goDownloadUrl;
		return this.createGetFileLink(downloadUrl);
	}

	private createGetFileLink(url: string): string {
	    const encodedURL = encodeURIComponent(url);
	    const link = this.globals.SERVER_URL + '/api/get/file?url=' + encodedURL;
	    return link;
	}

	private extractSubtitlesUrls($description): string[] {
	    if (!$description) throw new ReferenceError('$description is not defined');
	    if (($description instanceof $) !== true) {
	        $description = $($description);
	    }
	    if ($description.next().length === 0) {
	        return []; // Optimization purpose.
	    }
	    const $subtitlesDiv = $description.next();
	    const $allAnchors = $subtitlesDiv.find('a');
	    const urls: string[] = [];
	    $allAnchors.each(function(i, el) {
	        const href = $(el).attr('href');
	        if (!href) return true; // continue
	        if (href.indexOf('http://subsunacs.net') !== -1 ||
	            href.indexOf('http://subs.sab.bz') !== -1 ||
	            href.indexOf('http://zamunda.net/getsubs.php/') !== -1) {
	            urls.push(href);
	        }
	    });
	    return urls;
	}

	private getImages($description): string[] { 
		let imageLinks: string[] = [];
		let $allImages = $description.find('img');
		let that = this;
		$allImages.each(function(i, el) {
			let $el = $(el);
			let src: string = $el.attr('_src');
			if (!src) return true; // continue;
			// Skip IMDb star images.
			if (src === 'http://zamunda.net/pic/fullr.png' ||
				src === 'http://zamunda.net/pic/blankr.png' ||
				src === 'http://zamunda.net/pic/halfr.png') {
					return true; // continue;
			}
			if (src === 'http://zamunda.net/pic/playicon.png') {
				return true; // continue;
			}
			if (src.indexOf('zamunda.net/pic/smilies') > -1) {
				return true; // continue
			}
			if (src.indexOf('zamunda.net/bitbucket/eng26x18.jpg') > -1) {
				return true; // continue
			}
			if (src.indexOf('zamunda.net/bitbucket/win%20look.jpg') > -1) {
				return true; // continue
			}
			imageLinks.push(that.createGetFileLink(src));
		});
		
		return imageLinks;
	}

	private getExternalLinks($description) {
		if (!$description) throw new ReferenceError('$description is not defined.');
		if (!($description instanceof $)) {
			$description = $($description);
		}

		let linksFoundAtIndexes: number[] = [];
		const imdbRegExp = new RegExp('imdb', 'i');
		const cinefishRegExp = new RegExp('cinefish', 'i');
		const descriptionHTMLs = $description.html().split('##');
		const externalLinks: any = {};
		let that = this;
		$.each(descriptionHTMLs, function(i: number, val) {
			const imdbLink = that.extractLink(val, imdbRegExp);
			if (imdbLink) {
				externalLinks.imdb = imdbLink;
				linksFoundAtIndexes.push(i);
				return true; // continue;
			}

			const cinefishLink = that.extractLink(val, cinefishRegExp);
			if (cinefishLink) {
				externalLinks.cinefish = cinefishLink;
				linksFoundAtIndexes.push(i);
				return true; // continue;
			}
		});

		return {
			links: externalLinks,
			foundAt: linksFoundAtIndexes
		};
	}

	private extractLink(html, regExp): string {
		if (html.search(regExp) > -1) {
			const $html = $(html);
			const $links = $html.find('a');
			if ($links.length === 1) {
				return $links.attr('href');
			}
			if ($links.length > 1) {
				let link: string;
				$links.each(function(i, val) {
					const href = val.getAttribute('href');
					if (href.indexOf('http://www.imdb.com/') > -1) {
						link = href;
						return false; // break;
					}
				});
				return link;
			}
		} else {
			return undefined;
		}
	}

	private parseDescriptionTextsAndLinks($description) {
    if (!$description) throw new ReferenceError('$description is not defined.');
    if (!($description instanceof $)) {
      $description = $($description);
    }
    const externalLinksResults = this.getExternalLinks($description);
    const links = externalLinksResults.links;
    const atIndexses = externalLinksResults.foundAt;
    const descriptionTexts = $description.text().split('##');
    for (let i = atIndexses.length - 1; i >= 0; i--) {
      // Cut the text while we found the external link.
      descriptionTexts.splice(atIndexses[i], 1);
    }
    return {
      externalLinks: links,
      descriptionTexts: descriptionTexts
    };
	}

	private parseTorrentDetailsHTML(html, url) {
    if (!html) throw new ReferenceError('html is not defined.');
    if (url.indexOf('decision(') > -1) {
      return {error: 'Този торрент не се поддържа.'};
    }

    const detailsObject: any = {};

    html = html.replace(new RegExp('src=', 'g'), '_src=');
    const $HTML = $(html);
    if ($HTML.find('form[name="login"]').length > 0) {
      return {error: 'Не може да достъпите този торент като гост.'};
    }

    detailsObject.name = this.getTorrentName($HTML);
    detailsObject.download = this.getTorrentGoDownloadUrl($HTML);

    const $description = $HTML.find('#description');
    const images = this.getImages($description);
    detailsObject.poster = images.shift();
    detailsObject.images = images;
    detailsObject.url = url;
    detailsObject.subtitles = this.extractSubtitlesUrls($description);
    const parsedTextsAndLinks = this.parseDescriptionTextsAndLinks($description);
    detailsObject.description = parsedTextsAndLinks.descriptionTexts;
    detailsObject.externalLinks = parsedTextsAndLinks.externalLinks;

    return detailsObject;
	}

  constructor(private http: HttpClient) { }

}
