import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { Subject } from "rxjs";

import { ConfigRoot } from "../data/ConfigRoot";
import { ConfigTenant } from "../data/ConfigTenant";
import { SubRubric } from "../data/SubRubric";
import { SubRubricMapping } from "../data/SubRubricMapping";
import { SubRubricTerm } from "../data/SubRubricTerm";
import { Tenant } from "../data/Tenant";

@Injectable({
  providedIn: "root"
})

export class ConfigTenantService {

  public configRoot = new ConfigRoot();
  public configTenant = new ConfigTenant();
  public selectedRubricCodesSubject = new Subject<string[]>();
  public tenant!: Tenant;

  public tenants: Tenant[] = [
    { code: "AG", name: "KABAG" },
    { code: "AI", name: "KABAI" },
    { code: "AR", name: "KABAR" },
    { code: "BE", name: "KABBE" },
    { code: "BL", name: "KABBL" },
    { code: "BS", name: "KABBS" },
    { code: "DA", name: "KABDA" },
    { code: "FR", name: "KABFR" },
    { code: "GE", name: "KABGE" },
    { code: "GL", name: "KABGL" },
    { code: "JU", name: "KABJU" },
    { code: "LU", name: "KABLU" },
    { code: "NE", name: "KABNE" },
    { code: "NW", name: "KABNW" },
    { code: "OW", name: "KABOW" },
    { code: "SG", name: "KABSG" },
    { code: "SH", name: "KABSH" },
    { code: "SO", name: "KABSO" },
    { code: "SZ", name: "KABSZ" },
    { code: "TG", name: "KABTG" },
    { code: "TI", name: "KABTI" },
    { code: "UR", name: "KABUR" },
    { code: "VD", name: "KABVD" },
    { code: "VS", name: "KABVS" },
    { code: "ZG", name: "KABZG" },
    { code: "ZH", name: "KABZH" }
  ];

  private baseUrl = "/terms/ui/";

  private _needSave = false;
  private _suspendSave = false;
  private _maximize = localStorage.getItem( "maximize" ) === "true";

  constructor( private http: HttpClient ) {}

  public get maximize() {
    return this._maximize;
  }

  public set maximize( value: boolean ) {
    this._maximize = value;
    localStorage.setItem( "maximize", value ? "true" : "false" );
  }

  // Load configuration from specified JSON string or the browsers storage if null
  load( config: string | null ) {
    this.http.get( this.baseUrl + "config", { responseType: "text" } ).subscribe( response => {
      this.configRoot = plainToInstance( ConfigRoot, JSON.parse( response ), { excludeExtraneousValues: true, enableImplicitConversion: true, exposeDefaultValues: true } );
      if( config == null )
        config = localStorage.getItem( "configTenant" );
      // For backward compatibility also check for configuration in browser storage using old key
      // cleanup the old key as it will get migrated to the new key name later on
      if( config == null ) {
        config = localStorage.getItem( "config" );
        localStorage.removeItem( "config" );
      }
      if( config == null )
        this.configTenant = new ConfigTenant();
      else {
        this.configTenant = plainToInstance( ConfigTenant, JSON.parse( config ), { excludeExtraneousValues: true, enableImplicitConversion: true, exposeDefaultValues: true } );
        this.configTenant.subrubrics.forEach( (subRubric) => {
          subRubric.cleanup();
        });
        this.forceSave();
      }
      this.prepareConfigTenant();
      this.selectedRubricCodesSubject.next( this.configTenant.rubrics );
      this.tenant = this.getTenant( this.configTenant.tenant );
    });
  }

  // Save configuration to browser storage but only if necessary
  save() {
    if( this._needSave ) this.forceSave();
  }

  // Save configuration to browser storage
  forceSave() {
    this._needSave = false;
    const config = new ConfigTenant();
    config.tenant = this.configTenant.tenant;
    config.languages = this.configTenant.languages;
    config.rubrics = [...this.configTenant.rubrics];
    this.configTenant.subrubrics.forEach( (subRubricConfig) => {
      if( subRubricConfig.use != null && subRubricConfig.use.length > 0 )
        config.subrubrics.push( subRubricConfig );
    });
    localStorage.setItem( "configTenant", JSON.stringify( instanceToPlain( config, { excludeExtraneousValues: true, exposeUnsetFields: false } ), ( key, value ) => {
      if( this.isEmpty( value )) return undefined;
      if( key === "primary" ) return undefined;
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
    this.configTenant = new ConfigTenant();
    localStorage.removeItem( "configTenant" );
  }

  // Fix subrubric configuration to match expectations
  fixSubRubricConfig( subRubricConfig: SubRubricMapping ) {
    for( let i = 0; i < this.configRoot.terms.length; i++ ) {
      const term = this.configRoot.terms[i];
      for( let j = 0; j < subRubricConfig.template.terms.length; j++ ) {
        const subRubricTerm = subRubricConfig.template.terms[j];
        if( term.key === subRubricTerm.key ) {
          if( subRubricTerm.primary || term.type === 'action' ) {
            if( !subRubricConfig.isTermAssigned( term.key )) {
              const subRubricConfigTerm = new SubRubricTerm();
              subRubricConfigTerm.key = term.key;
              subRubricConfigTerm.assigned = true;
              subRubricConfig.terms.push( subRubricConfigTerm );
            }
          }
        }
      }
    }
  }

  // Prepare the tenant configuration for further use and prepare caches for quick lookup
  prepareConfigTenant() {
    const subrubrics: SubRubricMapping[] = [];
    let available: string[] = [];
    this.configRoot.subrubrics.forEach( (subrubric) => {
      available.push( subrubric.code );
    });
    available = [...new Set( available )];
    const used: string[] = [];
    this.configTenant.subrubrics.forEach( (subrubric) => {
      if( available.includes( subrubric.use )) {
        subrubric.template = this.getTemplate( subrubric.use );
        subrubrics.push( subrubric );
        used.push( subrubric.use );
      }
    });
    this.configRoot.subrubrics.forEach( (subrubric) => {
      if( !used.includes( subrubric.code )) {
        const subrubricConfig = new SubRubricMapping();
        subrubricConfig.template = subrubric;
        subrubrics.push( subrubricConfig );
      }
    });
    subrubrics.sort( SubRubricMapping.sort )
    this.configTenant.subrubrics = subrubrics;
  }

  // Get subrubric template for specified template code (id)
  private getTemplate( code: string ) {
    for( let i = 0; i < this.configRoot.subrubrics.length; i++ ) {
      const subrubric = this.configRoot.subrubrics[i];
      if( subrubric.code === code )
        return subrubric;
    }
    return new SubRubric();
  }

  // Get tenant for specified code (id)
  private getTenant( code: string ) {
    if( code == null )
      return this.tenants[0];
    // Tenant codes should be uppercase
    code = code.toUpperCase();
    // Remove tenant code prefix
    if( code.length == 5 )
      code = code.substring( 3 );
    // Search for the tenant and return it if found
    for( let i = 0; i < this.tenants.length; i++ ) {
      const tenant = this.tenants[i];
      if( tenant.code === code )
        return tenant;
    }
    return this.tenants[0];
  }

  // Helper function to check if value is empty for different types
  private isEmpty( value: any ) {
    if( value == null ) return true;
    if( Array.isArray( value ) && value.length == 0 ) return true;
    if( typeof value === "string" && value.length == 0 ) return true;
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
