import { Component, OnInit, ElementRef, ViewChild, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { MapService } from '../../map/map.service';
import { MapListService } from '../../map-list/map-list.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'pnx-map-data',
  templateUrl: './map-data.component.html',
  styleUrls: ['./map-data.component.scss']
})
export class MapDataComponent implements OnInit, OnChanges {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @Input() allColumns: Array<any>;
  @Input() displayColumns: Array<any>;
  @Input() pathInfo: string;
  @Input() pathEdit: string;
  @Output() paramChanged = new EventEmitter<any>();
  @Output() pageChanged = new EventEmitter<any>();
  @Output() paramDeleted = new EventEmitter<any>();
  @Output() onDeleteRow = new EventEmitter<number>();
  filterList: Array<any>;
  filteredColumns: Array<any>;
  filterSelected: any;
  inputTaxon = new FormControl();
  inputObservers = new FormControl();
  dateMin = new FormControl();
  dateMax = new FormControl();
  genericFilter = new FormControl();
  index = 0;


  selected = []; // list of row selected
  rows = []; // rows in data table

  constructor(private mapListService: MapListService, private _router: Router, public ngbModal: NgbModal) {

  }

  ngOnInit() {
    this.filterList = [{'name': '', 'prop': ''}];

    this.filterSelected = {'name': '', 'prop': ''};

    this.mapListService.gettingTableId$.subscribe(res => {
      this.selected = []; // clear selected list
      for (const i in this.mapListService.tableData) {
        if (this.mapListService.tableData[i][this.mapListService.idName] === res) {
          this.selected.push(this.mapListService.tableData[i]);
        }
      }
    });


    this.genericFilter.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(value => {
        this.mapListService.urlQuery.delete(this.filterSelected.prop);
        if (value.length > 0) {
          this.paramChanged.emit({param: this.filterSelected.prop, 'value': value});
        } else {
          this.paramChanged.emit({param: '', 'value': ''});
        }
      });
  }

  onSelect(selected) {
    this.mapListService.setCurrentLayerId(this.selected[0][this.mapListService.idName]);
  }
  getRowClass() {
    return 'clickable';
  }


  toggle(col) {
    const isChecked = this.isChecked(col);

    if (isChecked) {
      this.displayColumns = this.displayColumns.filter(c => {
        return c.prop !== col.prop;
      });
    } else {
      this.displayColumns = [...this.displayColumns, col];
    }
  }


  isChecked(col) {
    let i = 0;
    while (i < this.displayColumns.length && this.displayColumns[i].prop !== col.prop) {
      i = i + 1;
    }
    return i === this.displayColumns.length ? false : true;
    }



  onChangeFilterOps(list) {
    // reset url query
    this.mapListService.urlQuery.delete(this.filterSelected.prop);
    this.filterSelected = list; // change filter selected
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onEditReleve(idReleve) {
    this._router.navigate([this.pathEdit, idReleve]);
  }

  onDetailReleve(idReleve) {
    this._router.navigate([this.pathInfo, idReleve]);
  }


  redirect() {
    this._router.navigate([this.pathEdit]);
  }

  deleteAndRefresh(param) {
    this.mapListService.urlQuery = this.mapListService.urlQuery.delete(param);
    this.paramDeleted.emit();
  }

  taxonChanged(taxonObj) {
    // refresh taxon in url query
    this.mapListService.urlQuery = this.mapListService.urlQuery.delete('cd_nom');
    this.paramChanged.emit({param: 'cd_nom', 'value': taxonObj.cd_nom});
  }

  observerChanged(observer) {
     this.paramChanged.emit({param: 'observer', 'value': observer.id_role});
  }

  observerDeleted(observer) {
    const idObservers = this.mapListService.urlQuery.getAll('observer');
    idObservers.splice(idObservers.indexOf(observer.id_role), 1);
    idObservers.forEach(id => {
      this.mapListService.urlQuery = this.mapListService.urlQuery.set('observer', id);
    });
    this.paramDeleted.emit();
  }

  dateMinChanged(date) {
    this.mapListService.urlQuery = this.mapListService.urlQuery.delete('date_up');
    if (date.length > 0) {
      this.paramChanged.emit({param: 'date_up', 'value': date});
    }
  }
  dateMaxChanged(date) {
    this.mapListService.urlQuery = this.mapListService.urlQuery.delete('date_low');
    if (date.length > 0) {
      this.paramChanged.emit({param: 'date_low', 'value': date});
    }
  }

  setPage(pageInfo) {
    this.mapListService.page.pageNumber = pageInfo.offset;
    this.paramChanged.emit({param: 'offset', 'value': pageInfo.offset});
  }

  openDeleteModal(event, modal, iElement, row) {
    this.selected = [];
    this.selected.push(row);
    event.stopPropagation();
    // prevent erreur link to the component
    iElement && iElement.parentElement && iElement.parentElement.parentElement &&
    iElement.parentElement.parentElement.blur();
    this.ngbModal.open(modal);
  }

  deleteRow() {
    const deleteId = this.selected[0][this.mapListService.idName];
    // this.rows = this.rows.filter(row => {
    //   return row[this.mapListService.idName] !==  deleteId;
    // });
    // this.mapListService.page.totalElements = this.mapListService.page.totalElements -1 ;
    this.selected = [];

    this.onDeleteRow.emit(deleteId);
  }

  ngOnChanges(changes) {

    // init the columns
    if (changes.allColumns) {
      if (changes.allColumns.currentValue !== undefined ) {
        this.allColumns = changes.allColumns.currentValue;
        const doubleColumns = ['taxons', 'observateurs', 'date_min', 'date_max', 'leaflet_popup', 'observers'];
        this.filteredColumns = this.allColumns.filter(res => {
          return doubleColumns.indexOf(res.prop) === -1 ;
        });
      }
    }


  }
}



