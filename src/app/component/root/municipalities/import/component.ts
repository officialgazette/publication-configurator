import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { NgxCsvParser, NgxCSVParserError } from "ngx-csv-parser";
import { TranslateService } from "@ngx-translate/core";

import { ConfigRootService } from "../../../../service/ConfigRootService";
import { Municipality } from "../../../../data/Municipality";

@Component({
  selector: "app-root-municipalities-detail",
  templateUrl: "./component.html"
})

export class RootMunicipalitiesImportComponent implements OnInit, OnDestroy {

  @ViewChild( "summary" ) summary!: ElementRef;

  municipalities: Municipality[] = [];
  newCount = 0;
  updateCount = 0;

  private importElement?: HTMLInputElement;

  constructor( private ngxCsvParser: NgxCsvParser, public configService: ConfigRootService, public dialogConfig: DynamicDialogConfig, public dialogRef: DynamicDialogRef, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    this.configService.suspendSave();
  }

  // Event handler on dialog close
  ngOnDestroy() {
    this.configService.saveOnClose();
  }

  // Load CSV from file
  loadCSV() {
    let input:HTMLInputElement;
    if( this.importElement !== undefined ) {
      try {
        document.body.removeChild( this.importElement );
        this.importElement.remove();
      } catch {};
    }
    this.importElement = document.createElement( 'input' );
    input = this.importElement;
    input.type = 'file';
    input.multiple = false;
    input.style.display = 'none';
    document.body.appendChild( input );
    const component = this;
    input.onchange = function( event:Event ) {
      let files = input.files as FileList;
      if( files.length > 0 ) {
        const file = files.item( 0 );
        if( file !== null ) {
          try {
            component.processCSV( file );
          } catch {
            alert( "An error occurred during import!" );
          }
        }
      }
      document.body.removeChild( input );
      input.remove();
    }
    input.click()
  }

  // Process CSV
  private processCSV( file: File ) {
    this.ngxCsvParser.parse( file, { header: false, delimiter: ";", encoding: "utf8" } ).pipe().subscribe({
      next: (result): void => {
        this.processRecords( result );
      },
      error: (error: NgxCSVParserError): void => {
        console.log( "Error", error );
      }
    });
  }

  // Process each record of the imported CSV and add it to the import list
  private processRecords( records: any[] | NgxCSVParserError ) {
    this.municipalities = [];
    this.newCount = 0;
    this.updateCount = 0;
    if( !( records instanceof NgxCSVParserError )) {
      records.forEach( (record) => {
        if( Array.isArray( record ) && record.length >= 6 ) {
          // Create municipality object and map data from CSV to corresponding fields
          const municipality = new Municipality();
          if( !this.isEmpty( record[4]) ) {
            municipality.key = record[4].trim();
            if( !this.isEmpty( record[0] )) municipality.term.de = record[0];
            if( !this.isEmpty( record[1] )) municipality.term.fr = record[1];
            if( !this.isEmpty( record[2] )) municipality.term.it = record[2];
            if( !this.isEmpty( record[3] )) municipality.term.en = record[3];
            if( !this.isEmpty( record[5] )) municipality.cantons = [record[5].toUpperCase()];
            if( this.configService.getMunicipality( municipality.key ) != null ) {
              municipality.update = true;
              this.updateCount++
            } else
              this.newCount++;
            this.municipalities.push( municipality );
          }
        }
      });
    }
    this.summary.nativeElement.style.display = "flex";
  }

  // Import municipalities from prepared list
  import() {
    this.configService.delaySave();
    this.municipalities.forEach( (municipality) => {
      if( municipality.update ) {
        const existing = this.configService.getMunicipality( municipality.key );
        if( existing != null ) {
          if( !this.isEmpty( municipality.term.de )) existing.term.de = municipality.term.de;
          if( !this.isEmpty( municipality.term.fr )) existing.term.fr = municipality.term.fr;
          if( !this.isEmpty( municipality.term.it )) existing.term.it = municipality.term.it;
          if( !this.isEmpty( municipality.term.en )) existing.term.en = municipality.term.en;
          existing.cantons = [...new Set( existing.cantons.concat( municipality.cantons ))].sort();
        }
      } else {
        this.configService.config.municipalities.push( municipality );
      }
    });
    this.dialogRef.close();
  }

  // Returns true if value is empty or null
  private isEmpty( value: string ) {
    return value == null || value.length < 1;
  }

}
