import { Expose, Type } from "class-transformer";

import { MultiLang } from "./MultiLang";

export class Municipality {

  // Make municipalities sortable (by german name for now only)
  public static sort( municipality1: Municipality, municipality2: Municipality ) {
    if ( municipality1.term.deSubstitute > municipality2.term.deSubstitute )
      return 1;
    if ( municipality2.term.deSubstitute > municipality1.term.deSubstitute )
      return -1;
    return 0;
  }

  @Expose() key!: string;
  @Expose() @Type(() => MultiLang) term = new MultiLang();
  @Expose() cantons: string[] = [];

  update = false;

  public get cantonList(): string | null {
    if( this.cantons != null )
      return this.cantons.sort().join( ", " );
    return null;
  }

}
