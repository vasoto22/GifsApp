import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Gif, SearchGifsResponse } from './../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'TXvsBQwgJDbvNlqOXoHfrXBJ1NUZ7XsX';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs'
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  //El constructor solo se ejecuta una vez
  constructor( private http: HttpClient) {

    this._historial = JSON.parse(localStorage.getItem('historial')! ) || []; // esta linea es equivalente a las lienas de abajo para hacer persistente la app
    this.resultados = JSON.parse(localStorage.getItem('resultados')! ) || [];
    // if( localStorage.getItem('historial') ) {
    //   this._historial = JSON.parse(localStorage.getItem('historial')!) ;
    // }
  }

  buscarGifs( query: string = '' ) {

    query = query.trim().toLocaleLowerCase();

    if( !this._historial.includes( query )){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10); //Me muestra solo 10 elementos en la barra lateral de historial de busqueda

      localStorage.setItem('historial', JSON.stringify(this._historial) ); //el JSON puede tomar cualquier obejto y lo convierte a String
    }

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '10')
          .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params }) //Petición con el módulo de angular http son mejores, ya que nos retornan obserbable, que nos deja añadir funcionalidades a la hora de hacer la petición, puedo mapear la respuesta, concatenar otras cosas ... 
    .subscribe( ( resp ) => {
      this.resultados = resp.data;
      localStorage.setItem('resultados', JSON.stringify( this.resultados ) );
    })
  }
}
