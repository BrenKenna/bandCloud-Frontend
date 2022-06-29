import { Component } from '@angular/core';

export interface Tab {
  label: string;
  route: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bandCloud';

  tabs: Tab[] = [
    {
      label: "Register",
      route: "register"
    },

    {
      label: "Login",
      route: "account-login"
    },

    {
      label: "Account Data",
      route: "account-display"
    },

    {
      label: "Project Selector",
      route: "projects-viewer"
    },

    {
      label: "Workbench",
      route: "project-page"
    }
  ];
}
