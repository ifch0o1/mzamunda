import { Component, OnInit, ViewChild } from '@angular/core';
import { TorrentService } from '../torrent.service';
import { AuthService } from '../auth.service';
import { TorrentModel } from '../torrent-model'
import { PageEvent } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';


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
  loadingTorrentDescription: boolean = false;
  torrents: TorrentModel[];
  pagination: Pagination;
  torrentsCountPerPage: number = 50;
  searchQuery: string;
  selectedTorrent: TorrentModel;
  private nowLoading = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;

  showTorrents(torrents: TorrentModel[], pagination?: Pagination): void {
  	this.torrents = torrents;
    if (pagination && pagination.pagesCount) {
      this.pagination = pagination;
    } else {
      this.pagination = {pagesCount: 0, torrentsCount: 0};
    }
    this.loadingTorrents = false;
  }

  onPageChange($event: PageEvent):void {
    this.nowLoading = 'page'+($event.pageIndex + 1);
    this.torrents = [];
    this.loadingTorrents = true;
    this.torrentService.search(this.searchQuery, $event.pageIndex + 1).subscribe(data => {
      if (this.nowLoading != 'page'+($event.pageIndex + 1)) return;
      this.loadingTorrents = false;
      this.showTorrents(data.torrents);
      this.pagination = data.pagination;
    });
  }

  onTorrentSelected(torrent: TorrentModel) {
    this.loadingTorrentDescription = true;
    this.torrentService.getTorrentDetails(torrent.url).subscribe(
      (torrentDetails) => {
        console.log(torrentDetails);
        this.selectedTorrent = torrentDetails;
        this.loadingTorrentDescription = false;
      },
      (error) => {
        console.log(error);
        this.loadingTorrentDescription = false;
      }
    );
  }

  showRecommended(): void {
    this.nowLoading = 'recomended';
  	this.torrentService.getRecommended().subscribe(torrents => {
      if (this.nowLoading != 'recomended') return;
      this.showTorrents(torrents);
  	});
  }

  onQueryChange(q) {
    this.nowLoading = "query:" + q;
    this.torrents = [];
    this.loadingTorrents = true;
    this.searchQuery = q;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.torrentService.search(q, 1).subscribe(data => {
      if (this.nowLoading != ("query:" + q)) return;
      this.showTorrents(data.torrents, data.pagination);
    });
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
