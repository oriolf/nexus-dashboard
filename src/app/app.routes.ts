import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInGuard } from './guards/logged-in.guard';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/general/dashboard/dashboard.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserComponent } from './components/users/user/user.component';
import { SessionListComponent } from './components/users/session-list/session-list.component';
import { NodesComponent } from './components/general/nodes/nodes.component';
import { TopicsComponent } from './components/general/topics/topics.component';
import { SyncComponent } from './components/general/sync/sync.component';
import { PullsComponent } from './components/services/pulls/pulls.component';
import { PushComponent } from './components/services/push/push.component';
import { ServicesComponent } from './components/services/services/services.component';

var appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },

    { path: 'dashboard', component: DashboardComponent, canActivate: [LoggedInGuard] },
    { path: 'nodes', component: NodesComponent, canActivate: [LoggedInGuard] },
    { path: 'topics', component: TopicsComponent, canActivate: [LoggedInGuard] },
    { path: 'sync', component: SyncComponent, canActivate: [LoggedInGuard] },

    { path: 'users', component: UserListComponent, canActivate: [LoggedInGuard] },
    { path: 'users/:name', component: UserComponent, canActivate: [LoggedInGuard] },
    { path: 'sessions', component: SessionListComponent, canActivate: [LoggedInGuard] },

    { path: 'pulls', component: PullsComponent, canActivate: [LoggedInGuard] },
    { path: 'push', component: PushComponent, canActivate: [LoggedInGuard] },
    { path: 'services', component: ServicesComponent, canActivate: [LoggedInGuard] },

    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);