import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient để gọi API
// import { Router } from '@angular/router';

@Component({
  selector: 'app-dichvu',
  templateUrl: './dichvu.component.html',
  styleUrls: ['./dichvu.component.css']
})
export class DichVuComponent implements OnInit {

  private apiUrl = 'http://localhost:8080/api/dich-vu-chi-tiet';
  private apiLoaiDichVuUrl = 'http://localhost:8080/api/loai-dich-vu';
  searchTerm: string = '';

  dichVuChiTietList: any[] = [];
  danhSachLoaiDichVu: string[] = [];

  selecttenLoaiDichVu: string = '';
  dichVuChiTietListFiltered: any[] = [];
  
  showForm = false;
  alertMessage: string | null = null;
  alertType: string = 'success';
  isAlertVisible = false; // Biến theo dõi trạng thái thông báo


  currentPage = 0;
  totalPages = 0;
  pageSize = 5;
  minGia: number | null = null;
  maxGia: number | null = null;

  newDVCT = {
    tenDichVu: '',
    chungLoai: '',
    hangCan:'',
    gia: 0,
    noiDung: '',
    tenLoaiDichVu: ''
  };

  newDVCTErrors = {
    tenDichVu: '',
    chungLoai: '',
    hangCan:'',
    gia: '',
    noiDung: '',
    tenLoaiDichVu: ''
  };

  editDVCT = {
    dichVuChiTietId: null,
    tenDichVu: '',
    chungLoai: '',
    hangCan:'',
    gia: '',
    noiDung: '',
    tenLoaiDichVu: ''
  };

  editDVCTErrors = {
    tenDichVu: '',
    chungLoai: '',
    hangCan:'',
    gia: '',
    noiDung: '',
    tenLoaiDichVu: ''
  };

