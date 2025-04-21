import { Routes } from "@angular/router";
import { AddinvoiceComponent } from "./addinvoice/addinvoice.component";
import { InvoiceslistComponent } from "./invoiceslist/invoiceslist.component";

export default [
    { path: 'addinvoice', component: AddinvoiceComponent },
    { path: 'invoiceslist', component: InvoiceslistComponent },
] as Routes;
