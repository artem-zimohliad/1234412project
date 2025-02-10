import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-crud-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss'],
})
export class CrudFormComponent implements OnInit {
  users = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'username',
    'email',
    'phone',
    'password',
    'actions',
  ];
  totalItems = 0;
  pageSize = 5;
  pageIndex = 0;
  selectedUser: any = {};
  showTable = true;
  isAscending = true;

  constructor(private http: HttpClient) {}
  // проблема в этом модуле и он вызывает ошибки его нужно будет исправить

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(
    page: number = this.pageIndex,
    size: number = this.pageSize
  ): void {
    this.http
      .get<{ data: any[]; totalItems: number }>(
        `http://localhost:3000/app/user?_page=${page + 1}&_limit=${size}`
      )
      .subscribe(
        (response) => {
          this.users.data = response.data;
          this.totalItems = response.totalItems;
        },
        (error) => {
          console.error('Ошибка при получении пользователей:', error);
        }
      );
  }

  editItem(index: number): void {
    this.users.data[index].isEditing = true;
  }
  
  saveItem(index: number): void {
    const updatedUser = this.users.data[index];
    this.http
      .put(`http://localhost:3000/app/user/${updatedUser.id}`, updatedUser)
      .subscribe(
        (response) => {
          console.log('Пользователь обновлен:', response);
          this.fetchUsers();
        },
        (error) => {
          console.error('Ошибка при обновлении пользователя:', error);
        }
      );
    this.users.data[index].isEditing = false;
  }

  cancelEdit(index: number): void {
    this.users.data[index].isEditing = false;
  }

  deleteItem(index: number): void {
    const userId = this.users.data[index].id;
    this.http.delete(`http://localhost:3000/app/user/${userId}`).subscribe(
      () => {
        console.log('Пользователь удалён');
        this.fetchUsers();
      },
      (error) => {
        console.error('Ошибка при удалении пользователя:', error);
      }
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchUsers(this.pageIndex, this.pageSize);
  }

  goBackToTable(): void {
    this.selectedUser = {};
    this.showTable = true;
  }



  viewUserDetails(): void {
    this.selectedUser = {};
    this.showTable = false;
  }
}
