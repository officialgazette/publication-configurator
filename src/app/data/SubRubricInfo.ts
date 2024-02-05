import { Expose, Type } from "class-transformer";

import { MultiLang } from "./MultiLang";
import { PublicDuration } from "./PublicDuration";

export class SubRubricInfo {

  @Expose() @Type(() => PublicDuration) publicDuration = new PublicDuration();
  @Expose() authorization: string[] = [];
  @Expose() @Type(() => MultiLang) legalNotice = new MultiLang();

  authorizationSelected: string[] = [];
  authorizationChanged: boolean = false;

}
