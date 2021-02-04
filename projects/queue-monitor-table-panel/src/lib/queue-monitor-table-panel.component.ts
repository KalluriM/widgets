import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { QueueUpdate } from 'jema/lib/_interfaces/queue-update';
import { ServerConnection } from 'jema';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'xe-queue-monitor-table-panel',
  templateUrl: './queue-monitor-table-panel.component.html',
  styleUrls: ['./queue-monitor-table-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QueueMonitorTablePanelComponent implements OnInit {
  @Input() serverConnection: ServerConnection;
  queueUpdates: Array<QueueUpdate> = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  dataSource: any;
  displayedColumns = [
    'Queue',
    'Callswaiting',
    'Usersloggedin',
    'Oldestcallduration',
    'callsoffered',
    'callsanswered',
  ];

  constructor() {}

  ngOnInit(): void {
    this.serverConnection.queueUpdates.subscribe((queueUpdates) => {
      this.queueUpdates = queueUpdates;
      this.dataSource = new MatTableDataSource(queueUpdates);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const now = moment().format('MMMM Do YYYY, h:mm:ss a');
    /* save to file */
    XLSX.writeFile(wb, 'QueuesStatus_' + now + '.xlsx');
  }
}