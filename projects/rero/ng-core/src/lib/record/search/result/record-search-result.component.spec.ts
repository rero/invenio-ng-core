/*
 * RERO angular core
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
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { CoreModule } from '../../../core.module';
import { JsonComponent } from './item/json.component';
import { RecordSearchResultComponent } from './record-search-result.component';
import { RecordSearchResultDirective } from './record-search-result.directive';

describe('RecordSearchResultComponent', () => {
  let component: RecordSearchResultComponent;
  let fixture: ComponentFixture<RecordSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        JsonComponent,
        RecordSearchResultDirective,
        RecordSearchResultComponent
      ],
      imports: [
        RouterTestingModule,
        ModalModule.forRoot(),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        ToastrModule.forRoot(),
        HttpClientModule,
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        CoreModule
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [JsonComponent],
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a custom component view', () => {
    component.itemViewComponent = JsonComponent;
    component.loadItemView();
    expect(component.searchResultItem).toBeDefined();
  });

  it('should delete record', () => {
    component.deletedRecord.subscribe((pid: string) => {
      expect(pid).toBe('1');
    });
    component.deleteRecord('1');
  });
});
