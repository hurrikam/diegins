import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './components/appComponent';
import { JobListComponent } from './components/jobListComponent';
import { JobListItemComponent } from './components/jobListItemComponent';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        JobListComponent,
        JobListItemComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
