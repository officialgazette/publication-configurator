import { Component }from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../service/ConfigRootService";
import { MultiLang } from "../../../data/MultiLang";
import { RootRubricsDetailComponent} from "./detail/component";
import { Rubric } from "../../../data/Rubric";

@Component({
  selector: "app-root-rubrics",
  templateUrl: "./component.html"
})

export class RootRubricsComponent {

  private ref!: DynamicDialogRef;

  constructor( public configService: ConfigRootService, public confirmationService: ConfirmationService, public dialogService: DialogService, public translateService: TranslateService ) {}

  // Open dialog showing rubric details
  detail( rubric: Rubric, title: string ): DynamicDialogRef {
    this.ref = this.dialogService.open( RootRubricsDetailComponent, {
      baseZIndex: 10000,
      header: title,
      maximizable: true,
      width: "80%",
      height: "80%",
      data: {
        rubric: rubric
      }
    });
    if( this.configService.maximize )
      this.dialogService.dialogComponentRefMap.get( this.ref )?.instance.maximize();
    this.ref.onMaximize.subscribe( (data) => {
      this.configService.maximize = data.maximized != null && data.maximized;
    });
    return this.ref;
  }

  // Add rubric
  add() {
    let rubric = new Rubric();
    rubric.name = new MultiLang();
    let ref = this.detail( rubric, this.translateService.instant( "ADD_RUBRIC" ));
    ref.onClose.subscribe( (res) => {
      if( rubric.code != null && rubric.code.length > 0 ) {
        this.configService.config.rubrics.push( rubric );
        this.configService.forceSave();
        this.refresh();
      }
    });
  }

  // Edit rubric
  edit( rubric: Rubric ) {
    let ref = this.detail( rubric, this.translateService.instant( "EDIT_RUBRIC" ));
    ref.onClose.subscribe( (res) => {
      this.configService.save();
      this.refresh();
    });
  }

  // Delete rubric after user confirmation
  delete( rubric: Rubric ) {
    this.confirmationService.confirm({
      header: this.translateService.instant( "CONFIRM_DELETE_TITLE" ),
      message: this.translateService.instant( "CONFIRM_DELETE_TEXT", { code: rubric.code } ),
      icon: "pi pi-question-circle",
      acceptLabel: this.translateService.instant( "YES" ),
      rejectLabel: this.translateService.instant( "NO" ),
      accept: () => {
        const index = this.configService.config.rubrics.indexOf( rubric );
        if( index >= 0 )
          this.configService.config.rubrics.splice( index, 1 );
        this.configService.forceSave();
        this.refresh();
      }
    });
  }

  // Force refresh
  refresh() {
    this.configService.config.rubrics = [...this.configService.config.rubrics];
  }

}
