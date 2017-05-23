import IModalService = angular.ui.bootstrap.IModalService;
import {IServerGroup} from "../../../services/server-group/IServerGroup";
import {IEndpoint} from "../../../services/endpoint/IEndpoint";
import {AddEndpointModalCtrl} from "./AddEndpointModalCtrl";
import {isNotNullOrUndefined} from "../../../common/utils/Utils";
import {EndpointService} from "../../../services/endpoint/EndpointService";
import {CompositeOpBuilder} from "../../../services/dmr/CompositeOpBuilder";
import {DmrService} from "../../../services/dmr/DmrService";
import {IStateService} from "angular-ui-router";

export class EndpointsCtrl {
  static $inject: string[] = ["$uibModal", "$state", "endpointService", "dmrService", "serverGroup", "endpoints"];

  constructor(private $uibModal: IModalService,
              private $state: IStateService,
              private endpointService: EndpointService,
              private dmrService: DmrService,
              private serverGroup: IServerGroup,
              private endpoints: IEndpoint[]){
  }

  execute(): void{

  }

  save(endpoint: IEndpoint): void {
    this.endpointService.save(endpoint);
  }

  isEndpointEnabled(endpoint: IEndpoint): boolean {
    return true;
  }

  isEndpointDisabled(endpoint: IEndpoint): boolean {
    return !this.isEndpointEnabled(endpoint);
  }

  isMultiTenantRouter(endpoint: IEndpoint): boolean {
    return isNotNullOrUndefined(endpoint) &&
      endpoint.isMultiTenant();
  }

  createEndpointAndEdit(): void {
    let params: any = {
      endpointType: "hotrod-connector",
      endpointName: "test-connector",
      serverGroup: this.serverGroup.name
    };

    this.$state.go("new-endpoint-config", params);
  }

  createEndpointModal(): void {
    this.$uibModal.open({
      templateUrl: "module/server-group/endpoints/view/add-endpoint-modal.html",
      controller: AddEndpointModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        //container: (): ICacheContainer => this.container,
        //templates: (): ITemplate[] => this.templates
      }
    });
  }

}
