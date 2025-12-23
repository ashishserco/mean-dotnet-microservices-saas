import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimsComponent } from './claims/claims.component';

const routes: Routes = [
  { path: 'claims', component: ClaimsComponent },
  { path: '', redirectTo: '/claims', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
