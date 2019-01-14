import { Component, OnInit, Input } from '@angular/core';
import {TorrentModel} from '../torrent-model';
import { TorrentService } from '../torrent.service';
import { globals } from '../globals';
import * as $ from 'jquery';


@Component({
  selector: 'app-torrent-details',
  templateUrl: './torrent-details.component.html',
  styleUrls: ['./torrent-details.component.css']
})
export class TorrentDetailsComponent implements OnInit {
	private globals = globals;
	private downloading: boolean;
	@Input() torrent: any;

	close(): void {
		this.torrent = undefined;
		$('body').css('overflow', 'auto');
	}

	download(url): void {
		let that = this;
		that.downloading = true;
		this.torrentService.getTorrentDownloadUrl(url).subscribe(html => {
			// Remove all images from html to prevent jQuery to load them in the document.
			html = html.replace(/<img\b[^>]*>/ig, '');
			let downloadHtml = $(html);
			let downloadTorrentFileUrl = downloadHtml.find("#svalqneto_zapochva > a").attr('href');
			downloadTorrentFileUrl = globals.ZAMUNDA_HOST + "/" + downloadTorrentFileUrl;
			that.downloadFile(globals.SERVER_URL + "/api/get/file?url=" +downloadTorrentFileUrl);
			that.downloading = false;
		});
	}

	downloadFile(url: string, fileName?: string, extension?: string): void {
	    if (!fileName) fileName = 'torrentFile';
	    if (!extension) extension = 'torrent';

	    let link = document.createElement('a');
	    link.download = "";
	    link.href = url;
	    let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	    if (isChrome) {
	        link.click();
	    } else {
	        /**
	         * In firefox and some other browsers
	         * a.click not working well.
	         * clickEvent initialization is required.
	         */
	        let clickEvent = document.createEvent("MouseEvent");
	        clickEvent.initEvent("click", true, true);
	        link.dispatchEvent(clickEvent);
	    }
	}

  constructor(private torrentService: TorrentService) {}

  ngOnInit() {
  	
  }

}
