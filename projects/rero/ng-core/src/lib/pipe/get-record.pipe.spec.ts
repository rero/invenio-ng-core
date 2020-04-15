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
import { Observable, of } from 'rxjs';
import { RecordService } from '../record/record.service';
import { GetRecordPipe } from './get-record.pipe';

class RecordServiceMock {
  getRecord(type: string, pid: string, resolve = 0): Observable<any> {
    return of({ metadata: { pid, name: 'foo' }});
  }
}

describe('GetRecordPipe', () => {
  it('create an instance', () => {
    const pipe = new GetRecordPipe(new RecordServiceMock() as RecordService);
    expect(pipe).toBeTruthy();
  });

  it('transform with $ref return object', () => {
    const pipe = new GetRecordPipe(new RecordServiceMock() as RecordService);
    pipe.transform('http://foo/1', 'resource').subscribe((result: object) => {
      expect(result).toEqual({metadata: { pid: '1', name: 'foo' }});
    });
  });

  it('transform with id return name', () => {
    const pipe = new GetRecordPipe(new RecordServiceMock() as RecordService);
    pipe.transform('10', 'resource', 'field', 'name').subscribe((result: string) => {
      expect(result).toEqual('foo');
    });
  });

  it('transform return null', () => {
    const pipe = new GetRecordPipe(new RecordServiceMock() as RecordService);
    pipe.transform('12', 'resource', 'field', 'foo').subscribe((result: string) => {
      expect(result).toBeNull();
    });
  });
});
