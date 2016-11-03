import {IServerGroup} from "../../services/server-group/IServerGroup";
import {IServerAddress} from "../../services/server/IServerAddress";
import {IStateService} from "angular-ui-router";
import {DmrService} from "../../services/dmr/DmrService";
import {IMap} from "../../common/utils/IMap";
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";

export class ServerGroupCtrl {
  static $inject: string[] = ["$state", "dmrService", "launchType", "serverGroup", "available"];

  status: string = "DEGRADED";
  serverStatusMap: IMap<string> = {};
  serverInetMap: IMap<string> = {};
  coordinator: IServerAddress;
  hosts: string[];

  constructor(private $state: IStateService,
              private dmrService: DmrService,
              private launchType: LaunchTypeService,
              public serverGroup: IServerGroup,
              public available: boolean) {
    this.status = available ? "STARTED" : "DEGRADED";
  }

  isCoordinator(server: IServerAddress): boolean {
    return (this.coordinator) ? this.coordinator.equals(server) : false;
  }

  getSGStatus(): string {
    return this.status;
  }

  refresh(): void {
    this.dmrService.clearGetCache();
    this.$state.reload();
  }

  isDomainMode(): boolean {
    return this.launchType.isDomainMode();
  }

}
