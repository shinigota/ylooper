import {Component, OnInit} from '@angular/core';
import {SideNavService} from "@/modules/loop/services/side-nav.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private sideNavService : SideNavService) {
  }

  ngOnInit(): void { }

  toggleSideNav(): void {
    this.sideNavService.toggle();
  }
}
