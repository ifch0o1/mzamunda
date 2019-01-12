import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TorrentModel } from '../torrent-model';
import { TorrentService } from '../torrent.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit { 
	@Output() filteredBySearchTorrents = new EventEmitter<TorrentModel[]>();
  @Output() queryChange = new EventEmitter<string>();

  search(q: string): void {
    this.torrentService.search(q, 1).subscribe(data => {
      this.filteredBySearchTorrents.emit(data);
    });
    this.queryChange.emit(q);
  }

  onSubmit(form: NgForm) {
    // console.log(form);
  }


  constructor(private torrentService: TorrentService) { }

  ngOnInit() {
  }

}
