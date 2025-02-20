import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-khachhang',
  templateUrl: './khachhang.component.html',
  styleUrls: ['./khachhang.component.css']
})
export class KhachhangComponent implements OnInit {

  apiUrl = 'http://localhost:8080/api/khach-hang';
  alertMessage: string | null = null;
  alertType: string = 'success';
  khachHangList: any[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 5;
  searchTerm: string = '';
  selectedGender: string = '';
  isFormVisible: boolean = false;
  newKhachHang = {
    tenKhachHang: '',
    email: '',
    soDienThoai: '',
    gioiTinh: 'Nam'
  };
  editKhachHang = {
    khachHangId: null,
    tenKhachHang: '',
    email: '',
    soDienThoai: '',
    gioiTinh: 'Nam'
  };
  newKhachHangErrors = {
    tenKhachHang: '',
    email: '',
    soDienThoai: '',
    gioiTinh: ''
  };

  // Biến lưu thông báo lỗi cho form Sửa
  editKhachHangErrors = {
    tenKhachHang: '',
    email: '',
    soDienThoai: '',
    gioiTinh: ''
  };
  isAlertVisible = false; // Biến theo dõi trạng thái thông báo

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadKhachHang();
  }


  loadKhachHang() {
    let url = `${this.apiUrl}/list?page=${this.currentPage}&size=${this.pageSize}`;

    if (this.searchTerm.trim()) {
      url += `&search=${this.searchTerm}`;
    }

    if (this.selectedGender) {
      url += `&gender=${this.selectedGender}`;
    }

    this.http.get<any>(url)
      .subscribe(response => {
        this.khachHangList = response.content;
        this.totalPages = response.totalPages;

        if (this.khachHangList.length === 0 && this.currentPage > 0) {
          this.currentPage = 0;
          this.loadKhachHang();
        }
      });
  }
  onGenderChange() {
    this.currentPage = 0;
    this.loadKhachHang();
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadKhachHang();
    }
  }

  onSearch() {
    this.currentPage = 0;
    this.loadKhachHang();
  }

  onSubmit() {
    this.newKhachHangErrors = { tenKhachHang: '', email: '', soDienThoai: '', gioiTinh: '' };

    let valid = true;

    // Validate Tên khách hàng: không trống và phải có ít nhất 2 ký tự
    if (!this.newKhachHang.tenKhachHang.trim()) {
      this.newKhachHangErrors.tenKhachHang = 'Vui lòng nhập tên khách hàng';
      valid = false;
    } else if (this.newKhachHang.tenKhachHang.trim().length < 2) {
      this.newKhachHangErrors.tenKhachHang = 'Tên khách hàng phải có ít nhất 2 ký tự';
      valid = false;
    }

    // Validate Email
    if (!this.newKhachHang.email.trim()) {
      this.newKhachHangErrors.email = 'Vui lòng nhập email';
      valid = false;
    } else if (!this.newKhachHang.email.includes('@')) {
      this.newKhachHangErrors.email = 'Email không đúng định dạng';
      valid = false;
    }

    // Validate Số điện thoại: không trống, phải là số, bắt đầu bằng 0 và có đúng 10 chữ số.
    if (!this.newKhachHang.soDienThoai.trim()) {
      this.newKhachHangErrors.soDienThoai = 'Vui lòng nhập số điện thoại';
      valid = false;
    } else if (!/^(0\d{9})$/.test(this.newKhachHang.soDienThoai)) {
      this.newKhachHangErrors.soDienThoai = 'Số điện thoại không đúng định dạng';
      valid = false;
    }

    // Validate Giới tính: không được để trống (nếu cần)
    if (!this.newKhachHang.gioiTinh.trim()) {
      this.newKhachHangErrors.gioiTinh = 'Vui lòng chọn giới tính';
      valid = false;
    }

    if (!valid) {
      return; // Dừng nếu có lỗi
    }

    // Nếu hợp lệ thì gửi dữ liệu
    this.http.post<any>(`${this.apiUrl}/add`, this.newKhachHang).subscribe(
      response => {
        this.showAlert('Thêm khách hàng thành công!', 'success');
        this.loadKhachHang();
        // Reset form sau khi thêm
        this.newKhachHang = { tenKhachHang: '', email: '', soDienThoai: '', gioiTinh: 'Nam' };
      },
      error => {
        this.showAlert('Có lỗi xảy ra khi thêm khách hàng!', 'danger');
      }
    );
  }


  deleteKhachHang(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này không?')) {
      this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' }).subscribe(
        (response) => {
          this.showAlert('Xóa thành công!', 'success');
          this.loadKhachHang();
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
    // Reset lỗi
    this.editKhachHangErrors = { tenKhachHang: '', email: '', soDienThoai: '', gioiTinh: '' };

    let valid = true;

    if (!this.editKhachHang.tenKhachHang.trim()) {
      this.editKhachHangErrors.tenKhachHang = 'Vui lòng nhập tên khách hàng';
      valid = false;
    } else if (this.editKhachHang.tenKhachHang.trim().length < 2) {
      this.editKhachHangErrors.tenKhachHang = 'Tên khách hàng phải có ít nhất 2 ký tự';
      valid = false;
    }

    if (!this.editKhachHang.email.trim()) {
      this.editKhachHangErrors.email = 'Vui lòng nhập email';
      valid = false;
    } else if (!this.editKhachHang.email.includes('@')) {
      this.editKhachHangErrors.email = 'Email không đúng định dạng';
      valid = false;
    }

    if (!this.editKhachHang.soDienThoai.trim()) {
      this.editKhachHangErrors.soDienThoai = 'Vui lòng nhập số điện thoại';
      valid = false;
    } else if (!/^(0\d{9})$/.test(this.editKhachHang.soDienThoai)) {
      this.editKhachHangErrors.soDienThoai = 'Số điện thoại không đúng định dạng';
      valid = false;
    }

    if (!this.editKhachHang.gioiTinh.trim()) {
      this.editKhachHangErrors.gioiTinh = 'Vui lòng chọn giới tính';
      valid = false;
    }

    if (!valid) {
      return;
    }

    const updatedKhachHang = {
      tenKhachHang: this.editKhachHang.tenKhachHang,
      email: this.editKhachHang.email,
      soDienThoai: this.editKhachHang.soDienThoai,
      gioiTinh: this.editKhachHang.gioiTinh
    };

    this.http.put<any>(`${this.apiUrl}/update/${this.editKhachHang.khachHangId}`, updatedKhachHang)
      .subscribe(
        response => {
          this.showAlert('Cập nhật khách hàng thành công!', 'success');
          this.loadKhachHang();
          this.closeEditModal();
        },
        error => {
          this.showAlert('Có lỗi khi cập nhật khách hàng!', 'danger');
        }
      );
  }
  setEditKhachHang(khachHang: any) {
    this.editKhachHang = { ...khachHang }; // Gán dữ liệu khách hàng vào form sửa
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


}
