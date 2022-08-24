import {Routes} from '@angular/router';
import {LoopComponent} from "@/modules/loop/loop.component";

export const appRoutes: Routes = [
  {
    path: 'loops',
    component: LoopComponent,
    children : [ {
      path: ':loop',
      component: LoopComponent,
    }]
  }, {
  path: '',
  pathMatch: 'full',
  redirectTo: '/loops'
}];
