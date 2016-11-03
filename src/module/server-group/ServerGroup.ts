import {App} from "../../ManagementConsole";
import "../../services/dmr/DmrService";
import {ServerGroupCtrl} from "./ServerGroupCtrl";
import {IStateParamsService} from "angular-ui-router";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";
import {IServerGroup} from "../../services/server-group/IServerGroup";
import {IRedirectState} from "../../common/IRedirectState";
import {serverFilter} from "./nodes/ServerGroupFilter";
import {NodesCtrl} from "./nodes/NodesCtrl";
import {NodesMemoryCtrl} from "./memory/NodesMemoryCtrl";
import {ServerService} from "../../services/server/ServerService";
import {MemoryData} from "../../components/memory/MemoryData";
import IQService = angular.IQService;
import {IMap} from "../../common/utils/IMap";

const module: ng.IModule = App.module("managementConsole.server-group", []);

module.controller("ServerGroupCtrl", ServerGroupCtrl);
module.filter("serverFilter", serverFilter);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("server-group", <IRedirectState>{
    parent: "root",
    url: "server-groups/:serverGroup",
    templateUrl: "module/server-group/view/server-group.html",
    controller: ServerGroupCtrl,
    redirectTo: "server-group.nodes",
    controllerAs: "ctrl",
    resolve: {
      serverGroup: ["$stateParams", "serverGroupService", ($stateParams, serverGroupService: ServerGroupService) => {
        // TODO add serverGroup object as optional parameter and if exists don't call service again unless refresh is true
        let serverGroup: string = $stateParams.serverGroup;
        return serverGroupService.getServerGroupMapWithMembers(serverGroup);
      }],
      available: ["$stateParams", "serverGroupService", "serverGroup",
        ($stateParams: IStateParamsService, serverGroupService: ServerGroupService, serverGroup: IServerGroup) => {
          return serverGroupService.isGroupAvailable(serverGroup);
        }]
    }
  });

  $stateProvider.state("server-group.nodes", {
    url: "/nodes",
    templateUrl: "module/server-group/nodes/view/nodes.html",
    controller: NodesCtrl,
    controllerAs: "ctrl",
  });

  $stateProvider.state("server-group.memory", {
    url: "/memory",
    templateUrl: "module/server-group/memory/view/memory.html",
    controller: NodesMemoryCtrl,
    controllerAs: "ctrl",
    resolve: {
      serverMemoryData: ["$q", "$stateParams", "serverService", "serverGroup",
        ($q: IQService, $stateParams: IStateParamsService, serverService: ServerService, serverGroup: IServerGroup) => {
          let deferred: ng.IDeferred<IMap<MemoryData>> = $q.defer<IMap<MemoryData>>();
          let responses: IMap<MemoryData> = {};
          for (let member of serverGroup.members) {
            serverService.getServerMemoryStats(member).then((response: MemoryData) => {
              responses[member.toString()] = response;
            });
          }
          deferred.resolve(responses);
          return deferred.promise;
        }],
    }
  });
});
