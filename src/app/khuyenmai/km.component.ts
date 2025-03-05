import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-khuyenmai',
  templateUrl: './km.component.html',
  styleUrls: ['./km.component.css']
})
export class kmComponent implements OnInit {
  private apiUrl = 'http://localhost:8080/api/khuyenmai';
  khuyenMais: any[] = [];
  searchMakm: string = ''; // Biến lưu mã khuyến mãi cần tìm
  ngayBatDau: string = ''; // Biến lưu ngày bắt đầu để lọc
  ngayKetThuc: string = ''; // Biến lưu ngày kết thúc để lọc
  isModalOpen = false;
  isDeleteModalOpen = false;
  isEditing = false;
  khuyenMaiForm: any = {};
  deleteMakm: string | null = null;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getKhuyenMai(0);
  }

  openModal(editing = false, km: any = null) {
    this.isEditing = editing;
    if (editing && km) {
      this.khuyenMaiForm = { ...km };
    } else {
      this.khuyenMaiForm = { makm: '', moTa: '', phanTramGiam: 0, ngayBatDau: '', ngayKetThuc: '', dieuKien: '' };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveKhuyenMai() {
    if (this.isEditing) {
      this.http.put(`${this.apiUrl}/${this.khuyenMaiForm.makm}`, this.khuyenMaiForm).subscribe(() => {
        this.getKhuyenMai(0);
        this.closeModal();
      });
    } else {
      this.http.post(this.apiUrl, this.khuyenMaiForm).subscribe(() => {
        this.getKhuyenMai(0);
        this.closeModal();
      });
    }
  }

  openDeleteModal(makm: string) {
    this.deleteMakm = makm;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  deleteKhuyenMai() {
    if (this.deleteMakm) {
      this.http.delete(`${this.apiUrl}/${this.deleteMakm}`).subscribe(() => {
        this.getKhuyenMai(0);
        this.closeDeleteModal();
      });
    }
  }
  searchKhuyenMai() {
    if (this.searchMakm && this.searchMakm.trim() !== '') {
      this.http.get<any[]>(`${this.apiUrl}/search`, { params: { makm: this.searchMakm } }).subscribe(
        (data) => { this.khuyenMais = data; },
        (error) => { console.error('Lỗi khi tìm kiếm:', error); }
      );
    } else {
      this.getKhuyenMai(0); // Nếu rỗng, load lại toàn bộ danh sách
    }
  }
  

  // 🟡 Lọc theo ngày bắt đầu và ngày kết thúc
  filterKhuyenMai() {
    let params: any = {};
    if (this.ngayBatDau) params.ngayBatDau = this.formatDate(this.ngayBatDau);
    if (this.ngayKetThuc) params.ngayKetThuc = this.formatDate(this.ngayKetThuc);
  
    this.http.get<any[]>(`${this.apiUrl}/filter`, { params }).subscribe(
      (data) => { this.khuyenMais = data; },
      (error) => { console.error('Lỗi khi lọc:', error); }
    );
  }
  
  formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0]; // Chuyển về định dạng yyyy-MM-dd
  }

  getKhuyenMai(page: number) {
    this.http.get<any>(`${this.apiUrl}?page=${page}&size=${this.pageSize}`).subscribe(
      (response) => {
        this.khuyenMais = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách khuyến mãi:', error);
      }
    );
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.getKhuyenMai(page);
    }
  }
  
}
