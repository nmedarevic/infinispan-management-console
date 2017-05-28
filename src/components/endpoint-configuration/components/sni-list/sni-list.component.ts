export class SniListComponent {

  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      addAction: '&',
      parent: '<',
      listId: '@'
    };
    this.controller = function() {
      this.add = ($event) => {
          this.addAction({
            $event: $event
          });
      };
    };
    this.templateUrl = 'components/endpoint-configuration/components/sni-list/sni-list.component.html';
  }
};
