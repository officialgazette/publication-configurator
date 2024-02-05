import { Component, OnDestroy, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../../service/ConfigRootService";
import { Rubric } from "../../../../data/Rubric";

@Component({
  selector: "app-root-rubrics-detail",
  templateUrl: "./component.html"
})

export class RootRubricsDetailComponent implements OnInit, OnDestroy {

  rubric!: Rubric;

  constructor( public configService: ConfigRootService, public dialogConfig: DynamicDialogConfig, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    this.configService.suspendSave();
    this.rubric = this.dialogConfig.data.rubric;
  }

  // Event handler on dialog close
  ngOnDestroy() {
    this.configService.saveOnClose();
  }

}
