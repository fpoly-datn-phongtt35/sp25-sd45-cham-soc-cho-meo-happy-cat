import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-datlich',
  templateUrl: './datlich.component.html',
  styleUrls: ['./datlich.component.css']
})
export class DatlichComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api/lich-dat';
  apiUrl2 = 'http://localhost:8080/api/phan-cong';
  alertMessage: string | null = null;
  alertType: string = 'success';
  isAlertVisible = false;

  danhSachLichDat: any[] = [];
  ngay: string = new Date().toISOString().split('T')[0]; // Ngày được chọn
  danhSachCaLam: any[] = []; // Danh sách ca làm
  danhSachNhanVien: any[] = []; // Danh sách nhân viên
  phanCongMatrix: any[] = []; // Ma trận phân công

  selectedDate1: string = new Date().toISOString().split('T')[0];
  searchTerm1: string = '';
  currentPage1 = 0;
  totalPages1 = 0;
  listlichdatdaxacnhan: any[] = [];
  selectedLich: any = null;

  selectedDate2: string = new Date().toISOString().split('T')[0];
  searchTerm2 :string = '';
  currentPage2 = 0;
  totalPages2 = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.taiLaiDuLieu();
    this.taiLaiDuLieuChuaPhanCong();
    this.taiDanhSachNhanVien();
    this.taiDanhSachCaLam();
    this.loadlichdatdaxacnhan();
  }
  toggleCaLam(lich: any, caLamId: number) {
    if (!lich.selectedCaLamIds) {
      lich.selectedCaLamIds = [];
    }
    if (lich.selectedCaLamIds.includes(caLamId)) {
      lich.selectedCaLamIds = lich.selectedCaLamIds.filter(id => id !== caLamId);
    } else {
      lich.selectedCaLamIds.push(caLamId);
    }
  }


  taiLaiDuLieu() {
    if (!this.ngay) {
      this.showAlert('Vui lòng chọn ngày', 'danger');
      return;
    }

    this.http.get(`${this.apiUrl2}/lich-lam-viec?ngay=${this.ngay}`).subscribe(
      (data: any) => {
        this.danhSachCaLam = data.ca_lam || [];
        this.danhSachNhanVien = data.nhan_vien || [];
        this.phanCongMatrix = data.phan_cong || {};

        console.log('phancong',this.phanCongMatrix)

      },
      (error) => {
        console.error('Lỗi khi tải lịch làm việc:', error);
        this.showAlert('Lỗi khi tải lịch làm việc', 'danger');
      }
    );
  }

  daPhanCong(caLamId: number, nhanVienId: number): boolean {
    if (!this.phanCongMatrix || !this.phanCongMatrix[caLamId]) return false;

    return !!this.phanCongMatrix[caLamId][nhanVienId];
  }

  taiLaiDuLieuChuaPhanCong() {
    let url = `${this.apiUrl}/chua-phan-cong?page=${this.currentPage2}`;

    if (this.selectedDate1) { // Chỉ thêm nếu người dùng chọn ngày
        url += `&ngayDat=${this.selectedDate2}`;
    }
    if (this.searchTerm2.trim()) { // Tìm theo số điện thoại
        url += `&soDienThoai=${this.searchTerm2}`;
    }

    this.http.get<any>(url).subscribe(
      (response) => {
        this.danhSachLichDat = response.content.map((lich: any) => ({
          ...lich,
          selectedNhanVienId: this.danhSachNhanVien.length ? this.danhSachNhanVien[0].id : null,
          selectedCaLamId: this.danhSachCaLam.length ? this.danhSachCaLam[0].caLamId : null,
        }));

        this.totalPages2 = response.totalPages;

        if (this.danhSachLichDat.length === 0 && this.currentPage2 > 0) {
          this.currentPage2 = 0;
          this.taiLaiDuLieuChuaPhanCong();
        }
      },
      (error) => {
        console.error('Lỗi khi tải lịch đặt chưa phân công:', error);
        this.showAlert('Lỗi khi tải lịch đặt chưa phân công', 'danger');
      }
    );
}


  taiDanhSachNhanVien() {
    this.http.get(`${this.apiUrl}/nhan-vien`).subscribe(
      (data: any) => {
        this.danhSachNhanVien = data;

      },
      (error) => {
        console.error('Lỗi khi tải danh sách nhân viên:', error);
        this.showAlert('Lỗi khi tải danh sách nhân viên', 'danger');
      }
    );
  }

  taiDanhSachCaLam() {
    this.http.get(`${this.apiUrl}/ca-lam`).subscribe(
      (data: any) => {
        this.danhSachCaLam = data;
      },
      (error) => {
        console.error('Lỗi khi tải danh sách ca làm:', error);
        this.showAlert('Lỗi khi tải danh sách ca làm', 'danger');
      }
    );
  }

  xacNhan(lich: any) {
    if (this.danhSachNhanVien.length === 0 || this.danhSachCaLam.length === 0) {
      this.showAlert('Danh sách nhân viên hoặc ca làm trống. Vui lòng kiểm tra lại!', 'danger');
    }


    const request = {
      lichDatId: lich.lichDatId,
      nhanVienId: Number(lich.selectedNhanVienId),
      caLamIds: lich.selectedCaLamIds, // Mảng ID ca làm đã chọn
      ngayDat: lich.ngayDat,
    };

    this.http.post(`${this.apiUrl}/xac-nhan`, request,{ responseType: 'text' }).subscribe(
      (response: any) => {
        this.showAlert(response, 'success');
        this.taiLaiDuLieu();
        this.taiLaiDuLieuChuaPhanCong();
        this.loadlichdatdaxacnhan();
      },
      (error) => {
        console.error('Lỗi khi xác nhận lịch đặt:', error);
        this.taiLaiDuLieu();
        this.taiLaiDuLieuChuaPhanCong();
        let errorMessage = 'Lỗi không xác định';
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (typeof error.error === 'object' && error.error.message) {
            errorMessage = error.error.message;
          }
        }

        this.showAlert(errorMessage, 'danger');
      }
    );
  }


  closeAlert() {
    this.alertMessage = null;
    this.isAlertVisible = false;
  }



  showAlert(message: string, type: string) {
    if (this.isAlertVisible) return;

    this.alertMessage = message;
    this.alertType = type;
    this.isAlertVisible = true;

    setTimeout(() => {
      this.alertMessage = null;
      this.isAlertVisible = false;
    }, 3000); // Thời gian hiển thị thông báo: 3 giây
  }


  closeEditModal() {
    const modal = document.getElementById('edit-dat-lich');

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
  filterByDate() {

    this.currentPage2 = 0;
    this.currentPage1 = 0;
    this.loadlichdatdaxacnhan();
    this.taiLaiDuLieuChuaPhanCong();

  }
  changePage1(page: number) {
    if (page >= 0 && page < this.totalPages1) {
      this.currentPage1 = page;
      this.loadlichdatdaxacnhan();
    }
  }
  changePage2(page: number) {
    if (page >= 0 && page < this.totalPages2) {
      this.currentPage2 = page;
      this.taiLaiDuLieuChuaPhanCong();
    }
  }
  onSearch() {

    this.currentPage1 = 0;
    this.loadlichdatdaxacnhan();


  }
  onSearch2() {

    this.currentPage2=0;
    this.taiLaiDuLieuChuaPhanCong();


  }

  loadlichdatdaxacnhan() {
    let url = `${this.apiUrl}/list?page=${this.currentPage1}`;

    if (this.selectedDate1) { // Chỉ thêm nếu người dùng chọn ngày
      url += `&ngayDat=${this.selectedDate1}`;
  }
    if (this.searchTerm1.trim()) {
      url += `&search=${this.searchTerm1}`;
    }
    this.http.get<any>(url)
      .subscribe(response => {
        this.listlichdatdaxacnhan = response.content;
        console.log('đaa',response.content)

        this.totalPages1 = response.totalPages;

        if (this.listlichdatdaxacnhan.length === 0 && this.currentPage1 > 0) {
          this.currentPage1 = 0;
          this.loadlichdatdaxacnhan();
        }
      });
  }


  viewDetails(lich: any): void {
    this.selectedLich = lich; // Gán lịch đặt được chọn
    console.log('datav',this.selectedLich)
  }

  getHangCan(hangCan: number | undefined): string {
    const hangCanMap: { [key: number]: string } = {
      1: '0-2 kg',
      2: '2-4 kg',
      3: '4-7 kg',
      4: '7-10 kg',
      5: '10-12 kg',
      6: '12-15 kg',
      7: '10-15 kg',
      8:'Trên 15 kg'
    };
    return hangCan ? hangCanMap[hangCan] || 'Không xác định' : 'Không xác định';
  }

}
