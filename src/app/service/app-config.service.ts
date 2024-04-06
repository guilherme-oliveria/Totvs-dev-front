import { Injectable } from '@angular/core';
import {Ambiente} from "../model/ambiente";
import {map, Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

export function initConfig(appConfigService: AppConfigService) {
  return () => appConfigService.loadConfig();
}
@Injectable(
  {
    providedIn: 'root'
  }
)
export class AppConfigService {
  private config: Ambiente | undefined;

  constructor(private http: HttpClient) {
    this.loadConfig().then(config => {
    });
  }

  async loadConfig(): Promise<string> {
     // @ts-ignore
    return await this.http.get('/assets/config.json').pipe(
      map(config => {
        // @ts-ignore
        this.config = new Ambiente(config['back']);
        return this.config.back;
      })
    ).toPromise();
  }

  get ambiente(): Ambiente {
    return <Ambiente>this.config;
  }
}
