import { Component, OnDestroy, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../../../service/ConfigRootService";
import { Term } from "../../../../../data/Term";

@Component({
  selector: "app-root-terms-detail-pickparents",
  templateUrl: "./component.html"
})

export class RootTermsDetailPickParentsComponent implements OnInit, OnDestroy {

  term!: Term;
  enumTerms: Term[] = [];

  constructor( public configService: ConfigRootService, public dialogConfig: DynamicDialogConfig, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    this.term = this.dialogConfig.data.term;
    this.configService.config.terms.forEach( (enumTerm) => {
      if( enumTerm.valueType === "enum" ) {
        if( this.term.parents.includes( enumTerm.key ))
          enumTerm.assignedParent = true;
        this.enumTerms.push( enumTerm );
      }
    });
  }

  // Event handler on dialog close
  ngOnDestroy() {
    let parents: string[] = [];
    this.enumTerms.forEach( (enumTerm) => {
      if( enumTerm.assignedParent )
        parents.push( enumTerm.key );

    });
    this.term.parents = parents;
  }

}
