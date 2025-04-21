import { Routes } from "@angular/router";
import { AddemployeeComponent } from "./addemployee/addemployee.component";
import { EmployeeslistComponent } from "./employeeslist/employeeslist.component";

export default [
    { path: 'addemployee', component: AddemployeeComponent },
    { path: 'employeeslist', component: EmployeeslistComponent },
] as Routes;

