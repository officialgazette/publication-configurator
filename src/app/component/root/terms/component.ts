import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Dropdown } from "primeng/dropdown";
import { Table, TableRowReorderEvent } from "primeng/table";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../service/ConfigRootService";
import { RootTermsDetailComponent } from "./detail/component";
import { RootTermsMoveComponent } from "./move/component";
import { Term } from "../../../data/Term";

@Component({
  selector: "app-root-terms",
  templateUrl: "./component.html"
})

export class RootTermsComponent implements AfterViewInit{

  @ViewChild( "table" ) table!: Table;
  @ViewChild( "typeFilter" ) typeFilter!: Dropdown;
  @ViewChild( "valueTypeFilter" ) valueTypeFilter!: Dropdown;

  private ref!: DynamicDialogRef;

  constructor( public configService: ConfigRootService, public confirmationService: ConfirmationService, public dialogService: DialogService, public translateService: TranslateService ) {}

  // Event handler when view initializes
  ngAfterViewInit() {
    if( this.table != null ) {
      this.table.resetScrollTop = function() { }
    }
  }

  // Event handler when table rows are reordered
  onRowReorder( event: TableRowReorderEvent ) {
    this.configService.delaySave();
    this.refresh();
  }

  // Open dialog to show terms configuration
  detail( term: Term, title: string ) {
    this.ref = this.dialogService.open( RootTermsDetailComponent, {
      baseZIndex: 10000,
      header: title,
      maximizable: true,
      width: "80%",
      height: "80%",
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

  // Add term
  add( beforeTerm: Term | null ) {
    let term = new Term();
    let ref = this.detail( term, this.translateService.instant( "ADD_TERM" ));
    ref.onClose.subscribe( (res) => {
      if( term.key != null && term.key.length > 0 ) {
        if( beforeTerm != null )
          this.configService.config.terms.splice( this.configService.config.terms.indexOf( beforeTerm ), 0, term );
        else
          this.configService.config.terms.push( term );
        this.configService.forceSave();
        this.refresh();
      }
    });
  }

  // Edit term
  edit( term: Term ) {
    this.detail( term, this.translateService.instant( "EDIT_TERM" ));
  }

  // Delete subrubric mapping after user confirmation
  delete( term: Term ) {
    this.confirmationService.confirm({
      header: this.translateService.instant( "CONFIRM_DELETE_TITLE" ),
      message: this.translateService.instant( "CONFIRM_DELETE_TEXT", { code: term.key } ),
      icon: "pi pi-question-circle",
      acceptLabel: this.translateService.instant( "YES" ),
      rejectLabel: this.translateService.instant( "NO" ),
      accept: () => {
        const index = this.configService.config.terms.indexOf( term );
        if( index >= 0 )
          this.configService.config.terms.splice( index, 1 );
        this.configService.forceSave();
        this.refresh();
      }
    });
  }

  // Move term dialog
  move( term: Term ) {
    this.dialogService.open( RootTermsMoveComponent, {
      baseZIndex: 10000,
      header: this.translateService.instant( "MOVE_TERM" ),
      maximizable: false,
      width: "32rem",
      height: "14rem",
      data: {
        term: term,
      }
    });
  }

  // Force refresh
  refresh() {
    this.configService.config.terms = [...this.configService.config.terms];
  }

}
