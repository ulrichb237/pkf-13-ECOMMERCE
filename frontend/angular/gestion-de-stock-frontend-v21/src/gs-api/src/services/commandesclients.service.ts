/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CommandeClientDto } from '../models/commande-client-dto';
import { LigneCommandeClientDto } from '../models/ligne-commande-client-dto';
@Injectable({
  providedIn: 'root',
})
class CommandesclientsService extends __BaseService {
  static readonly findAllPath = '/api/v1/commandes-clients';
  static readonly savePath = '/api/v1/commandes-clients';
  static readonly deleteArticlePath = '/api/v1/commandes-clients/{idCommande}/lignes/{idLigneCommande}';
  static readonly deletePath = '/api/v1/commandes-clients/{idCommandeClient}';
  static readonly findByCodePath = '/api/v1/commandes-clients/code/{codeCommandeClient}';
  static readonly findAllLignesCommandesClientByCommandeClientIdPath = '/api/v1/commandes-clients/{idCommande}/lignes';
  static readonly updateArticlePath = '/api/v1/commandes-clients/{idCommande}/lignes/{idLigneCommande}/article/{idArticle}';
  static readonly updateClientPath = '/api/v1/commandes-clients/{idCommande}/client/{idClient}';
  static readonly updateEtatCommandePath = '/api/v1/commandes-clients/{idCommande}/etat/{etatCommande}';
  static readonly updateQuantiteCommandePath = '/api/v1/commandes-clients/{idCommande}/lignes/{idLigneCommande}/quantite/{quantite}';
  static readonly findByIdPath = '/api/v1/commandes-clients/{idCommandeClient}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @return successful operation
   */
  findAllResponse(): __Observable<__StrictHttpResponse<Array<CommandeClientDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/v1/commandes-clients`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CommandeClientDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAll(): __Observable<Array<CommandeClientDto>> {
    return this.findAllResponse().pipe(
      __map(_r => _r.body as Array<CommandeClientDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveResponse(body?: CommandeClientDto): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/v1/commandes-clients`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeClientDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  save(body?: CommandeClientDto): __Observable<CommandeClientDto> {
    return this.saveResponse(body).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * @param params The `CommandesclientsService.DeleteArticleParams` containing the following parameters:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  deleteArticleResponse(params: CommandesclientsService.DeleteArticleParams): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/v1/commandes-clients/${params.idCommande}/lignes/${params.idLigneCommande}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeClientDto>;
      })
    );
  }
  /**
   * @param params The `CommandesclientsService.DeleteArticleParams` containing the following parameters:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  deleteArticle(params: CommandesclientsService.DeleteArticleParams): __Observable<CommandeClientDto> {
    return this.deleteArticleResponse(params).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * @param idCommandeClient undefined
   */
  deleteResponse(idCommandeClient: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/v1/commandes-clients/${idCommandeClient}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param idCommandeClient undefined
   */
  delete(idCommandeClient: number): __Observable<null> {
    return this.deleteResponse(idCommandeClient).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param codeCommandeClient undefined
   * @return successful operation
   */
  findByCodeResponse(codeCommandeClient: string): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/v1/commandes-clients/code/${codeCommandeClient}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeClientDto>;
      })
    );
  }
  /**
   * @param codeCommandeClient undefined
   * @return successful operation
   */
  findByCode(codeCommandeClient: string): __Observable<CommandeClientDto> {
    return this.findByCodeResponse(codeCommandeClient).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * @param idCommande undefined
   * @return successful operation
   */
  findAllLignesCommandesClientByCommandeClientIdResponse(idCommande: number): __Observable<__StrictHttpResponse<Array<LigneCommandeClientDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/v1/commandes-clients/${idCommande}/lignes`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<LigneCommandeClientDto>>;
      })
    );
  }
  /**
   * @param idCommande undefined
   * @return successful operation
   */
  findAllLignesCommandesClientByCommandeClientId(idCommande: number): __Observable<Array<LigneCommandeClientDto>> {
    return this.findAllLignesCommandesClientByCommandeClientIdResponse(idCommande).pipe(
      __map(_r => _r.body as Array<LigneCommandeClientDto>)
    );
  }

  /**
   * @param params The `CommandesclientsService.UpdateArticleParams` containing the following parameters:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * - `idArticle`:
   *
   * @return successful operation
   */
  updateArticleResponse(params: CommandesclientsService.UpdateArticleParams): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/api/v1/commandes-clients/${params.idCommande}/lignes/${params.idLigneCommande}/article/${params.idArticle}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeClientDto>;
      })
    );
  }
  /**
   * @param params The `CommandesclientsService.UpdateArticleParams` containing the following parameters:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * - `idArticle`:
   *
   * @return successful operation
   */
  updateArticle(params: CommandesclientsService.UpdateArticleParams): __Observable<CommandeClientDto> {
    return this.updateArticleResponse(params).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * @param params The `CommandesclientsService.UpdateClientParams` containing the following parameters:
   *
   * - `idCommande`:
   *
   * - `idClient`:
   *
   * @return successful operation
   */
  updateClientResponse(params: CommandesclientsService.UpdateClientParams): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/api/v1/commandes-clients/${params.idCommande}/client/${params.idClient}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeClientDto>;
      })
    );
  }
  /**
   * @param params The `CommandesclientsService.UpdateClientParams` containing the following parameters:
   *
   * - `idCommande`:
   *
   * - `idClient`:
   *
   * @return successful operation
   */
  updateClient(params: CommandesclientsService.UpdateClientParams): __Observable<CommandeClientDto> {
    return this.updateClientResponse(params).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * @param params The `CommandesclientsService.UpdateEtatCommandeParams` containing the following parameters:
   *
   * - `idCommande`:
   *
   * - `etatCommande`:
   *
   * @return successful operation
   */
  updateEtatCommandeResponse(params: CommandesclientsService.UpdateEtatCommandeParams): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/api/v1/commandes-clients/${params.idCommande}/etat/${params.etatCommande}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeClientDto>;
      })
    );
  }
  /**
   * @param params The `CommandesclientsService.UpdateEtatCommandeParams` containing the following parameters:
   *
   * - `idCommande`:
   *
   * - `etatCommande`:
   *
   * @return successful operation
   */
  updateEtatCommande(params: CommandesclientsService.UpdateEtatCommandeParams): __Observable<CommandeClientDto> {
    return this.updateEtatCommandeResponse(params).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * @param params The `CommandesclientsService.UpdateQuantiteCommandeParams` containing the following parameters:
   *
   * - `quantite`:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  updateQuantiteCommandeResponse(params: CommandesclientsService.UpdateQuantiteCommandeParams): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/api/v1/commandes-clients/${params.idCommande}/lignes/${params.idLigneCommande}/quantite/${params.quantite}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeClientDto>;
      })
    );
  }
  /**
   * @param params The `CommandesclientsService.UpdateQuantiteCommandeParams` containing the following parameters:
   *
   * - `quantite`:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  updateQuantiteCommande(params: CommandesclientsService.UpdateQuantiteCommandeParams): __Observable<CommandeClientDto> {
    return this.updateQuantiteCommandeResponse(params).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * @param idCommandeClient undefined
   * @return successful operation
   */
  findByIdResponse(idCommandeClient: number): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/v1/commandes-clients/${idCommandeClient}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeClientDto>;
      })
    );
  }
  /**
   * @param idCommandeClient undefined
   * @return successful operation
   */
  findById(idCommandeClient: number): __Observable<CommandeClientDto> {
    return this.findByIdResponse(idCommandeClient).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }
}

module CommandesclientsService {

  /**
   * Parameters for deleteArticle
   */
  export interface DeleteArticleParams {
    idLigneCommande: number;
    idCommande: number;
  }

  /**
   * Parameters for updateArticle
   */
  export interface UpdateArticleParams {
    idLigneCommande: number;
    idCommande: number;
    idArticle: number;
  }

  /**
   * Parameters for updateClient
   */
  export interface UpdateClientParams {
    idCommande: number;
    idClient: number;
  }

  /**
   * Parameters for updateEtatCommande
   */
  export interface UpdateEtatCommandeParams {
    idCommande: number;
    etatCommande: 'EN_PREPARATION' | 'VALIDEE' | 'LIVREE';
  }

  /**
   * Parameters for updateQuantiteCommande
   */
  export interface UpdateQuantiteCommandeParams {
    quantite: number;
    idLigneCommande: number;
    idCommande: number;
  }
}

export { CommandesclientsService }
