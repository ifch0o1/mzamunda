import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TorrentModel } from '../torrent-model';
import { TorrentTypeIcon } from "../torrent-type-icon";

@Component({
  selector: 'app-torrent-list',
  templateUrl: './torrent-list.component.html',
  styleUrls: ['./torrent-list.component.css']
})
export class TorrentListComponent implements OnInit {
	@Input() torrents: TorrentModel[];
	@Input() loading: boolean;
	@Output() torrentSelected = new EventEmitter<TorrentModel>();

	onTorrentClick(torrent: TorrentModel) {
		this.torrentSelected.emit(torrent);
	}

	types = (new TorrentTypeIcon).types;

  constructor() { }

  ngOnInit() {
  }

}
