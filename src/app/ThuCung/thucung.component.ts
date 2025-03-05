import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-thucung',
  templateUrl: './thucung.component.html',
  styleUrls: ['./thucung.component.css']
})
export class ThucungComponent implements OnInit {

  private apiUrl = 'http://localhost:8080/api/thu-cung';  // Changed to thucung API
  alertMessage: string | null = null;
  alertType: string = 'success';
  thucungList: any[] = [];  // Changed to thucungList
  currentPage = 0;
  totalPages = 0;
  pageSize = 5;
  searchTerm: string = '';
  selectedBreed: string = '';  // Filter by breed instead of gender
  isFormVisible: boolean = false;
  newThucung = {
    name: '',
    breed: '',
    age: null,
    owner: ''
  };
  editThucung = {
    thucungId: null,
    name: '',
    breed: '',
    age: null,
    owner: ''
  };
  newThucungErrors = {
    name: '',
    breed: '',
    age: '',
    owner: ''
  };

  editThucungErrors = {
    name: '',
    breed: '',
    age: '',
    owner: ''
  };

  isAlertVisible = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadThucung();
  }

  loadThucung() {
    let url = `${this.apiUrl}/list?page=${this.currentPage}&size=${this.pageSize}`;

    if (this.searchTerm.trim()) {
      url += `&search=${this.searchTerm}`;
    }

    if (this.selectedBreed) {
      url += `&breed=${this.selectedBreed}`;
    }

    this.http.get<any>(url)
      .subscribe(response => {
        this.thucungList = response.content;
        this.totalPages = response.totalPages;

        if (this.thucungList.length === 0 && this.currentPage > 0) {
          this.currentPage = 0;
          this.loadThucung();
        }
      });
  }

  onBreedChange() {
    this.currentPage = 0;
    this.loadThucung();
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadThucung();
    }
  }

  onSearch() {
    this.currentPage = 0;
    this.loadThucung();
  }

  onSubmit() {
    this.newThucungErrors = { name: '', breed: '', age: '', owner: '' };

    let valid = true;

    if (!this.newThucung.name.trim()) {
      this.newThucungErrors.name = 'Vui lòng nhập tên thú cưng';
      valid = false;
    }

    if (!this.newThucung.breed.trim()) {
      this.newThucungErrors.breed = 'Vui lòng nhập giống loài';
      valid = false;
    }

    if (this.newThucung.age == null || this.newThucung.age <= 0) {
      this.newThucungErrors.age = 'Vui lòng nhập tuổi thú cưng hợp lệ';
      valid = false;
    }

    if (!this.newThucung.owner.trim()) {
      this.newThucungErrors.owner = 'Vui lòng nhập chủ sở hữu';
      valid = false;
    }

    if (!valid) {
      return;
    }

    this.http.post<any>(`${this.apiUrl}/add`, this.newThucung).subscribe(
      response => {
        this.showAlert('Thêm thú cưng thành công!', 'success');
        this.loadThucung();
        this.newThucung = { name: '', breed: '', age: null, owner: '' };
      },
      error => {
        this.showAlert('Có lỗi xảy ra khi thêm thú cưng!', 'danger');
      }
    );
  }

  deleteThucung(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa thú cưng này không?')) {
      this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' }).subscribe(
        (response) => {
          this.showAlert('Xóa thành công!', 'success');
          this.loadThucung();
        },
        (error) => {
          this.showAlert('Lỗi khi xóa thú cưng!', 'danger');
        }
      );
    }
  }

  showAlert(message: string, type: string) {
    if (this.isAlertVisible) return;

    this.alertMessage = message;
    this.alertType = type;
    this.isAlertVisible = true;

    setTimeout(() => {
      this.alertMessage = null;
      this.isAlertVisible = false;
    }, 1500);
  }

  onUpdate() {
    this.editThucungErrors = { name: '', breed: '', age: '', owner: '' };

    let valid = true;

    if (!this.editThucung.name.trim()) {
      this.editThucungErrors.name = 'Vui lòng nhập tên thú cưng';
      valid = false;
    }

    if (!this.editThucung.breed.trim()) {
      this.editThucungErrors.breed = 'Vui lòng nhập giống loài';
      valid = false;
    }

    if (this.editThucung.age == null || this.editThucung.age <= 0) {
      this.editThucungErrors.age = 'Vui lòng nhập tuổi thú cưng hợp lệ';
      valid = false;
    }

    if (!this.editThucung.owner.trim()) {
      this.editThucungErrors.owner = 'Vui lòng nhập chủ sở hữu';
      valid = false;
    }

    if (!valid) {
      return;
    }

    const updatedThucung = {
      name: this.editThucung.name,
      breed: this.editThucung.breed,
      age: this.editThucung.age,
      owner: this.editThucung.owner
    };

    this.http.put<any>(`${this.apiUrl}/update/${this.editThucung.thucungId}`, updatedThucung)
      .subscribe(
        response => {
          this.showAlert('Cập nhật thú cưng thành công!', 'success');
          this.loadThucung();
          this.closeEditModal();
        },
        error => {
          this.showAlert('Có lỗi khi cập nhật thú cưng!', 'danger');
        }
      );
  }

  setEditThucung(thucung: any) {
    this.editThucung = { ...thucung };
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
