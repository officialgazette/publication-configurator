import { Expose, Type } from "class-transformer";

import { SubRubricMapping } from "./SubRubricMapping";

export class ConfigTenant {

  @Expose() tenant!: string;
  @Expose() languages: string[] = [ "de" ];
  @Expose() rubrics: string[] = [];
  @Expose() @Type(() => SubRubricMapping) subrubrics: SubRubricMapping[] = [];

}
