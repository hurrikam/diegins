import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent, JobListComponent, JobListItemComponent, JobInstanceGridComponent, JobInstanceGridItemComponent } from './components';
import { JobStatusPipe } from './pipes/jobStatusPipe';

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
        JobStatusPipe
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
