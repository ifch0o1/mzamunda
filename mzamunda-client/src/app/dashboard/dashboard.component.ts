import { Component, OnInit } from '@angular/core';
import { TorrentService } from '../torrent.service';
import { AuthService } from '../auth.service';
import { TorrentModel } from '../torrent-model'
import {PageEvent} from '@angular/material';


// import { map } from 'rxjs/operators';

interface Pagination {
  pagesCount: number,
  torrentsCount: number
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent {
	loadingTorrents: boolean = false;
  torrents: TorrentModel[];
  pagination: Pagination;
  searchQuery: string;
  selectedTorrent: TorrentModel;


  showTorrents(torrents: TorrentModel[], pagination?: Pagination): void {
  	this.torrents = torrents;
    if (pagination && pagination.pagesCount) {
      this.pagination = pagination;
    } else {
      this.pagination = {pagesCount: 0, torrentsCount: 0};
    }
  }

  onPageChange($event: PageEvent):void {
    this.torrents = [];
    this.loadingTorrents = true;
    this.torrentService.search(this.searchQuery, $event.pageIndex).subscribe(data => {
      this.loadingTorrents = false;
      this.showTorrents(data.torrents);
      this.pagination = data.pagination;
    });
  }

  onTorrentSelected(torrent: TorrentModel) {
    this.torrentService.getTorrentDetails(torrent.url).subscribe(torrentDetails => {
      console.log(torrentDetails);
      this.selectedTorrent = torrentDetails;
    });
  }

  showRecommended(): void {
  	this.torrentService.getRecommended().subscribe(torrents => {
      this.loadingTorrents = false;
      this.showTorrents(torrents);
  	});
  }

  onQueryChange(q) {
    this.searchQuery = q;
  }

  constructor(private torrentService: TorrentService, 
              private auth: AuthService) {}

  ngOnInit() {
    this.pagination = this.pagination = {pagesCount: 0, torrentsCount: 0};
    this.loadingTorrents = true;
    let credentials = {username: "crazyshady", password: "zemitaqbomba"};
    if (!this.auth.isLoggedIn()) {
      this.auth.login(credentials).subscribe({
        next: data => {
          this.showRecommended();
        },
        error: err => {},
        complete: () => {}
      });
    } else {
      this.showRecommended();
    }
  }
}
