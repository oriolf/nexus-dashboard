import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing } from './app.routes';
import { AppComponent } from './app.component';

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
  MatSnackBarModule
} from '@angular/material';

import { NexusService } from './services/nexus.service';
import { MacrosService } from './services/macros.service';
import { LoggedInGuard } from './guards/logged-in.guard';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserComponent } from './components/users/user/user.component';
import { UserCreateDialogComponent } from './components/users/user-create-dialog/user-create-dialog.component';
import { AreYouSureDialogComponent } from './components/shared/are-you-sure-dialog/are-you-sure-dialog.component';
import { NodesComponent } from './components/nodes/nodes.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UserListComponent,
    UserComponent,
    UserCreateDialogComponent,
    AreYouSureDialogComponent,
    NodesComponent
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
    MatSnackBarModule
  ],
  providers: [
    LoggedInGuard,
    NexusService,
    MacrosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
