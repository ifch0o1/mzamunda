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
  @Output() queryChange = new EventEmitter<string>();

  search(q: string): void {
    this.queryChange.emit(q);
  }

  onSubmit(form: NgForm) {
    // console.log(form);
  }


  constructor(private torrentService: TorrentService) { }

  ngOnInit() {
  }

}
