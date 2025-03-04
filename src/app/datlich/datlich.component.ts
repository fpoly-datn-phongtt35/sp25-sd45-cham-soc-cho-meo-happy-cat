import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-datlich',
  templateUrl: './datlich.component.html',
  styleUrls: ['./datlich.component.css']
})
export class DatlichComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api/lich-dat';

  datlichlist: any[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 5;
  searchTerm: string = '';
  searchTerm1: string = '';
  searchTerm2: string = '';

  selectedLich: any = null;
  listlichdatchuaxacnhan: any[] = [];
  listlichhuy: any[] = [];

  currentPage1 = 0;
  totalPages1 = 0;

  currentPage2 = 0;
  totalPages2 = 0;
  danhSachDichVu: String[] = [];
  alertMessage: string | null = null;
  alertType: string = 'success';
  isAlertVisible = false; // Biến theo dõi trạng thái thông báo
  selectedDate: string = '';
  selectedDate1: string = '';
  selectedDate2: string = '';


  danhSachGio: string[] = [
    '08:30', '09:30', '10:30','11:30',
    '13:30', '14:30', '15:30', '16:30', '17:30',
    '18:30', '19:30', '20:30'
  ];

  editlichDat = {
    lichDatId:null,
    tenKhachHang: '',
    soDienThoai: '',
    email: '',
    tenThuCung: '',
    chungLoai: 'chó',
    hangCan: null,
    ngayDat: '',
    gioDat: '',
    tenDichVu: '',
    xoaLich: null
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadlichdatxacnhan();
    this.loadlichdatchuaxacnhan();
    this.loadlichdathuy();
    this.layDanhSachDichVu();


  }

  layDanhSachDichVu(): void {
    this.http.get<any[]>('http://localhost:8080/api/lich-dat/danh-sach-ten-dich-vu').subscribe(
      (data) => {
        this.danhSachDichVu = data;

      },
      (error) => {
        console.error('Lỗi khi lấy danh sách dịch vụ:', error);
      }
    );
  }

  loadlichdatxacnhan() {
    let url = `${this.apiUrl}/list?page=${this.currentPage}&size=${this.pageSize}`;

    if (this.searchTerm.trim()) {
      url += `&search=${this.searchTerm}`;
    }
    if (this.selectedDate) { // Chỉ thêm nếu người dùng chọn ngày
      url += `&ngayDat=${this.selectedDate}`;
  }
    this.http.get<any>(url)
      .subscribe(response => {
        this.datlichlist = response.content;
        this.totalPages = response.totalPages;

        if (this.datlichlist.length === 0 && this.currentPage > 0) {
          this.currentPage = 0;
          this.loadlichdatxacnhan();
        }
      });
  }

  filterByDate() {
    this.currentPage = 0;
    this.currentPage2 = 0;

    this.currentPage1 = 0;
    this.loadlichdatxacnhan();
    this.loadlichdatchuaxacnhan();
    this.loadlichdathuy();
  }
  loadlichdatchuaxacnhan() {
    let url = `${this.apiUrl}/list?page=${this.currentPage1}&size=${this.pageSize}&xoaLich=1`;

    if (this.selectedDate1) { // Chỉ thêm nếu người dùng chọn ngày
      url += `&ngayDat=${this.selectedDate1}`;
  }
    if (this.searchTerm1.trim()) {
      url += `&search=${this.searchTerm1}`;
    }
    this.http.get<any>(url)
      .subscribe(response => {
        this.listlichdatchuaxacnhan = response.content;

        this.totalPages1 = response.totalPages;

        if (this.listlichdatchuaxacnhan.length === 0 && this.currentPage1 > 0) {
          this.currentPage1 = 0;
          this.loadlichdatchuaxacnhan();
        }
      });
  }
  loadlichdathuy() {
    let url = `${this.apiUrl}/list?page=${this.currentPage2}&size=${this.pageSize}&xoaLich=2`;
    if (this.selectedDate2) { // Chỉ thêm nếu người dùng chọn ngày
      url += `&ngayDat=${this.selectedDate2}`;
  }
    if (this.searchTerm2.trim()) {
      url += `&search=${this.searchTerm2}`;
    }
    this.http.get<any>(url)
      .subscribe(response => {
        this.listlichhuy = response.content;
        this.totalPages2 = response.totalPages;

        if (this.listlichhuy.length === 0 && this.currentPage2 > 0) {
          this.currentPage2 = 0;
          this.loadlichdathuy();
        }
      });
  }


  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
     this.loadlichdatxacnhan();


    }
  }
  changePage1(page: number) {
    if (page >= 0 && page < this.totalPages1) {
      this.currentPage1 = page;
      this.loadlichdatchuaxacnhan();
    }
  }

  changePage2(page: number) {
    if (page >= 0 && page < this.totalPages2) {
      this.currentPage2 = page;
      this.loadlichdathuy();
    }
  }

  onSearch() {
    this.currentPage = 0;
    this.currentPage2 = 0;

    this.currentPage1 = 0;

    this.loadlichdatxacnhan();
    this.loadlichdatchuaxacnhan();
    this.loadlichdathuy();
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

  setEditLichDat(lich: any) {
    this.editlichDat = { ...lich }; // Gán dữ liệu khách hàng vào form sửa
    console.log('datasetdatlich',this.editlichDat.lichDatId)
  }
  onUpdate() {
    // Reset lỗi

    const updateLichDat = {
      tenKhachHang:this.editlichDat.tenKhachHang,
      soDienThoai: this.editlichDat.soDienThoai,
      email: this.editlichDat.email,
      tenThuCung: this.editlichDat.tenThuCung,
      chungLoai: this.editlichDat.chungLoai,
      hangCan: this.editlichDat.hangCan,
      ngayDat:this.editlichDat.ngayDat,
      gioDat: this.editlichDat.gioDat,
      tenDichVu: this.editlichDat.tenDichVu,
      xoaLich: this.editlichDat.xoaLich,
    };

    this.http.put<any>(`${this.apiUrl}/sua/${this.editlichDat.lichDatId}`, updateLichDat)
      .subscribe(
        response => {


        },
        error => {
          this.loadlichdatxacnhan();
          this.loadlichdatchuaxacnhan();
          this.loadlichdathuy();
          this.closeEditModal();
          this.showAlert('Cập nhật  thành công!', 'success');

          console.log('update id',this.editlichDat.lichDatId)
        }
      );
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

  huyLich(lichDatId: number, xoaLich: number) {
    if (confirm('Xác nhận hủy lịch này ?')) {

    this.http.put(`${this.apiUrl}/cap-nhat-xoa-lich/${lichDatId}?xoaLich=${xoaLich}`, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.showAlert('Hủy thành công!', 'success');
          console.log(response);
        },
        error: (err) => {
          this.showAlert('Hủy thành công!', 'success');
        }
      });}}

      xacNhanLich(lichDatId: number, xoaLich: number) {

        this.http.put(`${this.apiUrl}/cap-nhat-xoa-lich/${lichDatId}?xoaLich=${xoaLich}`, { responseType: 'text' })
          .subscribe({
            next: (response) => {
              this.showAlert('Xác nhận thành công!', 'success');

              console.log(response);
            },
            error: (err) => {
              this.showAlert('Hủy thành công!', 'success');
            }
          });}
}
