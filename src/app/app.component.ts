import { Component, OnInit, Input, ChangeDetectorRef, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { FiltersService } from "./services/filters-service";
import { ConfigService } from "./services/config-service";
import { ResourceService } from "./services/resource-service";
import { HttpService } from "./services/http-service";

import 'rxjs/add/operator/map';

@Component({
  selector: 'ng2-table',
  providers: [HttpService, FiltersService, ResourceService, ConfigService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class TableComponent implements OnInit, AfterViewInit {
  @Input() configuration: ConfigService;
  @Output() event = new EventEmitter();

  constructor(public filtersService: FiltersService,
              public config: ConfigService,
              public resource: ResourceService,
              public httpService: HttpService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (this.configuration) {
      this.config = this.configuration;
    }
    this.numberOfItems = 0;
    this.itemsObservables = this.httpService.getData(this.config.resourceUrl);
    this.itemsObservables.subscribe(res => {
      this.data = res;
      this.numberOfItems = res.length;
      this.keys = Object.keys(this.data[0]);
      this.resource.keys = this.keys;
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  public data: Array<any>;
  public keys: Array<any>;
  public numberOfItems: number;
  public selectedRow: number;
  public selectedCol: number;
  public selectedCell: number;
  public itemsObservables;

  public orderBy(key: string) {
    this.data = this.resource.sortBy(key);
  }

  clickedCell($event:object, row: object, key: string|number|boolean, colIndex: number, rowIndex: number) {
    if (this.config.selectRow) {
      this.selectedRow = rowIndex;
    }
    if (this.config.selectCol) {
      this.selectedCol = colIndex;
    }
    if (this.config.selectCell) {
      this.selectedRow = rowIndex;
      this.selectedCol = colIndex;
    }
    if (this.config.clickEvent) {
      this.event.emit({
        event: $event,
        row: row,
        key: key,
        rowId: rowIndex,
        colId: colIndex,
      });
    }
  }
}