import { Expose, Type } from "class-transformer";

import { MultiLang } from "./MultiLang";

export class Rubric {

  // Make rubrics sortable (by code)
  public static sort( rubric1: Rubric, rubric2: Rubric) {
    if ( rubric1.code > rubric2.code )
      return 1;
    if ( rubric2.code > rubric1.code )
      return -1;
    return 0;
  }

  @Expose() code!: string;
  @Expose() @Type(() => MultiLang) name = new MultiLang();

}
