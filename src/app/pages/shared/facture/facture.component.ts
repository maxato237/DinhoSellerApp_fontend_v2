import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
@Component({
    selector: 'app-facture',
    imports: [TableModule,FormsModule,CommonModule],
    templateUrl: './facture.component.html',
    styleUrl: './facture.component.scss',
})
export class FactureComponent implements OnInit {
    @Input() invoice: any;

    constructor(){

    }
    ngOnInit(): void {
        console.log(this.invoice);
        console.log(this.invoice.lignes);
    }
}
