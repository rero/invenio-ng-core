
/*
 * Invenio angular core
 * Copyright (C) 2020 RERO
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
import { RouteInterface } from '@rero/ng-core';
import { DocumentComponent } from '../record/document/document.component';

export class DocumentsHevsRoute implements RouteInterface {

  /** Route name */
  readonly name = 'documents_hevs';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      path: 'hevs/record/search',
      loadChildren: () => import('../record-wrapper/record-wrapper.module').then(m => m.RecordWrapperModule),
      data: {
        showSearchInput: true,
        adminMode: false,
        types: [
          {
            key: 'documents',
            label: 'Documents',
            component: DocumentComponent,
            preFilters: {
              institution: 'hevs'
            }
          }
        ]
      }
    };
  }
}
