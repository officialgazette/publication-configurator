import { Component, OnDestroy, OnInit } from "@angular/core";
import { DialogService, DynamicDialogConfig } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../../service/ConfigRootService";
import { RootTermsDetailPickParentsComponent } from "./pickparents/component";
import { RootTermsDetailShowValuesComponent } from "./showvalues/component";
import { Term } from "../../../../data/Term";
import { TermSubRubric } from "../../../../data/TermSubRubric";

@Component({
  selector: "app-root-term-detail",
  templateUrl: "./component.html"
})

export class RootTermsDetailComponent implements OnInit, OnDestroy {

  term!: Term;
  subrubrics: TermSubRubric[] = [];

  constructor( public configService: ConfigRootService, public dialogConfig: DynamicDialogConfig, public dialogService: DialogService, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    this.configService.suspendSave();
    this.term = this.dialogConfig.data.term;
    this.configService.config.subrubrics.forEach( (subrubric) => {
      subrubric.terms.forEach( (term) => {
        if( this.term.key === term.key ) {
          let termSubRubric = new TermSubRubric();
          termSubRubric.subrubric = subrubric;
          termSubRubric.primary = term.primary;
          termSubRubric.required = term.required;
          termSubRubric.editable = term.editable;
          this.subrubrics.push( termSubRubric );
        }
      });
    });
  }

  // Event handler on dialog close
  ngOnDestroy() {
    this.configService.saveOnClose();
  }

  // Open dialog to select parents
  pickParents() {
    return this.dialogService.open( RootTermsDetailPickParentsComponent, {
      baseZIndex: 10000,
      header: this.translateService.instant( "ADD_REMOVE_PARENTS" ),
      maximizable: true,
      width: "70%",
      height: "70%",
      styleClass: "pickterms",
      data: {
        term: this.term
      }
    });
  }

  // Open dialog to show values
  showValues() {
    return this.dialogService.open( RootTermsDetailShowValuesComponent, {
      baseZIndex: 10000,
      header: this.translateService.instant( "SHOW_VALUES" ),
      maximizable: true,
      width: "70%",
      height: "70%",
      styleClass: "pickterms",
      data: {
        term: this.term
      }
    });
  }

  // Returns true if value is empty or null
  isEmpty( value: any ) {
    return value == null || value.length < 1;
  }

}
