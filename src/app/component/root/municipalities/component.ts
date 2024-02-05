import { Component, ViewChild } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Dropdown } from "primeng/dropdown";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../service/ConfigRootService";
import { MultiLang } from "../../../data/MultiLang";
import { Municipality } from "../../../data/Municipality";
import { RootMunicipalitiesDetailComponent } from "./detail/component";
import { RootMunicipalitiesImportComponent } from "./import/component";

@Component({
  selector: "app-root-municipalities",
  templateUrl: "./component.html"
})

export class RootMunicipalitiesComponent {

  @ViewChild( "cantonFilter" ) cantonFilter!: Dropdown;

  private ref!: DynamicDialogRef;

  constructor( public configService: ConfigRootService, public confirmationService: ConfirmationService, public dialogService: DialogService, public translateService: TranslateService ) {}

  // Open dialog showing municipality details
  detail( municipality: Municipality, title: string ): DynamicDialogRef {
    this.ref = this.dialogService.open( RootMunicipalitiesDetailComponent, {
      baseZIndex: 10000,
      header: title,
      maximizable: true,
      width: "80%",
      height: "80%",
      styleClass: "term",
      data: {
        municipality: municipality
      }
    });
    if( this.configService.maximize )
      this.dialogService.dialogComponentRefMap.get( this.ref )?.instance.maximize();
    this.ref.onMaximize.subscribe( (data) => {
      this.configService.maximize = data.maximized != null && data.maximized;
    });
    return this.ref;
  }

  // Add municipality
  add() {
    let municipality = new Municipality();
    municipality.term = new MultiLang();
    let ref = this.detail( municipality, this.translateService.instant( "ADD_MUNICIPALITY" ));
    ref.onClose.subscribe( (res) => {
      if( municipality.key != null && municipality.key.length > 0 ) {
        this.configService.config.municipalities.push( municipality );
        this.configService.forceSave();
        this.refresh();
      }
    });
  }

  // Edit municipality
  edit( municipality: Municipality ) {
    this.detail( municipality, this.translateService.instant( "EDIT_MUNICIPALITY" ));
  }

  // Delete municipality after user confirmation
  delete( municipality: Municipality ) {
    this.confirmationService.confirm({
      header: this.translateService.instant( "CONFIRM_DELETE_TITLE" ),
      message: this.translateService.instant( "CONFIRM_DELETE_TEXT", { code: municipality.key } ),
      icon: "pi pi-question-circle",
      acceptLabel: this.translateService.instant( "YES" ),
      rejectLabel: this.translateService.instant( "NO" ),
      accept: () => {
        const index = this.configService.config.municipalities.indexOf( municipality );
        if( index >= 0 )
          this.configService.config.municipalities.splice( index, 1 );
        this.configService.forceSave();
        this.refresh();
      }
    });
  }

  // Open dialog for CSV import of municipalities
  import(): DynamicDialogRef {
    this.ref = this.dialogService.open( RootMunicipalitiesImportComponent, {
      baseZIndex: 10000,
      header: this.translateService.instant( "IMPORT_MUNICIPALITIES" ),
      maximizable: true,
      width: "80%",
      height: "80%",
      styleClass: "term",
      data: {
        dialogRef: this.ref
      }
    });
    if( this.configService.maximize )
      this.dialogService.dialogComponentRefMap.get( this.ref )?.instance.maximize();
    this.ref.onMaximize.subscribe( (data) => {
      this.configService.maximize = data.maximized != null && data.maximized;
    });
    this.ref.onClose.subscribe( () => {
      this.refresh();
    });
    return this.ref;
  }

  // Force refresh
  refresh() {
    this.configService.config.municipalities = [...this.configService.config.municipalities];
  }

}
