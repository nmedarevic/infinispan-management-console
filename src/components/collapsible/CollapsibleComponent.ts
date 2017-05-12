import {CollapsibleComponentCtrl} from './CollapsibleComponentCtrl';

export class CollapsibleComponent {
  templateUrl: string;
  controller: any;
  transclude: any = {
    title: 'span',
    content: 'div'
  };

  constructor() {
    this.templateUrl  = 'components/collapsible/view/collapsible-component.html';
    this.controller   = CollapsibleComponentCtrl;
  }
}