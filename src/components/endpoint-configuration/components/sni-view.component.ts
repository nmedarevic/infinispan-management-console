export class SniViewComponent {

  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      sni: '<'
    };
    this.controller = function() {
      this.$onInit = () => {
        const keys = Object.keys(this.sni);
        const sniName = keys[0] !== 'isExpanded' ? keys[0] : keys[1];
        const data = this.sni[sniName];
        this.sniName = sniName;
        this.data = data;
      };
    };
    this.templateUrl = 'components/endpoint-configuration/components/sni-view.component.html';
  }
};
