import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router'; 



@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MatButtonModule,],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  userKey: string | null = null;
  userData: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.userKey = this.route.snapshot.paramMap.get('key');
    if (this.userKey) {
      this.fetchUserData(this.userKey);
    }
  }

  fetchUserData(key: string): void {
    this.http.get(`http://localhost:3000/app/user/${key}`).subscribe(
      (data) => {
        this.userData = data;
      },
      (error) => {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    );
  }
  goBack() {
    this.router.navigate(['crud']); 
  }
}
