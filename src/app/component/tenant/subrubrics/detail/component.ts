import { Component, OnDestroy, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TranslateService } from "@ngx-translate/core";

import { ConfigTenantService } from "../../../../service/ConfigTenantService";
import { MultiLang } from "../../../../data/MultiLang";
import { PublicDuration } from "../../../../data/PublicDuration";
import { SubRubricMapping } from "../../../../data/SubRubricMapping";
import { SubRubricTerm } from "../../../../data/SubRubricTerm";

@Component({
  selector: "app-tenant-subrubric-detail",
  templateUrl: "./component.html"
})

export class TenantSubRubricDetailComponent implements OnInit, OnDestroy {

  subrubric!: SubRubricMapping;
  terms: SubRubricTerm[] = [];

  protected readonly MultiLang = MultiLang;

  constructor( public configService: ConfigTenantService, public dialogConfig: DynamicDialogConfig, public translateService: TranslateService ) {}

  // Initialization
  ngOnInit() {
    this.configService.suspendSave();
    this.subrubric = this.dialogConfig.data.subrubric;
    const enums = new Map<string, SubRubricTerm[]>();
    // Loop through all root terms for the subrubric and prepare them
    this.configService.configRoot.terms.forEach( (term) => {
      const rootSubRubric = this.getRootSubRubric();
      if( rootSubRubric != null ) {
        const rootTerm = this.getSubRubricTerm( term.key, rootSubRubric.terms );
        if( rootTerm != null ) {
          let subRubricTerm = this.getSubRubricTerm( term.key, this.subrubric.terms );
          if( subRubricTerm != null )
            subRubricTerm.assigned = true;
          else
            subRubricTerm = new SubRubricTerm();
          subRubricTerm.term = term;
          subRubricTerm.templateTerm = rootTerm;
          if( subRubricTerm.key == null )
            subRubricTerm.key = subRubricTerm.term.key;
          // Enum values need some special care
          if( subRubricTerm.term.type === "enumValue" ) {
            subRubricTerm.term.parents.forEach( (parent) => {
              if( !enums.has( parent ))
                enums.set( parent, [] );
              if( subRubricTerm != null )
                enums.get( parent )?.push( subRubricTerm );
            });
            if( subRubricTerm.assigned && subRubricTerm.parents.length == 0 )
              subRubricTerm.parents = this.getAllParents( subRubricTerm.term.parents, rootSubRubric.terms );
            subRubricTerm.assigned = false;
          } else
            this.terms.push( subRubricTerm );
        }
      }
    });
    // Handle terms with enum value type
    this.terms.forEach( (term) => {
      if( term.term.valueType === "enum" ) {
        const terms = enums.get( term.term.key );
        if( terms != null )
          term.terms = terms;
      }
    });
    // Handle authorization selection (preselect from template if nothing has been configured yet)
    if( this.subrubric.info.authorization.length > 0 ) {
      this.subrubric.info.authorizationSelected = [...this.subrubric.info.authorization];
      this.subrubric.info.authorizationChanged = true;
    } else {
      this.subrubric.info.authorizationSelected = [...this.subrubric.template.info.authorization];
      this.subrubric.info.authorizationChanged = false;
    }
  }

  // Event handler on dialog close
  ngOnDestroy() {
    const terms: SubRubricTerm[] = [];
    const subTerms: SubRubricTerm[] = [];
    // Process assigned terms and subterms
    this.terms.forEach( (term) => {
      if( term.assigned ) {
        terms.push( term );
        term.terms.forEach( (subTerm) => {
          if(( subTerm.assigned || subTerm.parents.length > 0 ) && subTerms.indexOf( subTerm ) < 0 ) {
            subTerm.parents = subTerm.parents.sort();
            subTerms.push(subTerm);
          }
        });
      }
    });
    this.subrubric.terms = terms.concat( subTerms );
    // Make sure authorization changes only require saving if necessary
    if( this.subrubric.info.authorizationChanged ) {
      this.configService.delaySave();
      this.subrubric.info.authorization = [...this.subrubric.info.authorizationSelected];
    } else
      this.subrubric.info.authorization = [];
    this.configService.saveOnClose();
  }

  // Change subterm selection
  changeSubTermSelection( term: SubRubricTerm, parent: string ) {
    const index = term.parents.indexOf( parent, 0 );
    if( index > -1 )
      term.parents.splice( index, 1 );
    else
      term.parents.push( parent );
  }

  // Reset authorizations back to template configuration
  resetAuthorization() {
    this.subrubric.info.authorization = [];
    this.subrubric.info.authorizationSelected = [...this.subrubric.template.info.authorization];
    this.subrubric.info.authorizationChanged = false;
  }

  // Reset legal notice
  resetLegalNotice() {
    this.subrubric.info.legalNotice.set( "", this.translateService.currentLang );
  }

  // Reset public duration
  resetPublicDuration() {
    this.subrubric.info.publicDuration = new PublicDuration();
  }

  // Reset term
  resetTerm( term: SubRubricTerm ) {
    term.required = null;
    term.editable = null;
  }

  // Returns true if value is empty or null
  isEmpty( value: any ) {
    return value == null || value.length < 1;
  }

  // Convert number to string
  numberToString( value: number | undefined ) {
    if( value != null )
      return value.toString();
    return undefined;
  }

  // Get all parents for specified term
  private getAllParents( parents: string[], terms: SubRubricTerm[] ) {
    const allParents: string[] = [];
    terms.forEach( (term) => {
      if( parents.indexOf( term.key ) > -1 )
        allParents.push( term.key );
    });
    return allParents;
  }

  // Get subrubric from root configuration
  private getRootSubRubric() {
    for( let i = 0; i < this.configService.configRoot.subrubrics.length; i++ ) {
      const subrubric = this.configService.configRoot.subrubrics[i];
      if( subrubric.code === this.subrubric.use )
        return subrubric;
    }
    return null;
  }

  // Get subrubric term for specified key
  private getSubRubricTerm( key: string, subRubricTerms: SubRubricTerm[] ) {
    for( let i = 0; i < subRubricTerms.length; i++ ) {
      const subRubricTerm = subRubricTerms[i];
      if( subRubricTerm.key === key )
        return subRubricTerm
    }
    return null;
  }

}
