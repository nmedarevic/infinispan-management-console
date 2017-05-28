export class NewSniComponent {

  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      addAction: '&',
      hotrod: '<'
    };
    this.controller = function() {
      this.hostName = '';
      this.securityRealm = '';
      this.addSni = () => {
        this.addAction({
          $event: {
            hostName: this.hostName, 
            securityRealm: this.securityRealm,
            hotrod: this.hotrod
          }
        });
        this.hostName = '';
        this.securityRealm = '';
      }
    };
    this.templateUrl = 'components/endpoint-configuration/components/new-sni/new-sni.component.html';
  }
};
