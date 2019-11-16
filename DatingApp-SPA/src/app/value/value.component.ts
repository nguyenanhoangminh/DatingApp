import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {
  values: any;//this to store the response from get values function
  constructor(private http: HttpClient) { }
  // when the page init call the getVaues function
  ngOnInit() {
    this.getValues();
  }
  getValues(){
    this.http.get('http://localhost:5000/api/values').subscribe(response => {
    this.values = response;
  },  error => {
    console.log(error);
  });
  }
}
