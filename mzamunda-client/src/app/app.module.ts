import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule, MatListModule, MatGridListModule, 
  MatCardModule, MatMenuModule, MatFormFieldModule, MatToolbarModule,
  MatButtonModule, MatIconModule, 
  MatInputModule } from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FlexLayoutModule } from "@angular/flex-layout";
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';
import { TorrentListComponent } from './torrent-list/torrent-list.component';
import { HttpClientModule }    from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TorrentDetailsComponent } from './torrent-details/torrent-details.component';

import {MatPaginatorIntl} from '@angular/material';
class MatPaginatorIntlCro extends MatPaginatorIntl {
  itemsPerPageLabel: string = "Показани";
  lastPageLabel: string = "Последна страница";
  firstPageLabel: string = "Първа страница";
  nextPageLabel: string = "Следваща страница";
  previousPageLabel: string = "Предишна страница";
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    SearchComponent,
    TorrentListComponent,
    TorrentDetailsComponent
  ],
  imports: [
    // LayoutModule,
    FlexLayoutModule,
    MatToolbarModule, MatButtonModule, MatIconModule, 
    MatSidenavModule, MatListModule, MatGridListModule, MatCardModule,
    MatMenuModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule,
    MatPaginatorModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    CookieService,
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlCro
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
