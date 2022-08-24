import {Component, OnInit, ViewChild} from '@angular/core';
import {DexieDumpService} from "@/global/services/dexie-dump.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModalComponent} from "@/global/components";

@Component({
  selector: 'app-loop-import-modal',
  templateUrl: './loop-import-modal.component.html',
  styleUrls: ['./loop-import-modal.component.scss']
})
export class LoopImportModalComponent implements OnInit {
  @ViewChild("modal") private modal !: ModalComponent;

  private fileData : any = null;

  form = new FormGroup({
    file : new FormControl(null, Validators.required)
  });

  constructor(private dexieDumpService : DexieDumpService) {

  }

  ngOnInit(): void { }

  open(): void {
    this.modal!.open();
  }

  close(): void {
    this.modal!.close();
    this.fileData = null;
    this.form.reset();
  }

  import() {
    this.dexieDumpService.importData(JSON.parse(this.fileData));
    this.close();
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.fileData = fileReader.result;
      }
      fileReader.readAsText(file);
    }
  }
}
