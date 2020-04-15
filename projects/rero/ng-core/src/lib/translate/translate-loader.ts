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
import { Inject } from '@angular/core';
import { TranslateLoader as BaseTranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { CoreConfigService } from '../core-config.service.js';
import de from './i18n/de.json';
import en from './i18n/en.json';
import fr from './i18n/fr.json';
import it from './i18n/it.json';

/**
 * Loader for translations used in ngx-translate library.
 */
export class TranslateLoader implements BaseTranslateLoader {
  /**
   * Store translations in available languages.
   */
  translations: object = { fr, de, en, it };

  /**
   * Constructor.
   *
   * @param _coreConfigService Configuration service.
   */
  constructor(@Inject(CoreConfigService) private _coreConfigService: CoreConfigService) {
    this.loadCustomTranslations();
  }

  /**
   * Load custom translations
   */
  private loadCustomTranslations() {
    if (!this._coreConfigService.customTranslations) {
      return;
    }

    for (const lang of this._coreConfigService.languages) {
      if (this.translations[lang] && this._coreConfigService.customTranslations[lang]) {
        this.translations[lang] = { ...this.translations[lang], ...this._coreConfigService.customTranslations[lang] };
      }
    }
  }

  /**
   * Return observable used by ngx-translate to get translations.
   * @param lang - string, language to rerieve translations from.
   */
  getTranslation(lang: string): Observable<any> {
    if (!this.translations[lang]) {
      throw new Error(`Translations not found for lang "${lang}"`);
    }
    return of(this.translations[lang]);
  }
}
