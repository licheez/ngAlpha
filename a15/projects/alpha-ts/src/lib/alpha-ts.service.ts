import { Injectable } from '@angular/core';
import {AlphaLbsService} from "AlphaLbs";

@Injectable({
  providedIn: 'root'
})
export class AlphaTsService {

  constructor(lbs: AlphaLbsService) {
    // catch everything
    lbs.subscribe(payload => console.log(payload));
  }
}
