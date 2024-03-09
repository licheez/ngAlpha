import { Injectable } from '@angular/core';
import {AlphaLbsService} from "AlphaLbs";

@Injectable({
  providedIn: 'root'
})
export class AlphaTsService {

  constructor(
    private lbs: AlphaLbsService) {
    lbs.subscribe(()=>{});
  }
}
