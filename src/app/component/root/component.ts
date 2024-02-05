import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { lastValueFrom } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../service/ConfigRootService";
import { Municipality } from "../../data/Municipality";
import { Rubric } from "../../data/Rubric";
import { SubRubric } from "../../data/SubRubric";
import { SubRubricTerm } from "../../data/SubRubricTerm";

@Component({
  selector: "app-root",
  templateUrl: "./component.html",
  providers: [ ConfirmationService, DialogService ]
})

export class RootComponent implements OnInit {

  activeTab!: number;
  menuItems!: MenuItem[];

  private importElement?: HTMLInputElement;

  constructor( public configService: ConfigRootService, public confirmationService: ConfirmationService, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    window.document.title = "Terms UI - Root Editor";
    this.activeTab = 1;
    this.menu().then();
    this.configService.load( null );
    setInterval( ()=> {
      if( !this.configService.isSuspendSave() )
        this.configService.save();
    }, 5000 );
  }

  // Menu
  async menu() {
    await lastValueFrom( this.translateService.get( "FILE" )).then();
    this.menuItems = [
      {
        label: this.translateService.instant( "FILE" ),
        styleClass: "menu",
        icon: "pi pi-fw pi-file",
        items: [
          { label: this.translateService.instant( "NEW" ), styleClass: "menublue", icon: "pi pi-fw pi-file-edit", command: (event) => { this.newFile(); }},
          { label: this.translateService.instant( "IMPORT" ), styleClass: "menublue", icon: "pi pi-fw pi-file-import", command: (event) => { this.importFile(); }},
          { label: this.translateService.instant( "EXPORT" ), styleClass: "menublue", icon: "pi pi-fw pi-file-export", command: (event) => { this.exportFile(); }}
        ]
      },
      {
        label: this.translateService.instant( "RUBRICS" ),
        styleClass: this.activeTab === 0 ? "activeTab" : "",
        command: (event) => { this.activateTab( 0 ); }
      },
      {
        label: this.translateService.instant( "PUBLICATION_TYPES" ),
        styleClass: this.activeTab === 1 ? "activeTab" : "",
        command: (event) => { this.activateTab( 1 ); }
      },
      {
        label: this.translateService.instant( "ELEMENTS" ),
        styleClass: this.activeTab === 2 ? "activeTab" : "",
        command: (event) => { this.activateTab( 2 );  }
      },
      {
        label: this.translateService.instant( "MUNICIPALITIES" ),
        styleClass: this.activeTab === 3 ? "activeTab" : "",
        command: (event) => { this.activateTab( 3 );  }
      },
      {
        label: this.translateService.instant( "REGISTRATION_OFFICE_TYPES" ),
        styleClass: this.activeTab === 4 ? "activeTab" : "",
        command: (event) => { this.activateTab( 4 ); }
      },
    ];
  }

  // Get list of languages for tenant
  setLanguage( language: string ) {
    localStorage.setItem( "language", language );
    this.translateService.use( language );
    this.menu().then();
  }

  // Activate specified tab
  private activateTab( id: number ) {
    this.activeTab = id;
    this.menu().then();
  }

  // Create new file and let user confirm
  private newFile() {
    this.confirmationService.confirm({
      header: this.translateService.instant( "CONFIRM_NEW_TITLE" ),
      message: this.translateService.instant( "CONFIRM_NEW_TEXT" ),
      icon: "pi pi-question-circle",
      acceptLabel: this.translateService.instant( "YES" ),
      rejectLabel: this.translateService.instant( "NO" ),
      accept: () => {
        this.configService.reset();
        this.configService.load( null );
      }
    });
  }

  // Import a configuration file and load it browser storage and engine
  private importFile() {
    let input: HTMLInputElement;
    if( this.importElement != null ) {
      try {
        document.body.removeChild( this.importElement );
        this.importElement.remove();
      } catch {}
    }
    this.importElement = document.createElement( "input" );
    input = this.importElement;
    input.type = "file";
    input.multiple = false;
    input.style.display = "none";
    document.body.appendChild( input );
    const component = this;
    input.onchange = function( event: Event ) {
      let files = input.files as FileList;
      if( files.length > 0 ) {
        const file = files.item( 0 );
        if( file !== null ) {
          file.text().then( (json) => {
            try {
              component.configService.load( json );
            } catch {
              alert( "An error occurred during import!" );
            }
          });
        }
      }
      document.body.removeChild( input );
      input.remove();
    }
    input.click()
  }

  // Export current configuration into a file
  private exportFile() {
    this.configService.config.rubrics.sort( Rubric.sort );
    this.configService.config.subrubrics.sort( SubRubric.sort )
    this.configService.config.subrubrics.forEach( (subRubric) => {
      subRubric.terms.sort( SubRubricTerm.sort )
    });
    this.configService.config.municipalities.sort( Municipality.sort );
    this.configService.save();
    const config = localStorage.getItem( "configRoot" );
    if( config != null ) {
      const json = JSON.stringify( JSON.parse( config ), null, 2 );
      // Create a temporary element to attach the download to
      const a = document.createElement( "a" );
      a.setAttribute( "href", "data:application/json;charset=UTF-8," + encodeURIComponent( json ));
      a.setAttribute( "download", "root.json" );
      a.style.display = "none";
      document.body.appendChild( a );
      a.click();
      document.body.removeChild( a );
    }
  }

}
