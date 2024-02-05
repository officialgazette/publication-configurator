import { Component, OnDestroy, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../../service/ConfigRootService";
import { Municipality } from "../../../../data/Municipality";

@Component({
  selector: "app-root-municipalities-detail",
  templateUrl: "./component.html"
})

export class RootMunicipalitiesDetailComponent implements OnInit, OnDestroy {

  municipality!: Municipality;

  constructor( public configService: ConfigRootService, public dialogConfig: DynamicDialogConfig, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    this.configService.suspendSave();
    this.municipality = this.dialogConfig.data.municipality;
  }

  // Event handler on dialog close
  ngOnDestroy() {
    this.configService.saveOnClose();
  }

}
