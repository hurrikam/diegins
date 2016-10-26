import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent, JobListComponent, JobListItemComponent, JobInstanceGridComponent, JobInstanceGridItemComponent } from './components';
import { JobResultPipe } from './pipes/jobResultPipe';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        JobListComponent,
        JobListItemComponent,
        JobInstanceGridComponent,
        JobInstanceGridItemComponent,
        JobResultPipe
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
