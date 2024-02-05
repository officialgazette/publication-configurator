import { Component } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";
import { Expose, Type } from "class-transformer";

import { ConfigRootService } from "../../../service/ConfigRootService";
import { MultiLang } from "../../../data/MultiLang";
import { RootSubRubricsDetailComponent } from "./detail/component";
import { SubRubric } from "../../../data/SubRubric";
import { SubRubricInfo } from "../../../data/SubRubricInfo";
import { PublicDuration } from "../../../data/PublicDuration";
import { SubRubricTerm } from "../../../data/SubRubricTerm";

@Component({
  selector: "app-root-subrubrics",
  templateUrl: "./component.html"
})

export class RootSubRubricsComponent {

  private ref!: DynamicDialogRef;

  constructor( public configService: ConfigRootService, public confirmationService: ConfirmationService, public dialogService: DialogService, public translateService: TranslateService ) {}

  // Open dialog showing subrubric details
  detail( subrubric: SubRubric, title: string ): DynamicDialogRef {
    this.ref = this.dialogService.open( RootSubRubricsDetailComponent, {
      baseZIndex: 10000,
      header: title,
      maximizable: true,
      width: "80%",
      height: "80%",
      styleClass: "subrubric",
      data: {
        subrubric: subrubric
      }
    });
    if( this.configService.maximize )
      this.dialogService.dialogComponentRefMap.get( this.ref )?.instance.maximize();
    this.ref.onMaximize.subscribe( (data) => {
      this.configService.maximize = data.maximized != null && data.maximized;
    });
    return this.ref;
  }

  // Add subrubric
  add() {
    let subrubric = new SubRubric();
    subrubric.name = new MultiLang();
    let ref = this.detail( subrubric, this.translateService.instant( "ADD_SUBRUBRIC" ));
    ref.onClose.subscribe( (res) => {
      if( subrubric.code != null && subrubric.code.length > 0 ) {
        this.configService.config.subrubrics.push( subrubric );
        this.configService.forceSave();
        this.refresh();
      }
    });
  }

  // Copy subrubric (create clone)
  copy( source: SubRubric ) {
    let subrubric = new SubRubric();
    subrubric.name = MultiLang.clone( source.name );
    subrubric.exampleUrl = source.exampleUrl;
    subrubric.info = new SubRubricInfo();
    subrubric.info.publicDuration = Object.assign( {}, source.info.publicDuration ) as PublicDuration;
    subrubric.info.authorization = Object.assign([], source.info.authorization ) as string[];
    subrubric.info.legalNotice = MultiLang.clone( source.info.legalNotice );
    source.terms.forEach( term => subrubric.terms.push( Object.assign( {}, term ) as SubRubricTerm ));
    let ref = this.detail( subrubric, this.translateService.instant( "COPY_SUBRUBRIC" ));
    ref.onClose.subscribe( (res) => {
      if( subrubric.code != null && subrubric.code.length > 0 ) {
        this.configService.config.subrubrics.push( subrubric );
        this.configService.forceSave();
        this.refresh();
      }
    });
  }

  // Edit subrubric
  edit( subrubric: SubRubric ) {
    this.detail( subrubric, this.translateService.instant( "EDIT_SUBRUBRIC" ));
  }

  // Delete subrubric after user confirmation
  delete( subrubric: SubRubric ) {
    this.confirmationService.confirm({
      header: this.translateService.instant( "CONFIRM_DELETE_TITLE" ),
      message: this.translateService.instant( "CONFIRM_DELETE_TEXT", { code: subrubric.code } ),
      icon: "pi pi-question-circle",
      acceptLabel: this.translateService.instant( "YES" ),
      rejectLabel: this.translateService.instant( "NO" ),
      accept: () => {
        const index = this.configService.config.subrubrics.indexOf( subrubric );
        if( index >= 0 )
          this.configService.config.subrubrics.splice( index, 1 );
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
    this.configService.config.subrubrics = [...this.configService.config.subrubrics];
  }

}
