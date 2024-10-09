/*
 * RERO angular core
 * Copyright (C) 2020-2024 RERO
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
import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

/**
 * Show dialog modal
 */
@Component({
  selector: 'ng-core-dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent {

  config: DynamicDialogConfig = inject(DynamicDialogConfig);
  protected ref: DynamicDialogRef = inject(DynamicDialogRef);

  confirm(): void {
    this.ref.close(true);
  }

  cancel(): void {
    this.ref.close(false)
  }
}
