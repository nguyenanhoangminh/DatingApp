import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule, BsDatepickerModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import {JwtModule} from '@auth0/angular-jwt';
import { FileUploadModule } from 'ng2-file-upload';


import { HttpClient } from 'selenium-webdriver/http';
import { NavComponent } from './nav/nav.component';
import { AuthService } from 'src/app/_service/auth.service';
import { HomeComponent } from './home/home.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptor, ErrorInterceptorProvider } from 'src/app/_service/error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { MemberCardComponent } from './members/member-list/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-list/member-detail/member-detail.component';
import { MemberDetailedResolver } from './resolver/member-detail.resolver';
import { MemberListResolver } from './resolver/member-list.resolver';
import { MemberEditComponent } from './members/member-list/member-edit/member-edit.component';
import { MemberEditResolver } from './resolver/member-edit.resolver';
import { PreventUnsavedChages } from './_guards/prevent-unsaved-unchages';
import { PhotoEditorComponent } from './members/member-list/photo-editor/photo-editor.component';

export function tokenGetter()
{
   return localStorage.getItem('token');
}
export class CustomHammerConfig extends HammerGestureConfig {
   overrides = {
      pinch: {enable: false},
      rotate: {enable: false}
   };
}
@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      ListsComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      PhotoEditorComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      BrowserAnimationsModule,
      NgxGalleryModule,
      RouterModule.forRoot(appRoutes),
      TabsModule.forRoot(),
      FileUploadModule,
      JwtModule.forRoot({
         config: {
            tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth']
         }
      })
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      MemberDetailedResolver,
      MemberListResolver,
      MemberEditResolver,
      PreventUnsavedChages,
      { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
