import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Table } from "primeng/table";
import { TranslateService } from "@ngx-translate/core";

import { ConfigTenant } from "../../../data/ConfigTenant";
import { ConfigTenantService } from "../../../service/ConfigTenantService";
import { MultiLang } from "../../../data/MultiLang";
import { SubRubricMapping } from "../../../data/SubRubricMapping";
import { TenantSubRubricDetailComponent } from "./detail/component";

@Component({
  selector: "app-tenant-subrubrics",
  templateUrl: "./component.html"
})

export class TenantSubRubricComponent implements OnDestroy, AfterViewInit {

  config!: ConfigTenant;

  protected readonly MultiLang = MultiLang;

  private ref!: DynamicDialogRef;

  @ViewChild( "table" ) table!: Table;

  constructor( public configService: ConfigTenantService, public confirmationService: ConfirmationService, public dialogService: DialogService, public translateService: TranslateService ) {
    this.configService.selectedRubricCodesSubject.subscribe( (selectedRubricCodes) => {
      const filters: any[] = [];
      if( selectedRubricCodes != null ) {
        selectedRubricCodes.forEach( (code) => {
          filters.push( { value: code, matchMode: "equals", operator: "or" } );
        });
        this.table.filters[ "template.rubric" ] = filters;
        this.table._filter();
      } else
        this.table.reset();
    });
  }

  // Event handler when view initializes
  ngAfterViewInit() {
    if( this.table != null )
      this.table.resetScrollTop = function(){};
  }

  // Event handler on dialog close
  ngOnDestroy() {
    if( this.ref )
      this.ref.close();
  }

  // Open dialog to show subrubric mapping configuration
  detail( subRubricConfig: SubRubricMapping ) {
    const title = this.getSubRubricCodeOrSubstitute( subRubricConfig.map, subRubricConfig.template.code ) + " - "
      + MultiLang.translateWithPlaceholder( subRubricConfig.name, subRubricConfig.template.name, this.translateService.currentLang );
    this.ref = this.dialogService.open( TenantSubRubricDetailComponent, {
      baseZIndex: 10000,
      header: title,
      maximizable: true,
      width: "80%",
      height: "80%",
      data: {
        subrubric: subRubricConfig
      }
    });
    if( this.configService.maximize )
      this.dialogService.dialogComponentRefMap.get( this.ref )?.instance.maximize();
    this.ref.onMaximize.subscribe( (data) => {
      this.configService.maximize = data.maximized != null && data.maximized;
    });
    return this.ref;
  }

  // Add subrubric mapping, allow one subrubric to be mapped multiple times (using different codes)
  add( subRubricConfig: SubRubricMapping ) {
    if( subRubricConfig.use == null ) {
      subRubricConfig.use = subRubricConfig.template.code;
      this.configService.fixSubRubricConfig( subRubricConfig );
    } else {
      let newSubRubricConfig = new SubRubricMapping();
      newSubRubricConfig.use = subRubricConfig.template.code;
      newSubRubricConfig.template = subRubricConfig.template;
      this.configService.fixSubRubricConfig( newSubRubricConfig );
      this.configService.configTenant.subrubrics.push( newSubRubricConfig );
    }
    this.configService.forceSave();
    this.refresh();
  }

  // Delete subrubric mapping after user confirmation
  delete( subRubricConfig: SubRubricMapping ) {
    this.confirmationService.confirm({
      header: this.translateService.instant( "CONFIRM_DELETE_TITLE" ),
      message: this.translateService.instant( "CONFIRM_DELETE_TEXT", { code: this.getSubRubricCodeOrSubstitute( subRubricConfig.map, subRubricConfig.template.code ) } ),
      icon: "pi pi-question-circle",
      acceptLabel: this.translateService.instant( "YES" ),
      rejectLabel: this.translateService.instant( "NO" ),
      accept: () => {
        let count = 0;
        this.configService.configTenant.subrubrics.forEach( (subrubric) => {
          if( subrubric.template === subRubricConfig.template )
            count++;
        });
        const index = this.configService.configTenant.subrubrics.indexOf( subRubricConfig );
        if( index >= 0 )
          this.configService.configTenant.subrubrics.splice( index, 1 );
        if( count < 2 ) {
          let newSubRubricConfig = new SubRubricMapping();
          newSubRubricConfig.template = subRubricConfig.template;
          this.configService.configTenant.subrubrics.push( newSubRubricConfig );
        }
        this.configService.forceSave();
        this.refresh();
      }
    });
  }

  // Open example publication
  preview( url: string ) {
    window.open( url, "_blank" );
  }

  // Force refresh
  refresh() {
    this.configService.configTenant.subrubrics = [...this.configService.configTenant.subrubrics];
  }

  // Get subrubric code and substitute if requested
  getSubRubricCodeOrSubstitute( value: string, substitute: string ) {
    if( value != null && value.length > 0 )
      return value;
    return substitute.replace( /(..)-..([0-9][0-9])/, "$1-" + this.configService.tenant.code + "$2" );
  }

  // Fix mapped subrubric code so prefix matches tenant code
  fixCode( subRubricConfig: SubRubricMapping ) {
    if( subRubricConfig.map != null )
      subRubricConfig.map = subRubricConfig.map.toUpperCase().replace( /(..)-..([0-9][0-9])/, "$1-" + this.configService.tenant.code + "$2" );
  }

  // Returns true if value is empty or null
  isEmpty( value: any ) {
    return value == null || value.length < 1;
  }

  // Returns true if subrubric code is unique within configuration
  isUnique( code: string ) {
    let count = 0;
    for( let i = 0; i < this.configService.configTenant.subrubrics.length; i ++ ) {
      const subRubricConfig = this.configService.configTenant.subrubrics[i];
      if( this.getSubRubricCodeOrSubstitute( subRubricConfig.map, subRubricConfig.template.code ) === code ) {
        count++;
        if( count > 1 )
          return false;
      }
    }
    return true;
  }

}
