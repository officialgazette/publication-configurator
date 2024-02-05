import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { MenuModule } from "primeng/menu";
import { MenubarModule } from "primeng/menubar";
import { MultiSelectModule } from "primeng/multiselect";
import { NgModule } from "@angular/core";
import { SelectButtonModule } from "primeng/selectbutton";
import { StyleClassModule } from "primeng/styleclass";
import { TabMenuModule } from "primeng/tabmenu";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { ToggleButtonModule } from "primeng/togglebutton";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TriStateCheckboxModule } from "primeng/tristatecheckbox";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routing.module";
import { HttpRequestInterceptor } from "./HttpRequestInterceptor";
import { MultiLangPipe } from "./service/MultiLangPipe";
import { RootComponent } from "./component/root/component";
import { RootMunicipalitiesComponent } from "./component/root/municipalities/component";
import { RootMunicipalitiesDetailComponent } from "./component/root/municipalities/detail/component";
import { RootMunicipalitiesImportComponent } from "./component/root/municipalities/import/component";
import { RootRegistrationOfficeTypesComponent } from "./component/root/registrationOfficeTypes/component";
import { RootRegistrationOfficeTypesDetailComponent } from "./component/root/registrationOfficeTypes/detail/component";
import { RootRubricsComponent } from "./component/root/rubrics/component";
import { RootRubricsDetailComponent } from "./component/root/rubrics/detail/component";
import { RootSubRubricsComponent } from "./component/root/subrubrics/component";
import { RootSubRubricsDetailComponent } from "./component/root/subrubrics/detail/component";
import { RootSubRubricsDetailPickTermsComponent } from "./component/root/subrubrics/detail/pickterms/component";
import { RootTermsComponent } from "./component/root/terms/component";
import { RootTermsDetailComponent } from "./component/root/terms/detail/component";
import { RootTermsDetailPickParentsComponent } from "./component/root/terms/detail/pickparents/component";
import { RootTermsDetailShowValuesComponent } from "./component/root/terms/detail/showvalues/component";
import { RootTermsMoveComponent } from "./component/root/terms/move/component";
import { TenantComponent } from "./component/tenant/component";
import { TenantLanguagesComponent } from "./component/tenant/languages/component";
import { TenantSubRubricComponent } from "./component/tenant/subrubrics/component";
import { TenantSubRubricDetailComponent } from "./component/tenant/subrubrics/detail/component";

export function HttpLoaderFactory( http: HttpClient ) {
  return new TranslateHttpLoader( http, "./assets/i18n/", ".json" );
}

@NgModule({
  declarations: [
    AppComponent,
    MultiLangPipe,
    RootComponent,
    RootMunicipalitiesComponent,
    RootMunicipalitiesDetailComponent,
    RootMunicipalitiesImportComponent,
    RootRegistrationOfficeTypesComponent,
    RootRegistrationOfficeTypesDetailComponent,
    RootRubricsComponent,
    RootRubricsDetailComponent,
    RootSubRubricsComponent,
    RootSubRubricsDetailComponent,
    RootSubRubricsDetailPickTermsComponent,
    RootTermsComponent,
    RootTermsDetailComponent,
    RootTermsDetailPickParentsComponent,
    RootTermsDetailShowValuesComponent,
    RootTermsMoveComponent,
    TenantComponent,
    TenantLanguagesComponent,
    TenantSubRubricComponent,
    TenantSubRubricDetailComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    CheckboxModule,
    ConfirmDialogModule,
    DropdownModule,
    DynamicDialogModule,
    FormsModule,
    HttpClientModule,
    InputNumberModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    MenuModule,
    MenubarModule,
    MultiSelectModule,
    SelectButtonModule,
    StyleClassModule,
    TabMenuModule,
    TabViewModule,
    TableModule,
    ToggleButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    }),
    TriStateCheckboxModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
