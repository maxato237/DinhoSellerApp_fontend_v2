import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ApplicationSettingService } from '../../service/application.setting.service';
@Component({
    selector: 'app-facture',
    imports: [TableModule,FormsModule,CommonModule],
    templateUrl: './facture.component.html',
    styleUrl: './facture.component.scss',
})
export class FactureComponent implements OnInit {
    @Input() invoice: any;
    @Input() code_facture: any;
    showTvaInput = false;
    showPrecompteInput = false;
    showEcompInput = false;
    showAvanceInput = false;
    settings: any;

    constructor(private appSetting: ApplicationSettingService,){}

    ngOnInit(): void {
        if(this.invoice.TVA > 0) {
            this.showTvaInput = true;
        }
        if(this.invoice.PRECOMPTE > 0) {
            this.showPrecompteInput = true;
        }
        if(this.invoice.ECOMP > 0) {
            this.showEcompInput = true;
        }
        if(this.invoice.avance > 0) {
            this.showAvanceInput = true;
        }

        this.settings = this.appSetting.settings;
    }
}
