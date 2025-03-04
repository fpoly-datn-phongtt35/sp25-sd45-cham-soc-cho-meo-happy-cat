import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-viewuserdatlich',
  templateUrl: './viewuserdatlich.component.html',
  styleUrls: ['./viewuserdatlich.component.css']
})
export class ViewuserdatlichComponent implements OnInit {

  danhSachDichVu: String[] = [];

 tien : number;



  danhSachGio: string[] = [
    '08:30', '09:30', '10:30','11:30',
    '13:30', '14:30', '15:30', '16:30', '17:30',
    '18:30', '19:30', '20:30'
  ];

  lichDat = {
    tenKhachHang: '',
    soDienThoai: '',
    email: '',
    tenThuCung: '',
    chungLoai: 'chó',
    hangCan: null,
    ngayDat: '',
    gioDat: '',
    tenDichVu: '',
    xoaLich:1,
    dichVuChiTietId:null,
    gia:0
  };



  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.layDanhSachDichVu();
  }

  layDanhSachDichVu(): void {
    this.http.get<any[]>('http://localhost:8080/api/lich-dat/danh-sach-ten-dich-vu').subscribe(
      (data) => {
        this.danhSachDichVu = data;
        console.log('dat ds',data)

      },
      (error) => {
        console.error('Lỗi khi lấy danh sách dịch vụ:', error);
      }
    );
  }
  onSubmit(): void {

    this.http.post('http://localhost:8080/api/lich-dat/them-moi', this.lichDat).subscribe(
      (response) => {

      },
      (error) => {

        alert('Đặt lịch thành công!');
        this.resetForm();
      this.tien=0     }
    );
  }

  capNhatDichVuChiTiet() {
    if (this.lichDat.tenDichVu && this.lichDat.chungLoai && this.lichDat.hangCan) {
      const url = `http://localhost:8080/api/lich-dat/tim-id-va-gia?tenDichVu=${this.lichDat.tenDichVu}&chungLoai=${this.lichDat.chungLoai}&hangCan=${this.lichDat.hangCan}`;

      this.http.get<any>(url).subscribe(
        (res) => {

          this.tien = res.gia;

          this.cdRef.detectChanges();


        },
        (error) => {
          console.error('Lỗi:', error);

        }
      );
    }
  }

  resetForm(): void {
    this.lichDat = {
      tenKhachHang: '',
      soDienThoai: '',
      email: '',
      tenThuCung: '',
      chungLoai: 'chó',
      hangCan: null,
      ngayDat: '',
      gioDat: '',
      tenDichVu: '',
      xoaLich:1,
      dichVuChiTietId:null,
      gia:0
    };
  }
}
