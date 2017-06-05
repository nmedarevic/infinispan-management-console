export class SniModalCtrl {
  public hostName: string;
  public securityRealm: string;
  public sniName: string;

  static $injector: string[] = ['$scope'];
  constructor(public $scope: any) {
  }

  public saveSni() {
    this.$scope.$close({
      hostName: this.hostName,
      securityRealm: this.securityRealm
    })
  }
}