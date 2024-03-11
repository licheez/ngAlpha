import { Injectable } from '@angular/core';
import {AlphaLbsService} from "@pvway/alpha-lbs";

@Injectable({
  providedIn: 'root'
})
export class AlphaTsService {

  constructor(lbs: AlphaLbsService) {
    lbs.subscribe(
      payload => console.log(payload));
  }
}
