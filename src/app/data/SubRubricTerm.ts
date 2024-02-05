import { Expose } from "class-transformer";

import { Term } from "./Term";

export class SubRubricTerm {

  public static sort( subRubricTerm1: SubRubricTerm, subRubricTerm2: SubRubricTerm ) {
    if ( subRubricTerm1.key > subRubricTerm2.key )
      return 1;
    if ( subRubricTerm2.key > subRubricTerm1.key )
      return -1;
    return 0;
  }

  @Expose() key!: string;
  @Expose() primary!: boolean;
  @Expose() required!: boolean | null;
  @Expose() editable!: boolean | null;
  @Expose() parents: string[] = [];

  term!: Term;
  terms: SubRubricTerm[] = [];
  templateTerm!: SubRubricTerm;
  assigned!: boolean;

  // Returns true if term ha a parent
  public hasParent( parent: string ): boolean {
    for( let i = 0; i < this.parents.length; i++ ) {
      if( this.parents[i] === parent )
        return true;
    }
    return false;
  }

}
