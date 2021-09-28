import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimeService } from './time.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
  constructor(private router: Router)
  {
    router.navigate(['contacts']);
  }
  ngOnInit(): void
  {
  }
  title = 'httpretry';

 
}