  // ✅ Khởi tạo mặc định, tránh lỗi undefined


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDVCT();
    this.layDanhSachLoaiDichVu();
  }

  // 📌 Lấy danh sách dịch vụ từ API
  loadDVCT() {
    let url = `${this.apiUrl}/list?page=${this.currentPage}&size=${this.pageSize}`;

    if (this.searchTerm.trim()) {
      url += `&search=${encodeURIComponent(this.searchTerm.trim())}`;
    }
   // 🔥 Đảm bảo loại dịch vụ được gửi đi đúng
  if (this.selecttenLoaiDichVu && this.selecttenLoaiDichVu.trim() !== '') {
    url += `&loaiDichVu=${encodeURIComponent(this.selecttenLoaiDichVu)}`;
  }

  if (this.minGia !== null) {
    url += `&minGia=${this.minGia}`;
  }

  if (this.maxGia !== null) {
    url += `&maxGia=${this.maxGia}`;
  }
    this.http.get<any>(url)
      .subscribe(response => {
        this.dichVuChiTietList = response.content;
        this.totalPages = response.totalPages;

        if (this.dichVuChiTietList.length === 0 && this.currentPage > 0) {
          this.currentPage = 0;
          this.loadDVCT();
        }
      });
  }

  getHangCanLabel(hangCan: number): string {
    switch (hangCan) {
      case 1: return '0-2';
      case 2: return '3-5';
      case 3: return '6-10';
      case 4: return 'Trên 10';
      case 5: return 'Trên 20';
      default: return 'Không xác định';
    }
  }
  
  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadDVCT();
    }
  }
  onSearch() {
    console.log("Tìm kiếm:", this.searchTerm);
    console.log("Loại dịch vụ:", this.selecttenLoaiDichVu);
    console.log("Giá từ:", this.minGia);
    console.log("Giá đến:", this.maxGia);

    this.currentPage = 0;
    this.loadDVCT();
  }

  addDichVu() {
    this.newDVCTErrors = { tenDichVu: '', chungLoai:'', hangCan: '', gia: '', noiDung: '', tenLoaiDichVu:'' };

    let valid = true;

    if (!this.editDVCT.tenDichVu.trim()) {
      this.editDVCTErrors.tenDichVu = 'Vui lòng nhập tên dịch vụ';
      valid = false;
    }

    if (!this.newDVCT.chungLoai.trim()) {
      this.newDVCTErrors.chungLoai = 'Vui lòng chọn chủng loại';
      valid = false;
    }

    if (!this.newDVCT.hangCan.trim()) {
      this.newDVCTErrors.hangCan = 'Vui lòng chọn hạng cân';
      valid = false;
    }



const giaNumber = Number(this.editDVCT.gia); // Chuyển chuỗi thành số

if (!this.editDVCT.gia) {
  this.editDVCTErrors.gia = 'Vui lòng nhập giá';
  valid = false;
} else if (isNaN(giaNumber) || giaNumber <= 0) {
  this.editDVCTErrors.gia = 'Giá phải là số lớn hơn 0';
  valid = false;
}

    if (!this.editDVCT.noiDung.trim()) {
      this.editDVCTErrors.noiDung = 'Vui lòng nhập nội dung';
      valid = false;
    } else if (this.editDVCT.noiDung.trim().length < 5) {
      this.editDVCTErrors.noiDung = 'Nội dung phải có ít nhất 5 ký tự';
      valid = false;
    }

    if (!this.editDVCT.tenLoaiDichVu) {
      this.editDVCTErrors.tenLoaiDichVu = 'Vui lòng chọn loại dịch vụ';
      valid = false;
    } else if (!this.danhSachLoaiDichVu.includes(this.editDVCT.tenLoaiDichVu)) {
      this.editDVCTErrors.tenLoaiDichVu = 'Loại dịch vụ không hợp lệ';
      valid = false;
    }

    if (!valid) {
      return;
    }


    this.http.post('http://localhost:8080/api/dich-vu-chi-tiet/add', this.newDVCT).subscribe(
      (response) => {
        console.log(response)
        alert('Thêm dịch vụ thành công!');
        this.loadDVCT();
        this.newDVCT = {tenDichVu: '',chungLoai:'', hangCan: '', gia: 0, noiDung: '', tenLoaiDichVu: '' }
        
      },
      (error) => {
        console.error('Lỗi ', error);

         
      }
    );
  }

  layDanhSachLoaiDichVu(): void {
    this.http.get<string[]>('http://localhost:8080/api/dich-vu-chi-tiet/loai-dich-vu').subscribe(
      (data) => {
        this.danhSachLoaiDichVu = data;
        console.log("Danh sách",data)

      },
      (error) => {
        console.error('Lỗi khi lấy danh sách dịch vụ:', error);
      }
    );
  }

  deleteDichVu(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này không?')) {
      this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' }).subscribe(
        (response) => {
          this.showAlert('Xóa thành công!', 'success');
          this.loadDVCT();
        },
        (error) => {
          this.showAlert('Lỗi khi xóa khách hàng!', 'danger');
        }
      );
    }
  }

  showAlert(message: string, type: string) {
    if (this.isAlertVisible) return;  // Nếu thông báo đang hiển thị, không làm gì thêm

    this.alertMessage = message;
    this.alertType = type;
    this.isAlertVisible = true;  // Đánh dấu thông báo là đang hiển thị

    // Tự động ẩn thông báo sau 1.5 giây
    setTimeout(() => {
      this.alertMessage = null;
      this.isAlertVisible = false;  // Đánh dấu thông báo đã ẩn
    }, 1500);
  }
 
  onUpdate() {
    this.editDVCTErrors = { tenDichVu: '', chungLoai:'', hangCan: '', gia: '', noiDung: '', tenLoaiDichVu: '' };
    let valid = true;
  
    if (!this.editDVCT.tenDichVu.trim()) {
      this.editDVCTErrors.tenDichVu = 'Vui lòng nhập tên dịch vụ';
      valid = false;
    } else if (this.editDVCT.tenDichVu.length < 2) {
      this.editDVCTErrors.tenDichVu = 'Tên dịch vụ phải có ít nhất 2 ký tự';
      valid = false;
    }
    if (!this.newDVCT.chungLoai.trim()) {
      this.newDVCTErrors.chungLoai = 'Vui lòng chọn chủng loại';
      valid = false;
    }

    if (!this.newDVCT.hangCan.trim()) {
      this.newDVCTErrors.hangCan = 'Vui lòng chọn hạng cân';
      valid = false;
    }
  
    const giaNumber = Number(this.editDVCT.gia);

    if (isNaN(giaNumber) || giaNumber <= 0) {
      this.editDVCTErrors.gia = 'Giá phải là số lớn hơn 0';
      valid = false;
    }
  
    if (!this.editDVCT.noiDung.trim() || this.editDVCT.noiDung.length < 5) {
      this.editDVCTErrors.noiDung = 'Nội dung phải có ít nhất 5 ký tự';
      valid = false;
    }
  
    if (!this.editDVCT.tenLoaiDichVu) {
      this.editDVCTErrors.tenLoaiDichVu = 'Vui lòng chọn loại dịch vụ';
      valid = false;
    }
  
    if (!valid) return;
  
    const updatedDichVu = {
      tenDichVu: this.editDVCT.tenDichVu,
      chungLoai: this.editDVCT.chungLoai,
      hangCan: this.editDVCT.hangCan,
      gia: this.editDVCT.gia,
      noiDung: this.editDVCT.noiDung,
      tenLoaiDichVu: this.editDVCT.tenLoaiDichVu
    };
  
    this.http.put<any>(`${this.apiUrl}/update/${this.editDVCT.dichVuChiTietId}`, updatedDichVu)
      .subscribe(
        () => {
          alert('SỬa dịch vụ thành công!');
          this.loadDVCT();
          this.closeEditModal();
        },
        () => {
          this.showAlert('Có lỗi khi cập nhật!', 'danger');
        }
      );
  }
  


  setEditDichVu(dichvu: any) {
    console.log("Dữ liệu được chọn:", dichvu);
    this.editDVCT = { ...dichvu }; // Gán dữ liệu khách hàng vào form sửa
    if (dichvu.loaiDichVu) {
      this.editDVCT.tenLoaiDichVu = dichvu.loaiDichVu.tenLoaiDichVu;
    } else {
      this.editDVCT.tenLoaiDichVu = '';
    }
  }


  closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
      (modal as any).classList.remove('show');
      (modal as any).setAttribute('aria-hidden', 'true');
      (modal as any).setAttribute('style', 'display: none;');

      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  filterDichVu() {
    this.currentPage = 0;
    this.loadDVCT();
  }

  // filterDichVu() {
  //   if (!this.dichVuChiTietList || this.dichVuChiTietList.length === 0) {
  //     this.dichVuChiTietListFiltered = [];
  //     return; 
  //   }
  
  //   this.dichVuChiTietListFiltered = this.selecttenLoaiDichVu
  //     ? this.dichVuChiTietList.filter(dv => 
  //         dv.tenLoaiDichVu === this.selecttenLoaiDichVu || 
  //         (dv.loaiDichVu && dv.loaiDichVu.tenLoaiDichVu === this.selecttenLoaiDichVu) 
  //       )
  //     : [...this.dichVuChiTietList];
  // }
  
  


}
