import { Expose } from "class-transformer";

export class MultiLang {

  @Expose() de!: string;
  @Expose() fr!: string;
  @Expose() it!: string;
  @Expose() en!: string;

  // Create a clone of the specified multilang object
  public static clone( source: MultiLang ): MultiLang {
    let target = new MultiLang();
    target.de = source.de != null ? source.de : "";
    target.fr = source.fr != null ? source.fr : "";
    target.it = source.it != null ? source.it : "";
    target.en = source.en != null ? source.en : "";
    return target;
  }

  // Translate multilang object to specified language
  public static translate( entry: MultiLang, language: string ): string {
    switch( language ) {
      case "de": return entry.deSubstitute;
      case "fr": return entry.frSubstitute;
      case "it": return entry.itSubstitute;
      default:   return entry.enSubstitute;
    }
  }

  // Translate multilang object to specified language, use placeholder (alternative) if empty/unset
  public static translateWithPlaceholder( entry: MultiLang, placeholder: MultiLang, language: string ) {
    if( !MultiLang.translationIsEmpty( entry, language ))
      return entry.get( language );
    return MultiLang.translate( placeholder, language );
  }

  // Returns true if no translation is available for specified language
  public static translationIsEmpty( entry: MultiLang, language: string ) {
    let text = entry.get( language );
    return text == null || text === "";
  }

  // Return first non-(null/empty) string specified
  private static firstOf( lang1: string, lang2: string, lang3: string, lang4: string ): string {
    if( lang1 != null && lang1 !== "" ) return lang1;
    if( lang2 != null && lang2 !== "" ) return lang2;
    if( lang3 != null && lang3 !== "" ) return lang3;
    if( lang4 != null && lang4 !== "" ) return lang4;
    return "";
  }

  // Get value for specified language
  public get( language: string ) {
    switch( language ) {
      case "de": return this.de;
      case "fr": return this.fr
      case "it": return this.it;
      default:   return this.en;
    }
  }

  // Set value for specified language
  public set( entry: string, language: string ) {
    switch( language ) {
      case "de": this.de = entry; break;
      case "fr": this.fr = entry; break;
      case "it": this.it = entry; break;
      default:   this.en = entry;
    }
  }

  // Get german value or alternative if null or empty
  public get deSubstitute(): string {
    return MultiLang.firstOf( this.de, this.en, this.fr, this.it );
  }

  // Get french value or alternative if null or empty
  public get frSubstitute(): string {
    return MultiLang.firstOf( this.fr, this.en, this.de, this.it );
  }

  // Get italian value or alternative if null or empty
  public get itSubstitute(): string {
    return MultiLang.firstOf( this.it, this.en, this.de, this.fr );
  }

  // Get english value or alternative if null or empty
  public get enSubstitute(): string  {
    return MultiLang.firstOf( this.en, this.de, this.fr, this.it );
  }

}
