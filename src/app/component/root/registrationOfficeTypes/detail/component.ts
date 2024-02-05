import { Component, OnDestroy, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../../service/ConfigRootService";
import { RegistrationOfficeType } from "../../../../data/RegistrationOfficeType";

@Component({
  selector: "app-root-registrationOfficeTypes-detail",
  templateUrl: "./component.html"
})

export class RootRegistrationOfficeTypesDetailComponent implements OnInit, OnDestroy {

  registrationOfficeType!: RegistrationOfficeType;

  constructor( public configService: ConfigRootService, public dialogConfig: DynamicDialogConfig, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    this.configService.suspendSave();
    this.registrationOfficeType = this.dialogConfig.data.registrationOfficeType;
  }

  // Event handler on dialog close
  ngOnDestroy() {
    this.configService.saveOnClose();
  }

}
