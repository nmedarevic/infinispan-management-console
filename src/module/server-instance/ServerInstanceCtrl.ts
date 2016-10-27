import {openConfirmationModal} from "../../common/dialogs/Modals";
import {ServerService} from "../../services/server/ServerService";
import {IServerAddress} from "../../services/server/IServerAddress";
import {IServer} from "../../services/server/IServer";
import {IIntervalService} from "angular";
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import IModalService = angular.ui.bootstrap.IModalService;
import {IStateService} from "angular-ui-router";
import {MemoryData} from "../../components/memory/MemoryData";

export class ServerInstanceCtrl {
  static $inject: string[] = ["$state", "$interval", "$uibModal", "serverService", "coord", "serverInstance"];

  private data: MemoryData;
  private nodeStats: any;

  constructor(private $state: IStateService, private $interval: IIntervalService, private $uibModal: IModalService,
              private serverService: ServerService, private coord: IServerAddress, private serverInstance: IServer) {
    this.$interval(() => (this.refreshStats()), 500, 1);
  }

  refreshStats(): void {
    let server: IServerAddress = this.serverInstance.address;
    this.fetchThreadAndMemoryStats(server);
    this.fetchAggregateNodeStats(server);
  }

  fetchThreadAndMemoryStats(address: IServerAddress): void {
    this.serverService.getServerMemoryStats(address).then((response: MemoryData) => {
      this.data = response;
    });
  }

  getMemoryChartData(): MemoryData {
    return this.data;
  }

  fetchAggregateNodeStats(address: IServerAddress): void {

    this.serverService.getAggregateNodeStats(address).then(response => {
      // TODO here we need to loop through all cache containers and add all stats up
      // but for now just use the first container found
      let containersRoot: any = response["cache-container"];
      for (var prop in containersRoot) {
        this.nodeStats = containersRoot[prop];
        break;
      }
    });
  }

  isCoordinator(): boolean {
    return this.serverInstance.address.host === this.coord.host && this.serverInstance.address.name === this.coord.name;
  };

  createStartModal(): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal, "Start server " + this.serverInstance.address.name + "?");
    modal.result.then(() => {
      let promise: ng.IPromise<string> = this.serverService.startServer(this.serverInstance.address);
      promise.then(() => this.refresh());
    });
  }

  createStopModal(): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal, "Stop server " + this.serverInstance.address.name + "?");
    modal.result.then(() => {
      let promise: ng.IPromise<string> = this.serverService.stopServer(this.serverInstance.address);
      promise.then(() => this.refresh());
    });
  }

  createRemoveModal(): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal, "Remove server " +
      this.serverInstance.address.name + " from " + this.serverInstance.serverGroup + "?");
    modal.result.then(() => {
      let promise: ng.IPromise<string> = this.serverService.removeServer(this.serverInstance.address);
      promise.then(() => this.refresh());
    });
  }

  private refresh(): void {
    this.$state.reload();
    this.refreshStats();
  }
}
