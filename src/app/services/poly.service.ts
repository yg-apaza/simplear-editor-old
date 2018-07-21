import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PolyListRequest } from '../interfaces/requests/poly-list-request';
import { PolyGetRequest } from '../interfaces/requests/poly-get-request';
import { PolyListResponse } from '../interfaces/responses/poly-list-response';
import { PolyGetResponse } from '../interfaces/responses/poly-get-response';

@Injectable({
  providedIn: 'root'
})
export class PolyService {

  public static POLY_ENDPOINT = "https://poly.googleapis.com/v1";
  public static POLY_LIST_ENDPOINT = `${PolyService.POLY_ENDPOINT}/assets`;

  constructor(private http: HttpClient) { }

  listAssets(polyListRequest: PolyListRequest): Observable<PolyListResponse> {
    return this.http.get<PolyListResponse>(
      PolyService.POLY_LIST_ENDPOINT,
      {
        params: { ...polyListRequest, key: environment.poly.apiKey }
      }
    );
  }

  getAsset(polyGetRequest: PolyGetRequest): Observable<PolyGetResponse> {
    return this.http.get<PolyGetResponse>(
      `${PolyService.POLY_LIST_ENDPOINT}/${polyGetRequest.name}/`,
      {
        params: { key: environment.poly.apiKey }
      }
    );
  }
}
