import { Component, ViewChild } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../service/ConfigRootService";
import { MultiLang } from "../../../data/MultiLang";
import { RegistrationOfficeType } from "../../../data/RegistrationOfficeType";
import { RootRegistrationOfficeTypesDetailComponent } from "./detail/component";
import { Table, TableRowReorderEvent } from "primeng/table";

@Component({
  selector: "app-root-registrationOfficeTypes",
  templateUrl: "./component.html"
})

export class RootRegistrationOfficeTypesComponent {

  @ViewChild( "table" ) table!: Table;

  private ref!: DynamicDialogRef;

  constructor( public configService: ConfigRootService, public confirmationService: ConfirmationService, public dialogService: DialogService, public translateService: TranslateService ) {}

  // Open dialog showing registration office types details
  detail( registrationOfficeType: RegistrationOfficeType, title: string ): DynamicDialogRef {
    this.ref = this.dialogService.open( RootRegistrationOfficeTypesDetailComponent, {
      baseZIndex: 10000,
      header: title,
      maximizable: true,
      width: "80%",
      height: "80%",
      data: {
        registrationOfficeType: registrationOfficeType
      }
    });
    if( this.configService.maximize )
      this.dialogService.dialogComponentRefMap.get( this.ref )?.instance.maximize();
    this.ref.onMaximize.subscribe( (data) => {
      this.configService.maximize = data.maximized != null && data.maximized;
    });
    return this.ref;
  }

  // Add registration office type
  add() {
    let registrationOfficeType = new RegistrationOfficeType();
    registrationOfficeType.name = new MultiLang();
    let ref = this.detail( registrationOfficeType, this.translateService.instant( "ADD_REGISTRATION_OFFICE_TYPE" ));
    ref.onClose.subscribe( (res) => {
      if( registrationOfficeType.code != null && registrationOfficeType.code.length > 0 ) {
        this.configService.config.authorizationRegistrationOfficeTypes.push(registrationOfficeType);
        this.configService.forceSave();
        this.refresh();
      }
    });
  }

  // Edit registration office type
  edit( registrationOfficeType: RegistrationOfficeType ) {
    this.detail( registrationOfficeType, this.translateService.instant( "EDIT_REGISTRATION_OFFICE_TYPE" ));
  }

  // Delete registration office type after user confirmation
  delete( registrationOfficeType: RegistrationOfficeType ) {
    this.confirmationService.confirm({
      header: this.translateService.instant( "CONFIRM_DELETE_TITLE" ),
      message: this.translateService.instant( "CONFIRM_DELETE_TEXT", { code: registrationOfficeType.code } ),
      icon: "pi pi-question-circle",
      acceptLabel: this.translateService.instant( "YES" ),
      rejectLabel: this.translateService.instant( "NO" ),
      accept: () => {
        const index = this.configService.config.authorizationRegistrationOfficeTypes.indexOf( registrationOfficeType );
        if( index >= 0 )
          this.configService.config.authorizationRegistrationOfficeTypes.splice( index, 1 );
        this.configService.forceSave();
        this.refresh();
      }
    });
  }

  // Event handler when table rows are reordered
  onRowReorder( event: TableRowReorderEvent ) {
    this.configService.delaySave();
    this.refresh();
  }

  // Force refresh
  refresh() {
    this.configService.config.authorizationRegistrationOfficeTypes = [...this.configService.config.authorizationRegistrationOfficeTypes];
  }

}
