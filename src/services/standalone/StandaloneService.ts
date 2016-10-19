import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import IQService = angular.IQService;
import {IDmrRequest} from "../dmr/IDmrRequest";

const module: ng.IModule = App.module("managementConsole.services.standalone", []);

export class StandaloneService {

  static $inject: string[] = ["$q", "dmrService"];

  constructor(private $q: IQService,
              private dmrService: DmrService) {
  }

  isClustered(): ng.IPromise<boolean> {
    let deferred: ng.IDeferred<boolean> = this.$q.defer<boolean>();
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("subsystem", "datagrid-jgroups")
    };
    this.dmrService.readChildResources(request).then((response) => {
      deferred.resolve(true);
    }).catch(() => {
      deferred.resolve(false);
    });
    return deferred.promise;
  }
}

module.service("standaloneService", StandaloneService);
