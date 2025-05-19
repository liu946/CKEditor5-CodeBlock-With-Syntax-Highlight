/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module code-block/codeblockui
 */

import { Plugin, Collection, Model, SplitButtonView, createDropdown, addListToDropdown, ViewModel } from 'ckeditor5';
import { getNormalizedAndLocalizedLanguageDefinitions } from './utils';

import '../theme/codeblock.css';
import 'highlight.js/styles/github.css';

/**
 * The code block UI plugin.
 *
 * Introduces the `'codeBlock'` dropdown.
 *
 * @extends module:core/plugin~Plugin
 */
export default class CodeBlockUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;
		const componentFactory = editor.ui.componentFactory;
		const normalizedLanguageDefs = getNormalizedAndLocalizedLanguageDefinitions(editor);
		const defaultLanguageDefinition = normalizedLanguageDefs[0];

		componentFactory.add('codeBlock', locale => {
			const command = editor.commands.get('codeBlock');
			const dropdownView = createDropdown(locale, SplitButtonView);
			const splitButtonView = dropdownView.buttonView;

			splitButtonView.set({
				label: t('Insert code block'),
				tooltip: true,
				icon: '<svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 6 3 L 6 29 L 26 29 L 26 9.59375 L 25.71875 9.28125 L 19.71875 3.28125 L 19.40625 3 Z M 8 5 L 18 5 L 18 11 L 24 11 L 24 27 L 8 27 Z M 20 6.4375 L 22.5625 9 L 20 9 Z M 16 13 L 14 25 L 16 25 L 18 13 Z M 12.21875 15.375 L 9.71875 18.375 L 9.1875 19 L 9.71875 19.625 L 12.21875 22.625 L 13.78125 21.375 L 11.8125 19 L 13.78125 16.625 Z M 19.78125 15.375 L 18.21875 16.625 L 20.1875 19 L 18.21875 21.375 L 19.78125 22.625 L 22.28125 19.625 L 22.8125 19 L 22.28125 18.375 Z"></path></g></svg>',
				isToggleable: true
			});

			splitButtonView.bind('isOn').to(command, 'value', value => !!value);

			splitButtonView.on('execute', () => {
				editor.execute('codeBlock', {
					language: defaultLanguageDefinition.language
				});

				editor.editing.view.focus();
			});

			dropdownView.on('execute', evt => {
				editor.execute('codeBlock', {
					language: evt.source._codeBlockLanguage,
					forceValue: true
				});

				editor.editing.view.focus();
			});

			dropdownView.class = 'ck-code-block-dropdown';
			dropdownView.bind('isEnabled').to(command);

			addListToDropdown(dropdownView, this._getLanguageListItemDefinitions(normalizedLanguageDefs));

			return dropdownView;
		});
	}

	/**
	 * A helper returning a collection of the `codeBlock` dropdown items representing languages
	 * available for the user to choose from.
	 *
	 * @private
	 * @param {Array.<module:code-block/codeblock~CodeBlockLanguageDefinition>} normalizedLanguageDefs
	 * @returns {Iterable.<module:ui/dropdown/utils~ListDropdownItemDefinition>}
	 */
	_getLanguageListItemDefinitions(normalizedLanguageDefs) {
		const editor = this.editor;
		const command = editor.commands.get('codeBlock');
		const itemDefinitions = new Collection();

		for (const languageDef of normalizedLanguageDefs) {
			const definition = {
				type: 'button',
				model: new ViewModel({
					_codeBlockLanguage: languageDef.language,
					label: languageDef.label,
					withText: true,
				})
			};

			definition.model.bind('isOn').to(command, 'value', value => {
				return value === definition.model._codeBlockLanguage;
			});

			itemDefinitions.add(definition);
		}

		return itemDefinitions;
	}
}
