import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  getUsers(page?, itemPerPage?, userParam?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();
    if (page != null && itemPerPage != null)
    {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemPerPage);
    }
    if (userParam != null)
    {
      params = params.append('minAge', userParam.minAge);
      params = params.append('maxAge', userParam.maxAge);
      params = params.append('gender', userParam.gender);
      params = params.append('orderBy', userParam.orderBy);
    }
    return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination')!= null)
          {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult;
        })
    );
  }
  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id, httpOptions);
  }
  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }
  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }
  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }
}
