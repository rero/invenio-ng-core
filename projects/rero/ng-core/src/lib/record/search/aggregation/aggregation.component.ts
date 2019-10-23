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
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ng-core-record-search-aggregation',
  templateUrl: './aggregation.component.html',
})
export class RecordSearchAggregationComponent {
  /**
   * Aggregation data
   */
  @Input()
  public aggregation: { key: string, value: { buckets: {}[] } };

  /**
   * Selected value for filter
   */
  @Input()
  public selectedValues: string[] = [];

  /**
   * Show or hide filter items
   */
  @Input()
  public expand = true;

  /**
   * Emit event to parent when a value is clicked
   */
  @Output()
  public updateAggregationFilter = new EventEmitter<{ term: string, values: string[] }>();

  /**
   * Constructor
   * @param translate TranslateService
   */
  constructor(private translate: TranslateService) {}

  /**
   * Interface language
   */
  get language() {
    return this.translate.currentLang;
  }

  /**
   * Check if a value is already registered in filters.
   * @param value - string, filter value
   */
  isSelected(value: string) {
    return this.selectedValues.includes(value);
  }

  /**
   * Update selected values with given value and emit event to parent
   * @param value - string, filter value
   */
  updateFilter(value: string) {
    if (this.isSelected(value)) {
      this.selectedValues = this.selectedValues.filter(selectedValue => selectedValue !== value);
    } else {
      this.selectedValues.push(value);
    }

    this.updateAggregationFilter.emit({ term: this.aggregation.key, values: this.selectedValues });
  }

  /**
   * Show filter values
   */
  showAggregation() {
    return this.expand || this.selectedValues.length > 0;
  }
}
