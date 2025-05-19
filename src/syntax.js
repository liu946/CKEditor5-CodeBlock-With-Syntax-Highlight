import { Plugin } from 'ckeditor5';
import SyntaxEditing from './syntaxEditing.js'

export default class Syntax extends Plugin {
  static get requires() {
    return [SyntaxEditing]
  }

  init() {
    console.log('SyntaxPlugin#init() got called')
  }
}
