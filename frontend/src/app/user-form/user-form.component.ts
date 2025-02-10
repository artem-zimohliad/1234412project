import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  userData: any;

  ngOnInit() {
    this.loadUserData();
  }

  onSubmit(form: NgForm) {
    const randomKey = Math.floor(100 + Math.random() * 900); 
    const userData = { user_key: randomKey, ...form.value }; 
    console.log(userData);
  
    fetch('http://localhost:3000/app/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        this.loadUserData();
        console.log('Response from server:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      alert("Ваш пользовател был зарегестрирован")
  }

  loadUserData() {
    fetch('http://localhost:3000/app/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.userData = data;
        console.log('Полученные данные:', data);
      })
      .catch((error) => {
        console.error('Ошибка при получении данных:', error);
      });
  }
  objectKeys(obj: any) {
    return obj ? Object.keys(obj) : [];
  }
}
