import { Expose, Type } from "class-transformer";

import { MultiLang } from "./MultiLang";

export class Term {

  @Expose() key!: string;
  @Expose() type!: string;
  @Expose() valueType!: string;
  @Expose() @Type(() => MultiLang) term = new MultiLang();
  @Expose() excludeDisplayTitle!: boolean;
  @Expose() delimiterTitle!: string;
  @Expose() parents: string[] = [];

  assigned!: boolean;
  assignedParent!: boolean;

  // Get list of parents as comma separated string
  public get parentList(): string | null {
    if( this.parents != null )
      return this.parents.sort().join( ", " );
    return null;
  }

}
