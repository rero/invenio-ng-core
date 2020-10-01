/*
 * RERO angular core
 * Copyright (C) 2020 RERO
 * Copyright (C) 2020 UCLouvain
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '../../../record.service';
import { TemplatesService } from '../../services/templates.service';

@Component({
  selector: 'ng-core-load-template-form',
  templateUrl: './load-template-form.component.html'
})
export class LoadTemplateFormComponent implements OnInit {

  /** form group */
  form: FormGroup = new FormGroup({});

  /** fields config of the form */
  formFields: FormlyFieldConfig[] = [];

  /** model of the form */
  model: FormModel;


  /**
   * constructor
   * @param _modalService: BsModalService
   * @param _recordService: RecordService
   * @param _templateService: TemplateService
   * @param _translateService: TranslateService
   * @param _bsModalRef: BsModalRef
   * @param _router: Router
   * @param _toastrService: ToastrService
   */
  constructor(
      private _modalService: BsModalService,
      private _recordService: RecordService,
      private _templateService: TemplatesService,
      private _translateService: TranslateService,
      protected _bsModalRef: BsModalRef,
      private _router: Router,
      private _toastrService: ToastrService,
      private _route: ActivatedRoute
  ) { }

  /**
   * hook OnInit
   */
  ngOnInit() {
    const initialState: any = this._modalService.config.initialState;
    this.formFields.push({
      key: 'template',
      type: 'select',
      templateOptions: {
        required: true,
        placeholder: this._translateService.instant('Select…'),
        options: [],
        attributes: {
          size: 10
        }
      }
    });

    this._templateService.getTemplates(initialState.templateResourceType, initialState.resourceType).subscribe(
        (templates) => {
          templates = templates.map(hit => {
            const data = {
              label: hit.name,
              value: hit.pid,
              group: null,
            };
            if (hit.hasOwnProperty('visibility')) {
              data.group = (hit.visibility === 'public')
                  ? this._translateService.instant('Public templates')
                  : this._translateService.instant('My private templates');
            }
            return data;
          });
          this.formFields[0].templateOptions.options = templates;
        }
    );
  }

  /**
   * Submit form hook.
   * Redirect to the same editor form url with query params related to the selected template.
   */
  onSubmitForm() {
    const formValues = this.form.value;
    this._recordService.getRecord('templates', formValues.template).subscribe(
        (template) => {
          const params = {...this._route.snapshot.queryParams, ...{source: 'templates', pid: template.metadata.pid}};
          this._router.navigate([], {queryParams: params});
          this.closeModal();
        },
        (error) => {
          this._toastrService.error(error.message);
        }
    );
  }

  /**
   * Close the modal dialog box
   */
  closeModal() {
    this._bsModalRef.hide();
  }

}

/**
 * Interface to define fields on form
 */
interface FormModel {
  template?: string;
}
