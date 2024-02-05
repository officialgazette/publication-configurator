import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-root",
  template: "<router-outlet></router-outlet>"
})

export class AppComponent {

  constructor( public translateService: TranslateService ) {
    const languages = [ "de", "fr", "it", "en" ];
    translateService.addLangs( languages );
    translateService.setDefaultLang( "de" );
    let language = localStorage.getItem( "language" );
    if( language !== undefined && language !== null && languages.includes( language ))
      translateService.use( language );
    else {
      const browserLang = translateService.getBrowserLang();
      const regExp = new RegExp( languages.join( "|" ));
      translateService.use( browserLang?.match( regExp ) ? browserLang : "de" );
    }
  }

}
