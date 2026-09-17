import { Injectable } from '@angular/core';
import {UserService} from '../user/user.service';
import {MvtstkService} from '../../../gs-api/src/services/mvtstk.service';
import {MvtStkDto} from '../../../gs-api/src/models/mvt-stk-dto';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MvtstkServiceApp {

  constructor(
    private userService: UserService,
    private mvtstkService: MvtstkService
  ) { }

  entreeStock(mvtStkDto: MvtStkDto): Observable<MvtStkDto> {
    mvtStkDto.idEntreprise = this.userService.getConnectedUser().entreprise?.id;
    // Convention projet : dates ISO-8601 (le backend rejette les epoch millis)
    mvtStkDto.dateMvt = new Date().toISOString() as any;
    return this.mvtstkService.entreeStock(mvtStkDto);
  }

  sortieStock(mvtStkDto: MvtStkDto): Observable<MvtStkDto> {
    mvtStkDto.idEntreprise = this.userService.getConnectedUser().entreprise?.id;
    mvtStkDto.dateMvt = new Date().toISOString() as any;
    return this.mvtstkService.sortieStock(mvtStkDto);
  }

  correctionStockPos(mvtStkDto: MvtStkDto): Observable<MvtStkDto> {
    mvtStkDto.idEntreprise = this.userService.getConnectedUser().entreprise?.id;
    mvtStkDto.dateMvt = new Date().toISOString() as any;
    return this.mvtstkService.correctionStockPos(mvtStkDto);
  }

  correctionStockNeg(mvtStkDto: MvtStkDto): Observable<MvtStkDto> {
    mvtStkDto.idEntreprise = this.userService.getConnectedUser().entreprise?.id;
    mvtStkDto.dateMvt = new Date().toISOString() as any;
    return this.mvtstkService.correctionStockNeg(mvtStkDto);
  }

  mvtStkArticle(idArticle?: number): Observable<Array<MvtStkDto>> {
    if (idArticle) {
      return this.mvtstkService.mvtStkArticle(idArticle);
    }
    return of();
  }

  stockReelArticle(idArticle?: number): Observable<number> {
    if (idArticle) {
      return this.mvtstkService.stockReelArticle(idArticle);
    }
    return of();
  }
}
