import {App} from "../../ManagementConsole";
import "../../services/dmr/DmrService";
import {ServerGroupCtrl} from "./ServerGroupCtrl";
import {EndpointsCtrl} from "./endpoints/EndpointsCtrl";
import {serverFilter} from "./nodes/filters/ServerGroupFilter";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";
import {IServerGroup} from "../../services/server-group/IServerGroup";
import {IRedirectState} from "../../common/IRedirectState";
import {EndpointService} from "../../services/endpoint/EndpointService";
import {endpointFilter} from "./endpoints/filters/EndpointFilter";
import {EndpointConfigCtrl} from "./endpoints/config/EndpointConfigCtrl";

const module: ng.IModule = App.module("managementConsole.server-group", []);

module.controller("ServerGroupCtrl", ServerGroupCtrl);
module.filter("serverFilter", serverFilter);
module.filter("endpointFilter", endpointFilter);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("server-group", <IRedirectState>{
    parent: "root",
    url: "server-groups/:serverGroup",
    templateUrl: "module/server-group/view/server-group.html",
    controller: ServerGroupCtrl,
    controllerAs: "ctrl",
    redirectTo: "server-group.nodes",
    resolve: {
      serverGroup: ["$stateParams", "serverGroupService", ($stateParams, serverGroupService) => {
        // TODO add serverGroup object as optional parameter and if exists don't call service again unless refresh is true
        let serverGroup: string = $stateParams.serverGroup;
        return serverGroupService.getServerGroupMapWithMembers(serverGroup);
      }],
      available: ["serverGroupService", "serverGroup",
        (serverGroupService:ServerGroupService, serverGroup:IServerGroup) => {
        return serverGroupService.isGroupAvailable(serverGroup);
      }],
      status: ["serverGroupService", "serverGroup",
        (serverGroupService:ServerGroupService, serverGroup:IServerGroup) => {
          return serverGroupService.getServerGroupStatus(serverGroup);
        }]
    }
  });
  $stateProvider.state("server-group.nodes", {
    url: "/nodes",
    templateUrl: "module/server-group/nodes/view/server-group.html"
  });

  $stateProvider.state("server-group.endpoints", {
    url: "/endpoints",
    controller: EndpointsCtrl,
    controllerAs: "ctrl",
    templateUrl: "module/server-group/endpoints/view/endpoints.html",
    resolve: {
      endpoints: ["endpointService", "serverGroup",
        (endpointService: EndpointService, serverGroup: IServerGroup) => {
          return endpointService.getAllClusterEndpoints(serverGroup);
        }],
    }
  });

  $stateProvider.state("server-group.edit-endpoint-config", {
    url: "/endpoints/:endpointType/:endpointName/config",
    controller: EndpointConfigCtrl,
    controllerAs: "ctrl",
    templateUrl: "module/server-group/endpoints/config/view/endpoint-config.html",
    resolve: {
      endpointName: ["$stateParams", ($stateParams) => $stateParams.endpointName],
      endpointType: ["$stateParams", ($stateParams) => $stateParams.endpointType]
    }
  });
});
