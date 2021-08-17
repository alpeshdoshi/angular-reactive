import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Quote} from "./quote";

@Injectable({
  providedIn: 'root'
})
export class QuoteReactiveService {

  url: string = 'http://192.168.1.5:8080/quotes-reactive';
  urlPaged: string = 'http://192.168.1.5:8080/quotes-reactive-paged';

  getQuoteStream(page?: number, size?: number): Observable<Quote> {
    return new Observable<Quote>((observer) => {
      let url = this.url;
      if (page != null) {
        url = this.urlPaged + '?page=' + page + '&size=' + size;
      }
      //EventSource only handles the data reception;
      // we need to connect this data to DOM updates, e.g., via Observable (RxJS) and ChangeDetectorRef (Angular).
      //Eventsource integrates well with RxJS because we can pipe each received element to an Observable and let other services or components subscribe to it.
      //The main advantage of using SSE in the frontend is we can display elements as we receive them from the server, which improves the user experience.
      let eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        console.debug('Received event: ', event);
        let json = JSON.parse(event.data);
        observer.next(new Quote(json['id'], json['book'], json['content']));
      };
      eventSource.onerror = (error) => {
        // readyState === 0 (closed) means the remote source closed the connection,
        // so we can safely treat it as a normal situation. Another way
        // of detecting the end of the stream is to insert a special element
        // in the stream of events, which the client can identify as the last one.
        if(eventSource.readyState === 0) {
          console.log('The stream has been closed by the server.');
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      }
    });
  }
}
