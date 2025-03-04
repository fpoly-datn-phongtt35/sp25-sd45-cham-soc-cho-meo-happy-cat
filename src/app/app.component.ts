import { Component } from '@angular/core';
import { Router, NavigationEnd,NavigationStart } from '@angular/router';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // templateUrl : '<h1>{{title}}<h1>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'duanpet';
  maessage = 'HappyPet'

  constructor(private router: Router, private viewportScroller: ViewportScroller) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Ẩn trang trong quá trình chuyển đổi
        document.body.style.opacity = '0';
      } else if (event instanceof NavigationEnd) {
        // Hiển thị trang và reset scroll
        setTimeout(() => {
          document.body.style.opacity = '1';
          this.viewportScroller.scrollToPosition([0, 0]);
        }, 0);
      }
    });
  }

}
