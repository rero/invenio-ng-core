/*
 * Invenio angular core
 * Copyright (C) 2019 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { Injectable, Inject } from '@angular/core';
import { CONFIG, Config } from '../core.config';

/**
 * Service giving information about API.
 */
@Injectable()
export class ApiService {
  /**
   * API base URL.
   * 
   * Ex: https://localhost:5000
   */
  private baseUrl: string = '';

  /**
   * API prefix
   * 
   * Ex: /api
   */
  private endpointPrefix: string = '/';

  /**
   * Constructor
   * @param config - Config, global configuration
   */
  constructor(@Inject(CONFIG) private config: Config) {
    this.baseUrl = this.config.apiBaseUrl;
    this.endpointPrefix = this.config.apiEndpointPrefix;
  }

  /**
   * Return invenio API Endpoint corresponding to type.
   * @param type - string, type of the resource
   * @param absolute - boolean, if absolute or relative url must be returned.
   */
  public getEndpointByType(type: string, absolute: boolean = false) {
    let endpoint = this.endpointPrefix + '/' + type;

    if (absolute === true) {
      endpoint = this.baseUrl + endpoint;
    }

    return endpoint;
  }
}
