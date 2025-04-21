import { Routes } from "@angular/router";
import { AddproductComponent } from "./addproduct/addproduct.component";
import { ProductslistComponent } from "./productslist/productslist.component";

export default [
    { path: 'addproduct', component: AddproductComponent },
    { path: 'productslist', component: ProductslistComponent },
] as Routes;
