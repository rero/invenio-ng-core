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

import { AbstractControl } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { JsonSchemaFormService } from 'angular6-json-schema-form';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { RecordService } from '../../record.service';
import { TypeaheadMatch } from 'ngx-bootstrap';
// import { UserService } from '../../../user.service';
import { TranslateService} from '@ngx-translate/core';
import moment from 'moment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-mef',
  templateUrl: './mef.component.html',
  styleUrls: ['./mef.component.scss']
})
export class MefComponent implements OnInit, OnDestroy {
  formControl: AbstractControl;
  controlName: string;
  controlValue: string;
  controlDisabled = false;
  boundControl = false;
  options: any;
  autoCompleteList: string[] = [];
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  asyncSelected = {
    name: undefined,
    ref: undefined,
    query: undefined,
    category: undefined
  };
  dataSource: Observable<any>;
  typeaheadLoading: boolean;
  private currentLocale = undefined;
  private userSettings = undefined;

  constructor(
    private jsf: JsonSchemaFormService,
    private recordService: RecordService,
    // private userService: UserService,
    private translateService: TranslateService
    ) {
  }

  extractDate(date: string) {
    const mDate: moment.Moment = moment(date, ['YYYY', 'YYYY-MM', 'YYYY-MM-DD']);
    if (mDate.isValid()) {
      return mDate.format('YYYY');
    }
    return date;
  }

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    // this.userService.userSettings.subscribe(userSettings => this.userSettings = userSettings);
    this.jsf.initializeControl(this);
    if (this.controlValue) {
      const pid = this.controlValue.split('/').pop();
      // TODO should use getRecord but doesn't contain sources property
      this.recordService.getRecords('mef', `pid:${pid}`, 1, 1).pipe(
        map(records =>
          records.hits.hits[0]
        )).subscribe( authority => {
        this.asyncSelected = {
          name: this.getName(authority.metadata),
          ref: this.controlValue,
          query: undefined,
          category: this.translateService.instant('link to authority')
        };
        this.jsf.updateValue(this, this.controlValue);
      });
    } else {
      const name = this.formControl.parent.get('name').value;
      this.asyncSelected = {
        name,
        ref: undefined,
        query: name,
        category: this.translateService.instant('create')
      };
    }
    this.dataSource = new Observable((observer: any) => {
      // Runs on every search
      observer.next(this.asyncSelected);
    })
    .pipe(
      mergeMap((token: any) => this.getAuthoritySuggestions(token.query))
      );
  }

  valueChanged(value) {
    const formControlParent = this.formControl.parent;
    formControlParent.get('name').setValue(value);
  }

  getAuthoritySuggestions(query) {
    if (!query) {
      return of([]);
    }
    const esQuery = `\\*.preferred_name_for_person:'${query}'`;
    return this.recordService.getRecords('mef', esQuery, 1, 10).pipe(
      map(results => {
        const names = [{
          name: query,
          ref: undefined,
          query,
          category: this.translateService.instant('create')
        }];
        if (!results) {
          return [];
        }
        results.hits.hits.map(hit => {
          names.push({
            name: this.getName(hit.metadata),
            ref: `https://mef.rero.ch/api/mef/${hit.metadata.pid}`,
            query,
            category: this.translateService.instant('link to authority')
          });
        });
        return names;
      })
      );
  }

  getName(metadata) {
    for (const source of metadata.sources) {
      if (metadata[source]) {
        const data = metadata[source];
        let name = data.preferred_name_for_person;
        if (data.date_of_birth || data.date_of_death) {
          name += ', ';
          if (data.date_of_birth) {
            name += this.extractDate(data.date_of_birth);
          }
          name += ' - ';
          if (data.date_of_death) {
            name += this.extractDate(data.date_of_death);
          }
        }
        return name + ' (' + source + ')';
      }
    }
  }

  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    const formControlParent = this.formControl.parent;

    if (e.item.ref !== undefined) {
      this.jsf.updateValue(this, e.item.ref);
      formControlParent.get('name').setValue(undefined);
      formControlParent.get('date').setValue(undefined);
      formControlParent.get('qualifier').setValue(undefined);
    } else {
      formControlParent.get('name').setValue(e.item.name);
    }
    this.asyncSelected = e.item;
  }

  ngOnDestroy() {
    const formControlParent = this.formControl.parent;

    // TODO: check to be sure that the value is submitted before this
    this.formControl.setValue(undefined);
    formControlParent.get('name').setValue(undefined);
    formControlParent.get('date').setValue(undefined);
    formControlParent.get('qualifier').setValue(undefined);
  }
}
