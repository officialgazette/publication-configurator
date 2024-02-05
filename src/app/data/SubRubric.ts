import { Expose, Type } from "class-transformer";

import { MultiLang } from "./MultiLang";
import { SubRubricInfo } from "./SubRubricInfo";
import { SubRubricTerm } from "./SubRubricTerm";

export class SubRubric {

  // Make subrubrics sortable (by code)
  public static sort( subRubric1: SubRubric, subRubric2: SubRubric ) {
    if ( subRubric1.code > subRubric2.code )
      return 1;
    if ( subRubric2.code > subRubric1.code )
      return -1;
    return 0;
  }

  @Expose() code!: string;
  @Expose() @Type(() => MultiLang) name = new MultiLang();
  @Expose() exampleUrl!: string;
  @Expose() @Type(() => SubRubricInfo) info = new SubRubricInfo();
  @Expose() @Type(() => SubRubricTerm) terms: SubRubricTerm[] = [];

  // Get rubric code which is the first two characters of the subrubric code
  public get rubric(): string | null {
    if( this.code == null || this.code.length < 2 )
      return null;
    return this.code.substring( 0, 2 );
  }

}
