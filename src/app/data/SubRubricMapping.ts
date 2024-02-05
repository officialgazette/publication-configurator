import { Expose, Type } from "class-transformer";

import { MultiLang } from "./MultiLang";
import { SubRubric } from "./SubRubric";
import { SubRubricInfo } from "./SubRubricInfo";
import { SubRubricTerm } from "./SubRubricTerm";

export class SubRubricMapping {

  public static sort(subRubricConfig1: SubRubricMapping, subRubricConfig2: SubRubricMapping ) {
    if ( subRubricConfig1.use > subRubricConfig2.use )
      return 1;
    if ( subRubricConfig2.use > subRubricConfig1.use )
      return -1;
    if ( subRubricConfig1.map > subRubricConfig2.map )
      return 1;
    if ( subRubricConfig2.map > subRubricConfig1.map )
      return -1;
    return 0;
  }

  @Expose() use!: string;
  @Expose() map!: string;
  @Expose() @Type(() => MultiLang) name = new MultiLang();
  @Expose() @Type(() => SubRubricInfo) info = new SubRubricInfo();
  @Expose() @Type(() => SubRubricTerm) terms: SubRubricTerm[] = [];

  template!: SubRubric;

  // Cleanup configuration
  public cleanup() {
    const list: any = {};
    this.terms = this.terms.filter( function( term ) {
      return list.hasOwnProperty( term.key ) ? false : ( list[term.key] = true );
    });
  }

  // Returns true if term is assigned to subrubric
  public isTermAssigned( key: string ) {
    for( let i = 0; i < this.terms.length; i++ ) {
      if( this.terms[i].key === key )
        return true;
    }
    return false;
  }

}
