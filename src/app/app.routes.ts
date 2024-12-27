import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',

    data: {
      breadcrumb: 'Peşin - Vadeli Taahhüt Azami Miktar Girişi',
      title: 'Peşin - Vadeli Taahhüt Azami Miktar Girişi',
    },

    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
];
