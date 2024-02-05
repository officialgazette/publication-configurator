import { Component, OnDestroy, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../../../service/ConfigRootService";
import { SubRubric } from "../../../../../data/SubRubric";
import { SubRubricTerm } from "../../../../../data/SubRubricTerm";
import { Term } from "../../../../../data/Term";

@Component({
  selector: "app-root-subrubrics-detail-pickterms",
  templateUrl: "./component.html"
})

export class RootSubRubricsDetailPickTermsComponent implements OnInit, OnDestroy {

  subrubric!: SubRubric;
  terms!: SubRubricTerm[];

  constructor( public configService: ConfigRootService, public dialogConfig: DynamicDialogConfig, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    this.subrubric = this.dialogConfig.data.subrubric;
    this.terms = this.dialogConfig.data.terms;
    this.configService.config.terms.forEach( (term) => {
      term.assigned = false;
      for( let term2 of this.terms ) {
        if( term2.key == term.key ) {
          term.assigned = true;
          break;
        }
      }
    });
  }

  // Event handler on dialog close
  ngOnDestroy() {
    let oldTerms = Object.assign( [], this.terms );
    this.terms.length = 0;
    this.configService.config.terms.forEach( (term) => {
      if( term.assigned ) {
        let subRubricTerm = this.getSubRubricTerm( term, oldTerms );
        if( subRubricTerm == null ) {
          subRubricTerm = new SubRubricTerm();
          subRubricTerm.key = term.key;
          subRubricTerm.term = term;
        }
        this.terms.push( subRubricTerm );
      }
    });
  }

  // Get subrubric term from specified list
  private getSubRubricTerm( term: Term, terms: SubRubricTerm[] ): SubRubricTerm | null {
    for( let term2 of terms ) {
      if( term2.key == term.key )
        return term2;
    }
    return null;
  }

}
