import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent, JobListComponent, JobListItemComponent, JobInstanceGridComponent, JobInstanceGridItemComponent } from './components';

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
        JobInstanceGridItemComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
