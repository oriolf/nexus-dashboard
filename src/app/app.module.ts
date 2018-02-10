import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing } from './app.routes';
import { AppComponent } from './app.component';

import { JsonSchemaFormModule, MaterialDesignFrameworkModule } from 'angular2-json-schema-form';
import { JSONEditorModule } from 'ngx-jsoneditor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatButtonModule,
  MatCardModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatDialogModule,
  MatSnackBarModule,
  MatTabsModule,
  MatSelectModule,
  MatExpansionModule,
  MatGridListModule,
  MatRadioModule,
  MatMenuModule
} from '@angular/material';

import { NexusService } from './services/nexus.service';
import { MacrosService } from './services/macros.service';
import { LoggedInGuard } from './guards/logged-in.guard';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/general/dashboard/dashboard.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserComponent } from './components/users/user/user.component';
import { UserCreateDialogComponent } from './components/users/user-create-dialog/user-create-dialog.component';
import { AreYouSureDialogComponent } from './components/shared/are-you-sure-dialog/are-you-sure-dialog.component';
import { NodesComponent } from './components/general/nodes/nodes.component';
import { KeysPipe } from './shared/keys.pipe';
import { SessionListComponent } from './components/users/session-list/session-list.component';
import { TopicsComponent } from './components/general/topics/topics.component';
import { SyncComponent } from './components/general/sync/sync.component';
import { ServicesComponent } from './components/services/services/services.component';
import { PushComponent } from './components/services/push/push.component';
import { TasksComponent } from './components/services/tasks/tasks.component';
import { PullComponent } from './components/services/pull/pull.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UserListComponent,
    UserComponent,
    UserCreateDialogComponent,
    AreYouSureDialogComponent,
    NodesComponent,
    KeysPipe,
    SessionListComponent,
    TopicsComponent,
    SyncComponent,
    ServicesComponent,
    PushComponent,
    TasksComponent,
    PullComponent
  ],
  entryComponents: [
    UserCreateDialogComponent,
    AreYouSureDialogComponent
  ],
  imports: [
    routing,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialDesignFrameworkModule,
    JsonSchemaFormModule.forRoot(MaterialDesignFrameworkModule),
    JSONEditorModule,
    FlexLayoutModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatSelectModule,
    MatExpansionModule,
    MatGridListModule,
    MatRadioModule,
    MatMenuModule
  ],
  providers: [
    LoggedInGuard,
    NexusService,
    MacrosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
