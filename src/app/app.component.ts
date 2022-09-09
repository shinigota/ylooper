import {Component, HostListener, OnInit} from '@angular/core';
import {SideNavService} from "@/modules/loop/services/side-nav.service";
import {ShortcutsService} from "@/global/services/shortcuts.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private sideNavService : SideNavService,
              private shortcutsService : ShortcutsService) {
  }

  ngOnInit(): void { }

  toggleSideNav(): void {
    this.sideNavService.toggle();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    this.shortcutsService.dispatchKeyPress(event.key);
  }
}
