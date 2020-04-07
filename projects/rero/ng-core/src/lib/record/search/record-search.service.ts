import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

export interface AggregationsFilter {
  key: string;
  values: Array<any>;
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class RecordSearchService {
  /** Aggregations filters array */
  private _aggregationsFilters: Array<AggregationsFilter> = null;

  /** Aggregations filters subject */
  private _aggregationsFiltersSubject: BehaviorSubject<Array<AggregationsFilter>>;

  /**
   * Constructor, initialize aggregations filters subject.
   */
  constructor() {
    this._aggregationsFiltersSubject = new BehaviorSubject(this._aggregationsFilters);
  }

  /**
   * Returns an observable which emits aggregations filters.
   */
  get aggregationsFilters(): Observable<Array<AggregationsFilter>> {
    return this._aggregationsFiltersSubject.asObservable();
  }

  /**
   * Set all aggregations filters and emit the list.
   * @param aggregationsFilters List of aggregations filters
   */
  setAggregationsFilters(aggregationsFilters: Array<AggregationsFilter>) {
    // TODO: If the filter is in a child bucket, checks if all parents are
    // selected, too. If not, adds all parents filters.

    if (JSON.stringify(this._aggregationsFilters) !== JSON.stringify(aggregationsFilters)) {
      // Filters are deep copied on assigning and sending, to avoid changes
      // outside the service on the local value.
      this._aggregationsFilters = cloneDeep(aggregationsFilters);
      this._aggregationsFiltersSubject.next(cloneDeep(this._aggregationsFilters));
    }
  }

  /**
   * Stores selected values for an aggregation or removes it if values are empty.
   * @param term Term (aggregation key)
   * @param values Selected values
   */
  updateAggregationFilter(term: string, values: string[]) {
    const index = this._aggregationsFilters.findIndex(item => item.key === term);

    if (values.length === 0) {
      // no more items selected, remove filter
      this._aggregationsFilters.splice(index, 1);
    } else {
      // In both cases values are affected with destructuring assignment, to
      // avoid values to be modified outside the service, as array are assigned
      // by reference.
      if (index !== -1) {
        // update existing filter
        this._aggregationsFilters[index] = { key: term, values: [...values] };
      } else {
        // add new filter
        this._aggregationsFilters.push({ key: term, values: [...values] });
      }
    }

    this._aggregationsFiltersSubject.next(cloneDeep(this._aggregationsFilters));
  }

  /**
   * Get filters of an aggregation
   * @param key Aggregation key
   */
  getAggregationFilters(key: string): Observable<Array<string>> {
    return this._aggregationsFiltersSubject.pipe(
      first(),
      map((aggregationsFilters: Array<AggregationsFilter>) => {
        const index = aggregationsFilters.findIndex(item => item.key === key);
        return index === -1 ? [] : aggregationsFilters[index].values;
      })
    );
  }

  /**
   * Removes the given value from selected filters and removes all children
   * selected values, too.
   * @param key Aggregation key
   * @param bucket Bucket containing the value to remove
   */
  removeAggregationFilter(key: string, bucket: any) {
    let aggregationsFilters = cloneDeep(this._aggregationsFilters);

    const index = aggregationsFilters.findIndex((item: any) => {
      return item.key === key;
    });

    let values = aggregationsFilters[index].values;

    // Remove selected value
    values = values.filter((selectedValue: string) => {
      return selectedValue !== bucket.key;
    });

    if (values.length === 0) {
      // No more selected values, remove key from aggregations filters.
      aggregationsFilters.splice(index, 1);
    } else {
      // re-assign filtered values
      aggregationsFilters[index].values = [...values];
    }

    // List of children keys to remove
    const keysToRemove = this.getKeysToRemove(bucket);

    // Remove all aggregations filters corresponding to children keys.
    aggregationsFilters = aggregationsFilters.filter((item: AggregationsFilter) => {
      return (!keysToRemove.includes(item.key));
    });

    // Update selected aggregations filters
    this.setAggregationsFilters(aggregationsFilters);
  }

  /**
   * Recursive method which collects all children aggregations keys to remove.
   * @param bucket Current bucket to check
   * @return List of keys to remove
   */
  private getKeysToRemove(bucket: any): Array<string> {
    let keys = [];

    for (const k in bucket) {
      if (bucket[k].buckets) {
        keys.push(k);

        bucket[k].buckets.forEach((childBucket: any) => {
          keys = [...keys, ...this.getKeysToRemove(childBucket)];
        });
      }
    }

    return keys;
  }
}
