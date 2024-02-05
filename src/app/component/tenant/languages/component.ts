import { Component, OnDestroy, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigTenantService } from "../../../service/ConfigTenantService";

@Component({
  selector: "app-tenant-languages",
  templateUrl: "./component.html"
})

export class TenantLanguagesComponent implements OnInit, OnDestroy {

  constructor( public configService: ConfigTenantService, public dialogConfig: DynamicDialogConfig, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    this.configService.suspendSave();
  }

  // Event handler on dialog close
  ngOnDestroy() {
    if( this.configService.configTenant.languages == null || this.configService.configTenant.languages.length < 1 )
      this.configService.configTenant.languages = [ "de" ];
    this.dialogConfig.data.component.setLanguage( this.translateService.currentLang )
    this.configService.saveOnClose();
  }

}
