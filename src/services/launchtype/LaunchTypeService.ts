import {App} from "../../ManagementConsole";
import {isNullOrUndefined} from "../../common/utils/Utils";
import ILocalStorageService = angular.local.storage.ILocalStorageService;
import {IServerAddress} from "../server/IServerAddress";

const module: ng.IModule = App.module("managementConsole.services.launchtype", []);

export class LaunchTypeService {

  static $inject: string[] = ["localStorageService"];
  static DOMAIN_MODE: string = "DOMAIN";
  static STANDALONE_MODE: string = "STANDALONE";

  constructor(private localStorageService: ILocalStorageService,
              private type: string) {
  }

  set(launchType: string): void {
    switch (launchType) {
      case LaunchTypeService.DOMAIN_MODE:
        this.type = launchType;
        break;
      case LaunchTypeService.STANDALONE_MODE:
        this.type = launchType;
        break;
      // throw "We only support Domain mode. Standalone mode is not supported in this release!";
      default:
        throw `Unknown launch type '${launchType}'. We only support Domain mode`;
    }
    this.localStorageService.set("launchType", launchType);
  }

  isDomainMode(): boolean {
    this.checkThatLaunchTypeExists();
    return LaunchTypeService.DOMAIN_MODE === this.type;
  }

  isStandaloneMode(): boolean {
    this.checkThatLaunchTypeExists();
    return LaunchTypeService.STANDALONE_MODE === this.type;
  }

  getProfilePath(profile: string): string [] {
    if (this.isDomainMode()) {
      return [].concat("profile", profile);
    } else if (this.isStandaloneMode()) {
      return [];
    }
  }

  getRuntimePath(server: IServerAddress): string [] {
    if (this.isDomainMode()) {
      return [].concat("host", server.host, "server", server.name);
    } else if (this.isStandaloneMode()) {
      return [];
    }
  }

  private checkThatLaunchTypeExists(): void {
    if (isNullOrUndefined(this.type)) {
      this.type = this.localStorageService.get<string>("launchType");
    }
  }

}

module.service("launchType", LaunchTypeService);
