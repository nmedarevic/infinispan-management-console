import {IStateService} from "angular-ui-router";
import {AbstractConfigurationCtrl} from "../../../../common/configuration/AbstractConfigurationCtrl";
import IModalService = angular.ui.bootstrap.IModalService;
import {LaunchTypeService} from "../../../../services/launchtype/LaunchTypeService";
import {ServerGroupService} from "../../../../services/server-group/ServerGroupService";
import {IServerGroup} from "../../../../services/server-group/IServerGroup";
import {IEndpoint} from "../../../../services/endpoint/IEndpoint";

export class EndpointConfigCtrl extends AbstractConfigurationCtrl {
  static $inject: string[] = ["$state", "$scope", "$uibModal", "serverGroupService", "launchType", "serverGroup", "endpoint", "endpointMeta", "endpointType", "endpointName"];

  readOnlyFields: string[];

  private typeChangeCancelled: boolean = false;

  constructor(private $state: IStateService,
              private $scope: ng.IScope,
              private $uibModal: IModalService,
              private serverGroupService: ServerGroupService,
              private launchType: LaunchTypeService,
              private serverGroup: IServerGroup,
              private endpoint: IEndpoint,
              private endpointMeta: any,
              private endpointType: string,
              private endpointName: string) {
    super();
    /*if (!this.isEditMode()) {
      setIsNewNodeRecursively(this.template);
    }*/
  }

  goToContainerCachesView(): void {
    this.$state.go("container.caches", {
      //profileName: this.profile,
      //containerName: this.containerName
    });
  }

  isEditMode(): boolean {
    //return this.$state.current.name === "edit-cache-config";
    return true;
  }

  isTemplateNameEmpty(): boolean {
    //let templateName: string = this.template["template-name"];
    //return !(isNotNullOrUndefined(templateName) && isNonEmptyString(templateName));
    return true;
  }

  createCache(): void {
    /*openConfirmationModal(this.$uibModal, "Create " + this.cacheName + " cache using " + this.template.baseTemplate + " configuration template?")
      .result.then(() => {
      this.cacheService.createCacheAndConfiguration(this.container, this.template.type, this.template["template-name"], this.template)
        .then(() => this.goToContainerCachesView(), error => openErrorModal(this.$uibModal, error));
    });*/
  }

  updateTemplate(): void {

  }

  private reloadMetaAndDataOnTypeChange(newType: string, oldType: string): void {

  }
}
