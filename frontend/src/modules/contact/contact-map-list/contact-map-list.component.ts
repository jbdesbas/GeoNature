import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { AppConfig } from '../../../conf/app.config';
import { GeoJSON } from 'leaflet';
import { MapListService } from '../../../core/GN2Common/map-list/map-list.service';
import { Subscription } from 'rxjs/Subscription';
import { ContactService } from '../services/contact.service';
import { CommonService } from '../../../core/GN2Common/service/common.service';
import { AuthService } from '../../../core/components/auth/auth.service';
import { CookieService } from 'ng2-cookies';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'pnx-contact-map-list',
  templateUrl: 'contact-map-list.component.html'
})

export class ContactMapListComponent implements OnInit {
  public geojsonData: GeoJSON;
  public displayColumns: Array<any>;
  public pathEdit: string;
  public pathInfo: string;
  public idName: string;
  public apiEndPoint: string;
  constructor( private _http: Http, private _mapListService: MapListService, private _contactService: ContactService,
    private _commonService: CommonService, private _auth: AuthService
   , private _translate: TranslateService) { }

  ngOnInit() {

  this.displayColumns = [
   {prop: 'taxons', name: 'Taxon', display: true},
   {prop: 'observateurs', 'name': 'Observateurs'},
  ];
  this.pathEdit = 'occtax/form';
  this.pathInfo = 'occtax/info';
  this.idName = 'id_releve_contact';
  this.apiEndPoint = 'contact/vreleve';

  this._mapListService.getData('contact/vreleve')
    .subscribe(res => {
      this._mapListService.page.totalElements = res.items.features.length;
      this.geojsonData = res.items;
    });

  }

   deleteReleve(id) {
    this._contactService.deleteReleve(id)
      .subscribe(
        data => {
          this._mapListService.deleteObs(id);
            this._commonService.translateToaster('success', 'Releve.DeleteSuccessfully');

        },
        error => {
          if (error.status === 403) {
            this._commonService.translateToaster('error', 'NotAllowed');
          } else {
            this._commonService.translateToaster('error', 'ErrorMessage');
          }

        });
   }

}

