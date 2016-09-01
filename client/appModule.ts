import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './components/appComponent';
import { JobListComponent } from './components/jobListComponent';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        JobListComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
