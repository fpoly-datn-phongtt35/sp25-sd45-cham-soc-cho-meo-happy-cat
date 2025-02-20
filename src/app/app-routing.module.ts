import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import  { KhachhangComponent } from './khachhang/khachhang.component';


const routes: Routes = [
  { path: 'khach-hang', component: KhachhangComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
