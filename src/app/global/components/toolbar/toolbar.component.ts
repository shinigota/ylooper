import {Component, OnInit} from '@angular/core';
import {SideNavService} from "@/modules/loop/services/side-nav.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {


  constructor(private sideNavService : SideNavService) {
  }

  ngOnInit(): void { }

  toggleSideNav(): void {
    this.sideNavService.toggle();
  }


}
