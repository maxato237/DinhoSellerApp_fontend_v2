import { Routes } from "@angular/router";
import { AddsupplierComponent } from "./addsupplier/addsupplier.component";
import { SupplierslistComponent } from "./supplierslist/supplierslist.component";

export default [
    { path: 'addsupplier', component: AddsupplierComponent },
    { path: 'supplierslist', component: SupplierslistComponent },
] as Routes;
