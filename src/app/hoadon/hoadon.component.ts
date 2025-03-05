import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hoadon',
  templateUrl: './hoadon.component.html',
  styleUrls: ['./hoadon.component.css']
})
export class HoadonComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api/hoa-don';
  hoaDonList: any[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 5;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadHoaDon();
  }
  loadHoaDon() {
    let url = `${this.apiUrl}/list?page=${this.currentPage}&size=${this.pageSize}`;



    this.http.get<any>(url)
      .subscribe(response => {
        this.hoaDonList = response.content;
        this.totalPages = response.totalPages;

        if (this.hoaDonList.length === 0 && this.currentPage > 0) {
          this.currentPage = 0;
          this.loadHoaDon();
        }
      });
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadHoaDon();
    }
  }
}
