import { Component, OnDestroy, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../../service/ConfigRootService";
import { Term } from "../../../../data/Term";

@Component({
  selector: "app-root-terms-move",
  templateUrl: "./component.html"
})

export class RootTermsMoveComponent implements OnInit, OnDestroy {

  term!: Term;
  fromIndex!: number;
  toIndex!: number;

  constructor( public configService: ConfigRootService, public dialogConfig: DynamicDialogConfig, public dialogRef: DynamicDialogRef, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    this.configService.suspendSave();
    this.term = this.dialogConfig.data.term;
    this.fromIndex = this.configService.config.terms.indexOf( this.term ) + 1;
    this.toIndex = this.fromIndex;
  }

  // Event handler on dialog close
  ngOnDestroy() {
    this.configService.saveOnClose();
  }

  // Move terms position
  moveTerm( fromIndex: number, toIndex: number ) {
    const terms = this.configService.config.terms;
    if( toIndex < 1 )
      toIndex = 1;
    if( toIndex > terms.length )
      toIndex = terms.length;
    fromIndex--;
    toIndex--;
    const element = terms[ fromIndex ];
    terms.splice( fromIndex, 1 );
    terms.splice( toIndex, 0, element );
    this.configService.forceSave();
    this.dialogRef.close();
  }

}
