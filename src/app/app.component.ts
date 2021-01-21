import { Component, OnInit } from '@angular/core';

import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import {HttpClient} from "@angular/common/http";

import locationJSON from '../files/states-and-districts.json';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title:String = 'Loaction Finder';

  lat:Number = 26.2006043;
  lng:Number = 92.9375739;
  
  districts:String[];
  arrDistrict: IlocationCoordinates[] = [];

  locationForm:FormGroup = this.fb.group({
    state: [''],
    district:['']
  })


  locationList:IlocationList[] = [];

  locationData;
 

  ngOnInit(){
    this.http.get("../assets/states-and-districts.json").subscribe(data =>{
      this.locationList = data['states'];
    })
  }

  constructor (private fb:FormBuilder, private http:HttpClient){ }


  onStateSelect() {
    console.log(this.locationForm.get('state').value);

    let state = this.locationForm.get('state').value;

    let index = this.locationList.findIndex((item) => {
      return state == item.state;
    })

    this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=$${state}&key=${environment.CONSTANTS}`).subscribe((data) => {
      let loc;
      loc = data;
      this.lat = loc.results[0].geometry.location.lat;
      this.lng = loc.results[0].geometry.location.lng; 
    }, (error) => {
      console.log(error);
    })
      
    this.districts = this.locationList[index].districts;

    this.onDistrictChange()

  }

  onDistrictChange(){

      this.arrDistrict = [];

     let locState:String = this.locationForm.get('state').value;

     this.districts.map((city) => {
     this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}+${locState}&key=${environment.CONSTANTS}`).subscribe((data) => {
        let loc:any;
        loc = data;

        let tempObj:IlocationCoordinates = {
          label: city,
          lat:loc.results[0].geometry.location.lat,
          lng: loc.results[0].geometry.location.lng
        }
        this.arrDistrict.push(tempObj);
      }, (error) => {
        console.log(error);
      })
     })
  }

}

interface IlocationCoordinates{
  label:String
  lat:Number,
  lng:Number
}

interface IlocationList{
  state:string,
  districts:string[]
}
