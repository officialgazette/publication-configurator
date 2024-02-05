import { Expose, Type } from "class-transformer";

import { MultiLang } from "./MultiLang";

export class RegistrationOfficeType {

  @Expose() code!: string;
  @Expose() @Type(() => MultiLang) name = new MultiLang();

}
