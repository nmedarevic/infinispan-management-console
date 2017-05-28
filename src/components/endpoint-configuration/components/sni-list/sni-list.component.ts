export class SniListComponent {

  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      addAction: '&',
      removeAction: '&',
      parent: '<',
      listId: '@'
    };
    this.controller = function() {
      console.log('list');
      this.$onInit = () => {
        console.log(this.parent, this.addAction);
      }
      this.add = ($event) => {
        console.log($event);
          this.addAction({
            $event: $event
          });
      } 
    };
    this.templateUrl = 'components/endpoint-configuration/components/sni-list/sni-list.component.html';
  }
};
