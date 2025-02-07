import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule], // Добавьте RouterOutlet в imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {}

  redirect(path: string) {
    this.router.navigate([path]); // Навигация на указанный маршрут
  }
}
// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { UserFormComponent } from './user-form/user-form.component';
// import { CrudFormComponent } from './crud-form/crud-form.component';
// import { MatButtonModule } from '@angular/material/button';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     RouterOutlet,
//     CommonModule,
//     UserFormComponent,
//     CrudFormComponent,
//     MatButtonModule,

//   ],
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss'],
// })
// export class AppComponent {
//   title = 'poject';
//   activeComponentIndex = 0;
//   components = ['add User', 'crud User',];

//   toggleView(index: number) {
//     this.activeComponentIndex = index;
//   }
// }
