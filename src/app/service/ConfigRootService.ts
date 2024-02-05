import { Injectable } from "@angular/core";
import { instanceToPlain, plainToInstance } from "class-transformer";

import { ConfigRoot } from "../data/ConfigRoot";

@Injectable({
  providedIn: "root"
})

export class ConfigRootService {

  public config: ConfigRoot = new ConfigRoot();

  public cantons: string[] = [
    "AG", "AI", "AR", "BE", "BL", "BS", "DA", "FR", "GE", "GL", "GR", "JU", "LU",
    "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG", "TI", "UR", "VD", "VS", "ZG", "ZH"
  ];

  public types: string[] = [
    "action",
    "businessCase",
    "businessTerm",
    "content",
    "enumValue",
    "reaction"
  ];

  public valueTypes: string[] = [
    "address",
    "attachment",
    "date",
    "dateFromTo",
    "datetime",
    "deceasedPerson",
    "enum",
    "int",
    "legalComponent",
    "legalPerson",
    "naturalLegalPerson",
    "naturalPerson",
    "naturalPersonLight",
    "richtext",
    "richtextContent",
    "text",
    "textNeutral",
    "url"
  ];

  private _needSave = false;
  private _suspendSave = false;
  private _maximize = localStorage.getItem( 'maximize' ) === 'true';

  constructor() {}

  // Return true if current dialog is maximized
  public get maximize() {
    return this._maximize;
  }

  // Set maximize value and safe to browser storage for later use
  public set maximize( value: boolean ) {
    this._maximize = value;
    localStorage.setItem( "maximize", value ? "true" : "false" );
  }

  // Load configuration from specified JSON string or the browsers storage if null
  load( config: string | null ) {
    if( config == null )
      config = localStorage.getItem( "configRoot" );
    if( config == null )
      this.config = new ConfigRoot();
    else {
      this.config = plainToInstance( ConfigRoot, JSON.parse( config ), { excludeExtraneousValues: true, enableImplicitConversion: true, exposeDefaultValues: true } );
      this.forceSave();
    }
  }

  // Save configuration to browser storage but only if necessary
  save() {
    if( this._needSave ) this.forceSave();
  }

  // Save configuration to browser storage
  forceSave() {
    this._needSave = false;
    localStorage.setItem( 'configRoot', JSON.stringify( instanceToPlain( this.config, { excludeExtraneousValues: true, exposeUnsetFields: false } ), ( key, value ) => {
      if( this.isEmpty( value )) return undefined;
      return value;
    }));
  }

  // We should save but not right now
  delaySave() {
    this._needSave = true;
  }

  // Suspend automatic save for the moment
  suspendSave() {
    this._suspendSave = true;
  }

  // Returns true if automatic save is suspended
  isSuspendSave() {
    return this._suspendSave;
  }

  // Used by modals to save on close (but only save if necessary)
  saveOnClose() {
    if( this._needSave ) this.save();
    this._suspendSave = false;
  }

  // Reset configuration to initial (empty)
  reset() {
    this.config = new ConfigRoot();
    localStorage.removeItem( "configRoot" );
  }

  // Get municipality term for specified key
  getMunicipality( key: string ) {
    if( key == null || key.length == 0 )
      return null;
    for( let i = 0; i < this.config.municipalities.length; i++ ) {
      const municipality = this.config.municipalities[i];
      if( municipality.key != null && municipality.key === key )
        return municipality;
    }
    return null;
  }

  // Helper function to check if value is empty for different types
  private isEmpty( value: any ) {
    if( value == null ) return true;
    if( Array.isArray( value ) && value.length == 0 ) return true;
    if( typeof value === "string" && value.length == 0 ) return true;
    if( typeof value === "boolean" && !value ) return true;
    if( value.constructor === Object ) {
      if( Object.values( value ).length === 0 ) return true;
      const values = Object.values( value );
      for( let i = 0; i < values.length; i++ )
        if( !this.isEmpty( values[i] )) return false;
      return true;
    }
    return false;
  }

}
