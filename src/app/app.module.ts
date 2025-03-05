import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Thêm dòng này
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrangchuComponent } from './trangchu/trangchu.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';



// Import Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FooterComponent } from './footer/footer.component';
import { KhachhangComponent } from './khachhang/khachhang.component';
import { ViewuserComponent } from './viewuser/viewuser.component';
import { ViewusergioithieuComponent } from './viewusergioithieu/viewusergioithieu.component';
import { ViewuserdatlichComponent } from './viewuserdatlich/viewuserdatlich.component';
import { DatlichComponent } from './datlich/datlich.component';
import { HoadonComponent } from './hoadon/hoadon.component';
import {DichVuComponent} from './dichvu/dichvu.component';

@NgModule({
  declarations: [
    AppComponent,
    TrangchuComponent,
    LoginComponent,
    MenuComponent,
    FooterComponent,
    KhachhangComponent,
    ViewuserComponent,
    ViewusergioithieuComponent,
    ViewuserdatlichComponent,
    DatlichComponent,
    HoadonComponent,
    DichVuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
