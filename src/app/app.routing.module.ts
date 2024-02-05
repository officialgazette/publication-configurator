import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RootComponent } from "./component/root/component";
import { TenantComponent } from "./component/tenant/component";

const routes: Routes = [
  { path: "", component: TenantComponent },
  { path: "root", component: RootComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
