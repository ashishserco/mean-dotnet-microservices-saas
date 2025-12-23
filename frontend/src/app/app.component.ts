import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>DarwinX</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/claims">Claims</button>
    </mat-toolbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .container { padding: 20px; }
  `]
})
export class AppComponent {
  title = 'darwinx-frontend';
}
