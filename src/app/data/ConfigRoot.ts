import { Expose, Type } from 'class-transformer';

import { Municipality } from "./Municipality";
import { RegistrationOfficeType } from "./RegistrationOfficeType";
import { Rubric } from "./Rubric";
import { SubRubric } from "./SubRubric";
import { Term } from "./Term";

export class ConfigRoot {

  @Expose() @Type(() => RegistrationOfficeType) authorizationRegistrationOfficeTypes: RegistrationOfficeType[] = [];
  @Expose() @Type(() => Rubric) rubrics: Rubric[] = [];
  @Expose() @Type(() => SubRubric) subrubrics: SubRubric[] = [];
  @Expose() @Type(() => Term) terms: Term[] = [];
  @Expose() @Type(() => Municipality) municipalities: Municipality[] = [];

}
