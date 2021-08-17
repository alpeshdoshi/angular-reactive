import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Quote} from "./quote";

@Injectable({
  providedIn: 'root'
})
export class QuoteBlockingService {
  url: string = 'http://192.168.1.5:8080/quotes-blocking';
  urlPaged: string = 'http://192.168.1.5:8080/quotes-blocking-paged';

  constructor(private http: HttpClient) {}

  getQuotes(page?: number, size?: number): Observable<Array<Quote>> {
    let url = this.url;
    if (page != null) {
      url = this.urlPaged + '?page=' + page + '&size=' + size;
    }
    return this.http.get<Array<Quote>>(url);
  }
}
