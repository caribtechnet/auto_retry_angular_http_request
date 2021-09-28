import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, OperatorFunction, PartialObserver, pipe, Subject, timer } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { retry } from 'rxjs/internal/operators/retry';
import { catchError, delay, delayWhen, map, retryWhen, scan, take, tap } from 'rxjs/operators';
import { Contact } from '../MyTypes';
import { ajax } from 'rxjs/ajax';

@Injectable({
  providedIn: 'root'
})
export class TimeService
{
  data_file: string = 'assets/data.json';

  @Output()
  public uiNofify = new EventEmitter<string>();

  private _contactSubject = new Subject<Contact>();
  public get contactSubject()
  {
    return this._contactSubject;
  }
  public set contactSubject(value)
  {
    this._contactSubject = value;
  }

  /** */
  public RetryWhen()
  {
    let subscrip = this.http.get<Contact[]>(this.data_file)
      .pipe(retryWhen(error =>
        error.pipe(
          scan((acc: number, error) =>
          {
            if (acc == 4) throw error;
            this.uiNofify.emit(("Retry Attempt " + acc));
            return acc + 1;
          }, 1)
          , tap(val =>
          {
          })
          , delayWhen(val => timer(5 * 1000))))
      )
      .subscribe((result) =>
      {
        let resultTemp = result as Contact[];
        resultTemp.forEach(item => this.contactSubject.next(item));
        subscrip.unsubscribe();
      });
  }

  /**
   * 
   * @param ntimes
   */
  public Retry3(ntimes: number = 3)
  {
    let subscrip = this.http.get<Contact[]>(this.data_file, {})
      .pipe(retry(ntimes)
        , catchError(
          (error: HttpErrorResponse) =>
          {
            let merror = error.message;
            this.uiNofify.emit(`All attempts failed! \r\n${merror}`);
            return of(merror);
          })
      )
      .subscribe((result: Contact[] | string) =>
      {
        if (result instanceof String) {

        } else {
          let resultTemp = result as Contact[];
          resultTemp.forEach(item => this.contactSubject.next(item));
        }
        subscrip.unsubscribe();
      }, (error) => { });
  }
  /** */
  public FetchTheDataAll()
  {
    let subscrip = this.http.get<Contact[]>(this.data_file)
      .pipe(catchError(
        (error: HttpErrorResponse) =>
        {
          let merror = error.message;
          this.uiNofify.emit(merror);
          return of(merror);
        }))
      .subscribe((result) =>
      {
        if (result instanceof String) {
        }
        else {
          let resultTemp = result as Contact[];
          resultTemp.forEach(item => this.contactSubject.next(item));
        }
        subscrip.unsubscribe();
      });
  }


  constructor(private http: HttpClient) { }

}
