import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import  { KhachhangComponent } from './khachhang/khachhang.component';
import{TrangchuComponent} from './trangchu/trangchu.component'
import { ViewuserComponent } from './viewuser/viewuser.component';
import { ViewusergioithieuComponent} from './viewusergioithieu/viewusergioithieu.component';
import {ViewuserdatlichComponent} from './viewuserdatlich/viewuserdatlich.component';
import {DatlichComponent} from './datlich/datlich.component';
import {HoadonComponent} from './hoadon/hoadon.component'
import {DichVuComponent} from './dichvu/dichvu.component';

const routes: Routes = [
  { path: 'khach-hang', component: KhachhangComponent },
  { path: 'dat-lich', component: DatlichComponent },
  { path: 'hoa-don', component: HoadonComponent },
  { path: 'dich-vu', component: DichVuComponent },



  {
    path: '',
    component: ViewuserComponent,
    children: [
      { path: '', component: TrangchuComponent },  // Trang chủ
      { path: 'gioi-thieu', component: ViewusergioithieuComponent },
      { path: 'user-dat-lich', component: ViewuserdatlichComponent },

    ]
  },

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
