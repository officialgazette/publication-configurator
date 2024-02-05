import { ChangeDetectorRef, Pipe, PipeTransform } from "@angular/core";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";

import { MultiLang } from "../data/MultiLang";

@Pipe({
  name: "multilang",
  pure: false
})

// Enables multilang objects to be translated using pipes
export class MultiLangPipe extends TranslatePipe implements PipeTransform {

  private translateService: TranslateService;

  constructor( translateService: TranslateService, _ref: ChangeDetectorRef ) {
    super( translateService, _ref );
    this.translateService = translateService;
  }

  override transform( multiLang: any ): any {
    if( multiLang instanceof MultiLang )
      return MultiLang.translate( multiLang, this.translateService.currentLang );
    return multiLang;
  }

}
