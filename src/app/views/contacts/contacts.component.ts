import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { from, Observable, of, Subject, Subscription, throwError, timer } from 'rxjs';
import { catchError, delayWhen, map, mapTo, retry, retryWhen, take, tap } from 'rxjs/operators';
import { Contact } from '../../../MyTypes';
import { TimeService } from '../../time.service';
declare var $: any;

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit, OnDestroy
{
  public Contacts: Array<Contact> = [];
  message: string = "";
  private uiNotifysubscrip: Subscription | null = null;
  private retryWhensubscrip: Subscription | null = null;
  private Retry3Subscrip: Subscription | null = null;
  FetchDataSubscrip: Subscription | null = null;
  constructor(private timeService: TimeService) { }

  ngOnDestroy(): void
  {
    this.uiNotifysubscrip?.unsubscribe();
    this.retryWhensubscrip?.unsubscribe();
    this.Retry3Subscrip?.unsubscribe();
    this.FetchDataSubscrip?.unsubscribe();
  }

  /** */
  Clear() { this.message = ''; }

  public RetryWhen()
  {
    this.retryWhensubscrip = this.timeService.contactSubject
      .subscribe((result: Contact) =>
      {
          this.Contacts.push(result as Contact);
      });
    this.timeService.RetryWhen();
  }

  /** */
  public Retry3()
  {
    this.Retry3Subscrip = this.timeService.contactSubject
      .subscribe((result: Contact) =>
      {
          this.Contacts.push(result as Contact);
      });
    this.timeService.Retry3();
  }

  /** */
  public FetchData()
  {
    this.FetchDataSubscrip = this.timeService.contactSubject.
      pipe(take(3))
      .subscribe(result =>
      {         
        this.Contacts.push(result as Contact);
      });
    this.timeService.FetchTheDataAll();
  }

  ngOnInit(): void
  {
    /**/
    this.uiNotifysubscrip = this.timeService?.uiNofify
      .subscribe((data) =>
      {
        this.message += `${data}\n\r`;
      });
  }

}
