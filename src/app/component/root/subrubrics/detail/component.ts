import { Component, OnDestroy, OnInit } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../../service/ConfigRootService";
import { MultiLang } from "../../../../data/MultiLang";
import { RootSubRubricsDetailPickTermsComponent } from "./pickterms/component";
import { RootTermsDetailComponent } from "../../terms/detail/component";
import { SubRubric } from "../../../../data/SubRubric";
import { SubRubricTerm } from "../../../../data/SubRubricTerm";
import { Term } from "../../../../data/Term";

@Component({
  selector: "app-root-subrubrics-detail",
  templateUrl: "./component.html"
})

export class RootSubRubricsDetailComponent implements OnInit, OnDestroy {

  subrubric!: SubRubric;
  terms!: SubRubricTerm[];

  private ref!: DynamicDialogRef;

  constructor( public configService: ConfigRootService, private confirmationService: ConfirmationService, public dialogConfig: DynamicDialogConfig, public dialogService: DialogService, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    this.configService.suspendSave();
    this.subrubric = this.dialogConfig.data.subrubric;
    this.terms = [];
    for( let i = 0; i < this.configService.config.terms.length; i++ ) {
      let term = this.configService.config.terms[i];
      for( let j = 0; j < this.subrubric.terms.length; j++ ) {
        let subRubricTerm = this.subrubric.terms[j];
        if( subRubricTerm.key == term.key ) {
          subRubricTerm.term = term;
          this.terms.push( subRubricTerm );
          break;
        }
      }
    }
  }

  // Event handler on dialog close
  ngOnDestroy() {
    this.subrubric.terms = this.terms;
    this.configService.saveOnClose();
  }

  // Open dialog to select terms
  pickTerms() {
    this.ref = this.dialogService.open( RootSubRubricsDetailPickTermsComponent, {
      baseZIndex: 10000,
      header: this.translateService.instant( "ADD_REMOVE_TERMS" ),
      maximizable: true,
      width: "70%",
      height: "70%",
      styleClass: "pickterms",
      data: {
        subrubric: this.subrubric,
        terms: this.terms
      }
    });
    if( this.configService.maximize )
      this.dialogService.dialogComponentRefMap.get( this.ref )?.instance.maximize();
    this.ref.onMaximize.subscribe( (data) => {
      this.configService.maximize = data.maximized != null && data.maximized;
    });
    return this.ref;
  }

  // Open dialog to edit term
  editTerm( term: Term ) {
    this.ref = this.dialogService.open( RootTermsDetailComponent, {
      baseZIndex: 10000,
      header: this.translateService.instant( "EDIT_TERM" ),
      maximizable: true,
      width: "70%",
      height: "70%",
      styleClass: "term",
      data: {
        term: term
      }
    });
    if( this.configService.maximize )
      this.dialogService.dialogComponentRefMap.get( this.ref )?.instance.maximize();
    this.ref.onMaximize.subscribe( (data) => {
      this.configService.maximize = data.maximized != null && data.maximized;
    });
    return this.ref;
  }

  // Remove term after user confirmation
  removeTerm( term: SubRubricTerm ) {
    this.confirmationService.confirm({
      header: this.translateService.instant( "CONFIRM_DELETE_TITLE" ),
      message: this.translateService.instant( "CONFIRM_DELETE_TEXT", { code: MultiLang.translate( term.term.term, this.translateService.currentLang ) } ),
      icon: "pi pi-question-circle",
      acceptLabel: this.translateService.instant( "YES" ),
      rejectLabel: this.translateService.instant( "NO" ),
      accept: () => {
        let index = this.terms.indexOf( term );
        if( index >= 0 ) {
          this.terms.splice( index, 1 );
        }
      }
    });
  }

  // Only one term can be primary, remove primary status from all others
  setUniquePrimary( term: SubRubricTerm ) {
    if( term.primary ) {
      this.terms.forEach( (term2) => {
        if( term2.key !== term.key && term2.primary )
          term2.primary = false;
      });
    }
  }

}
