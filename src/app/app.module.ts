import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WordlistComponent } from './wordlist/wordlist.component';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import { LoginFormComponent } from './login-form/login-form.component';
import { JwtModule } from '@auth0/angular-jwt';
import { RegFormComponent } from './reg-form/reg-form.component';
import { AlertComponent } from './alert/alert.component';
import { WordFieldComponent } from './word-field/word-field.component';
import { SortingComponent } from './sorting/sorting.component';

@NgModule({
  declarations: [
    AppComponent,
    WordlistComponent,
    LoginFormComponent,
    RegFormComponent,
    AlertComponent,
    WordFieldComponent,
    SortingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        },
        whitelistedDomains: ['localhost:9090']
      }
    })
  ],
  providers: [AlertComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
