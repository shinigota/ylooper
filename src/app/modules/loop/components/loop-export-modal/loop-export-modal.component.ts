import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from "@/global/components";
import {DexieDumpService} from "@/global/services/dexie-dump.service";

@Component({
  selector: 'app-loop-export-modal',
  templateUrl: './loop-export-modal.component.html',
  styleUrls: ['./loop-export-modal.component.scss']
})
export class LoopExportModalComponent implements OnInit {
  @ViewChild("modal") private modal !: ModalComponent;
  @ViewChild("downloadLink") private downloadLink !: ElementRef;
  msgStatus: string = "Please wait...";
  ready: boolean = false;

  constructor(private dexieDumpService : DexieDumpService) { }

  ngOnInit(): void {
  }

  open(): void {
    this.modal!.open();
    this.dexieDumpService.exportData().then(blob => {
      blob.text().then( str => {
        this.msgStatus = "File ready for download.";
        this.ready = true;
        this.downloadLink.nativeElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
        this.downloadLink.nativeElement.setAttribute('download', 'ylooper.json');
      });
    });
  }

  close(): void {
    this.modal!.close();
    this.msgStatus = "Please wait...";
    this.ready = true;
    this.downloadLink.nativeElement.setAttribute('href', '');
    this.downloadLink.nativeElement.setAttribute('download', '');
  }

  download() {
    this.downloadLink.nativeElement.click();
    this.close();
  }
}
