import {IStateService} from "angular-ui-router";
import {LaunchTypeService} from "../../../services/launchtype/LaunchTypeService";
import IModalService = angular.ui.bootstrap.IModalService;
import {IMap} from "../../../common/utils/IMap";
import {IServerAddress} from "../../../services/server/IServerAddress";
import {DmrService} from "../../../services/dmr/DmrService";
import {ServerGroupService} from "../../../services/server-group/ServerGroupService";
import {ServerService} from "../../../services/server/ServerService";
import {JGroupsService} from "../../../services/jgroups/JGroupsService";
import {IServerGroup} from "../../../services/server-group/IServerGroup";
import {isEmptyObject, isNullOrUndefined} from "../../../common/utils/Utils";
import {MemoryData} from "../../../components/memory/MemoryData";

export class NodesMemoryCtrl {
  static $inject: string[] = ["$state", "$uibModal", "dmrService", "serverGroupService", "serverService",
    "jGroupsService", "launchType", "serverMemoryData", "serverGroup", "available"];

  status: string = "DEGRADED";
  serverStatusMap: IMap<string> = {};
  serverInetMap: IMap<string> = {};
  coordinator: IServerAddress;
  hosts: string[];

  constructor(private $state: IStateService,
              private $uibModal: IModalService,
              private dmrService: DmrService,
              private serverGroupService: ServerGroupService,
              private serverService: ServerService,
              private jGroupsService: JGroupsService,
              private launchType: LaunchTypeService,
              private serverMemoryData: IMap<MemoryData>,
              public serverGroup: IServerGroup,
              public available: boolean) {
    this.fetchInetAddresses();
    this.hosts = this.filterUniqueHosts();
    this.status = available ? "STARTED" : "DEGRADED";
  }

  isCoordinator(server: IServerAddress): boolean {
    return (this.coordinator) ? this.coordinator.equals(server) : false;
  }

  isServerStopped(server: IServerAddress): boolean {
    return false;
  }

  getServerMemoryStats(server: IServerAddress): MemoryData {
    let key: string = server.toString();
    let result: MemoryData = this.serverMemoryData[key];
    return result;
  }

  getTotalServerMemoryStats(): MemoryData {
    return new MemoryData(8.2, 10.8, 4.2, 8.6);
  }

  getSGStatus(): string {
    return this.status;
  }

  getServerStatus(server: IServerAddress): string {
    if (isEmptyObject(this.serverStatusMap)) {
      return "";
    }
    return this.serverStatusMap[server.toString()];
  }

  getServerInetAddress(server: IServerAddress): string {
    if (isEmptyObject(this.serverInetMap) || isNullOrUndefined(server)) {
      return "";
    }
    return this.serverInetMap[server.toString()];
  }

  refresh(): void {
    this.dmrService.clearGetCache();
    this.$state.reload();
  }

  isDomainMode(): boolean {
    return this.launchType.isDomainMode();
  }

  private filterUniqueHosts(): string[] {
    return this.serverGroup.members
      .map((server) => server.host)
      .filter((item, post, array) => array.indexOf(item) === post);
  }

  private fetchInetAddresses(): void {
    this.serverGroupService.getServerInetAddresses(this.serverGroup).then((inetMap) => this.serverInetMap = inetMap);
  }
}
