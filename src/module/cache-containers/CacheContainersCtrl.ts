import {ContainerService} from "../../services/container/ContainerService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {IDomain} from "../../services/domain/IDomain";
import {DomainService} from "../../services/domain/DomainService";
import {JGroupsService} from "../../services/jgroups/JGroupsService";
import {ClusterEventsService} from "../../services/cluster-events/ClusterEventsService";
import {IClusterEvent} from "../../services/cluster-events/IClusterEvent";
import {IMap} from "../../common/utils/IMap";
import {isNotNullOrUndefined, getArraySize} from "../../common/utils/Utils";
import {IEndpoint} from "../../services/endpoint/IEndpoint";
import {ISocketBinding} from "../../services/socket-binding/ISocketBinding";
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";
import {ModalService} from '../../services/modal/ModalService';
import IQService = angular.IQService;

export class CacheContainersCtrl {

  static $inject: string[] = ["containerService", "domainService", "jGroupsService", "clusterEventsService", "containers", "launchType", "modalService", "$state", "$q"];

  domain: IDomain;
  stacks: IMap<string>;
  gridEvents: IClusterEvent[] = [];
  rebalancingStatuses: any[] = [];

  constructor(private containerService: ContainerService,
              private domainService: DomainService,
              private jGroupsService: JGroupsService,
              private clusterEventsService: ClusterEventsService,
              public containers: ICacheContainer[],
              private launchType: LaunchTypeService,
              private modalService: ModalService,
              private $state: any,
              private $q: IQService) {
    if (this.jGroupsService.hasJGroupsStack()) {
      this.domainService.getHostsAndServers()
        .then((domain) => {
          this.domain = domain;
          return this.jGroupsService.getDefaultStackServerGroupMap(domain.controller);
        })
        .then((stacks) => this.stacks = stacks);

      this.getAllClusterEvents();
    }

    this.initRebalancingStatuses(this.containers).then(statuses => {
      console.log(statuses);
      this.rebalancingStatuses = statuses;
    })
  }

  private initRebalancingStatuses(allContainers: ICacheContainer[]): ng.IPromise<any[]> {
    const defered = this.$q.defer<any>();
    const containerReducerFn = (acc: any, tally: ICacheContainer): any[] => {
        acc.push(this.containerService.isRebalancingEnabled(tally));
       return acc;
    };

    const statusReducerFn = (acc: any, tally: boolean, index: number):any[] => {
      acc.push({
        profile: allContainers[index].profile,
        status: tally
      });
      return acc;
    };

    const containerPromises = allContainers.reduce(containerReducerFn, []);

    this.$q.all(containerPromises).then(containerStatuses => {
      const statuses = containerStatuses.reduce(statusReducerFn, []); 
      defered.resolve(statuses);
    });

    return defered.promise;
  }

  getContainerId(name: string, container: ICacheContainer): string {
    return container.profile + "." + container.name + "." + name;
  }

  getDefaultStack(container: ICacheContainer): string {
    if (isNotNullOrUndefined(this.stacks)) {
      let serverGroup: string = container.serverGroup.name;
      return this.stacks[serverGroup];
    }
    return "";
  }

  getAvailabilityClass(container: ICacheContainer): string {
    return container.available ? "label-success" : "label-danger";
  }

  getAvailability(container: ICacheContainer): string {
    return container.available ? "AVAILABLE" : "DEGRADED";
  }

  isSitesEmpty(container: ICacheContainer): boolean {
    return getArraySize(container["sites-online"]) + getArraySize(container["sites-offline"]) +
      getArraySize(container["sites-mixed"]) === 0;
  }

  displayEndpoint(endpoint: IEndpoint): string {
    let socketBinding: ISocketBinding = endpoint.getSocketBinding();
    if (isNotNullOrUndefined(socketBinding)) {
      return socketBinding.name + " : " + socketBinding.port + " " + (isNotNullOrUndefined(endpoint.getEncryption())?"encrypted":"");
    }
  }

  isMultiTenantRouter(endpoint: IEndpoint): boolean {
    return isNotNullOrUndefined(endpoint) &&
      endpoint.isMultiTenant();
  }

  getAllClusterEvents(): void {
    for (let container of this.containers) {
      this.clusterEventsService.fetchClusterEvents(container, 10)
        .then((events) => this.gridEvents = this.gridEvents.concat(events));
    }
  }

  isStandaloneLocalMode(): boolean {
    return !this.jGroupsService.hasJGroupsStack();
  }

  isLocalMode(): boolean {
    return this.launchType.isStandaloneLocalMode();
  }

  enableContainerRebalance(container): void {
    this.modalService.createRebalanceModal(true, "ENABLE rebalancing for cache container?", container)
    .then(() => {
      this.$state.reload();
    });
  }

  disableContainerRebalance(container): void {
    this.modalService.createRebalanceModal(false, "DISABLE rebalancing for cache container?", container)
    .then(() => {
      this.$state.reload();
    });
  }
}
