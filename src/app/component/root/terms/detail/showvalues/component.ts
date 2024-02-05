import { Component, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../../../service/ConfigRootService";
import { Term } from "../../../../../data/Term";

@Component({
  selector: "app-root-terms-detail-showvalues",
  templateUrl: "./component.html"
})

export class RootTermsDetailShowValuesComponent implements OnInit {

  term!: Term;
  enumValueTerms: Term[] = [];

  constructor( public configService: ConfigRootService, public dialogConfig: DynamicDialogConfig, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    this.term = this.dialogConfig.data.term;
    this.configService.config.terms.forEach( (enumValueTerm) => {
      if( enumValueTerm.type === "enumValue" && enumValueTerm.parents.includes( this.term.key ))
        this.enumValueTerms.push( enumValueTerm );
    });
  }

}
