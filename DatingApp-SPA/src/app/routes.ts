import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-list/member-detail/member-detail.component';
import { MemberDetailedResolver } from './resolver/member-detail.resolver';
import { MemberListResolver } from './resolver/member-list.resolver';
import { MemberEditComponent } from './members/member-list/member-edit/member-edit.component';
import { MemberEditResolver } from './resolver/member-edit.resolver';
import { PreventUnsavedChages } from './_guards/prevent-unsaved-unchages';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    { path: '',
      runGuardsAndResolvers: 'always',
      canActivate: [AuthGuard],
      children: [
        { path: 'members', component: MemberListComponent,
        resolve: {users: MemberListResolver}},
        { path: 'members/:id', component: MemberDetailComponent,
              resolve: {user: MemberDetailedResolver}},
        { path: 'member/edit', component: MemberEditComponent,
              resolve: {user: MemberEditResolver}, canDeactivate: [PreventUnsavedChages]},
        { path: 'messages', component: MessagesComponent},
        { path: 'lists', component: ListsComponent},
      ]
    },
    //if the request didn't match, using wildcart to redirect home page 
    { path: '**', redirectTo: '', pathMatch: 'full'}
];
