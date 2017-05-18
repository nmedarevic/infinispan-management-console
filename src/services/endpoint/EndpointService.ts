import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IEndpoint} from "./IEndpoint";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {SocketBindingService} from "../socket-binding/SocketBindingService";
import {ISocketBinding} from "../socket-binding/ISocketBinding";
import IQService = angular.IQService;
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {
  isNotNullOrUndefined, traverse, deepValue, isNullOrUndefined, isObject,
  isJsonString, traverseObject
} from "../../common/utils/Utils";
import {ICacheContainer} from "../container/ICacheContainer";
import {IServerGroup} from "../server-group/IServerGroup";
import {IServerAddress} from "../server/IServerAddress";
import {CompositeOpBuilder, createWriteAttrReq} from "../dmr/CompositeOpBuilder";
import IPromise = angular.IPromise;
import {IProtocolConnector} from "./IProtocolConnector";
import {Endpoint} from "./Endpoint";

const module: ng.IModule = App.module("managementConsole.services.endpoint", []);

export class EndpointService {
  static $inject: string[] = ["$q", "dmrService", "socketBindingService", "launchType"];

  static parseEndpoint(namePath: string [], object: any, socketBinding?: ISocketBinding): IEndpoint {
    return new Endpoint(namePath, object, socketBinding);
  }

  constructor(private $q: IQService, private dmrService: DmrService,
              private socketBindingService: SocketBindingService, private launchType: LaunchTypeService) {
  }

  getAllEndpoints(cacheContainer: ICacheContainer): ng.IPromise<IEndpoint[]> {
    let request: IDmrRequest = <IDmrRequest>{
      address: this.getEndpointsRootAddress(cacheContainer.profile),
      recursive: true
    };
    let deferred: ng.IDeferred<IEndpoint[]> = this.$q.defer<IEndpoint[]>();

    this.dmrService.readResource(request)
      .then((endpointResponse: any): IEndpoint[] => {
        let endpoints: IEndpoint[] = [];
        let trail: String [] = [];
        traverse(endpointResponse, (key: string, value: string, trail: string []) => {
          let traversedObject: any = deepValue(endpointResponse, trail);
          let isEndpoint: boolean = isNotNullOrUndefined(traversedObject) && key === "cache-container";
          let isMultiRouterEndpoint: boolean = (isNotNullOrUndefined(traversedObject) && key === "hotrod-socket-binding");
          if (isEndpoint) {
            let endpoint: IEndpoint = EndpointService.parseEndpoint(trail, traversedObject);
            if (endpoint.getCacheContainer() === cacheContainer.name) {
              endpoints.push(endpoint);
            }
          } else if (isMultiRouterEndpoint) {
            let endpoint: IEndpoint = EndpointService.parseEndpoint(trail, traversedObject);
            endpoints.push(endpoint);
          }
        }, trail);
        return endpoints;
      })
      .then((endpoints) => {
        return this.socketBindingService.getAllSocketBindingsInGroup(cacheContainer.serverGroup["socket-binding-group"]).then((socketBindings) => {
          this.addSocketBindingToEndpoint(socketBindings, endpoints);
          deferred.resolve(endpoints);
        });
      });
    return deferred.promise;
  }

  getEndpoint(serverGroup: IServerGroup, endpointType: string, name: string): ng.IPromise<IEndpoint> {
    let resolvedName: string = isNotNullOrUndefined(name) ? name : endpointType;
    let request: IDmrRequest = <IDmrRequest>{
      address: this.getEndpointsRootAddress(serverGroup.profile).concat(endpointType).concat(resolvedName),
      recursive: true,
    };
    return this.dmrService.readResource(request);
  }

  getAllClusterEndpoints(serverGroup: IServerGroup): ng.IPromise<IEndpoint[]> {
    let request: IDmrRequest = <IDmrRequest>{
      address: this.getEndpointsRootAddress(serverGroup.profile),
      recursive: true
    };
    let deferred: ng.IDeferred<IEndpoint[]> = this.$q.defer<IEndpoint[]>();

    this.dmrService.readResource(request)
      .then((endpointResponse: any): IEndpoint[] => {
        let endpoints: IEndpoint[] = [];
        let trail: String [] = [];
        traverse(endpointResponse, (key: string, value: string, trail: string []) => {
          let traversedObject: any = deepValue(endpointResponse, trail);
          let isEndpoint: boolean = isNotNullOrUndefined(traversedObject) && key === "cache-container";
          let isMultiRouterEndpoint: boolean = (isNotNullOrUndefined(traversedObject) && key === "hotrod-socket-binding");
          if (isEndpoint) {
            let endpoint: IEndpoint = EndpointService.parseEndpoint(trail, traversedObject);
            endpoints.push(endpoint);
          } else if (isMultiRouterEndpoint) {
            let endpoint: IEndpoint = EndpointService.parseEndpoint(trail, traversedObject);
            endpoints.push(endpoint);
          }
        }, trail);
        return endpoints;
      })
      .then((endpoints) => {
        return this.socketBindingService.getAllSocketBindingsInGroup(serverGroup["socket-binding-group"]).then((socketBindings) => {
          this.addSocketBindingToEndpoint(socketBindings, endpoints);
          deferred.resolve(endpoints);
        });
      });
    return deferred.promise;
  }

  getConfigurationMeta(profile: string, endpointType: string, endpointName: string): ng.IPromise<any> {
    let deferred: ng.IDeferred<any> = this.$q.defer();
    let address: string[] = this.getEndpointsRootAddress(profile).concat(endpointType).concat(endpointType);
    this.dmrService.readResourceDescription({
      address: address,
      recursive: true
    }).then(
      response => {
        //TODO perhaps inspect and adjust the response
        deferred.resolve(response);
      },
      error => deferred.reject(error));
    return deferred.promise;
  }

  createDRMOps(endpoint: IEndpoint): CompositeOpBuilder {
    let builder: CompositeOpBuilder = new CompositeOpBuilder();
    let root: any = endpoint.getDMR();
    let dmrAddress: String [] = this.getEndpointAddress(endpoint, "clustered");
    this.traverseModelTree(builder, root, dmrAddress);
    console.log(builder);
    return builder;
  }

  traverseModelTree(builder: CompositeOpBuilder, dmrRoot: any, dmrAddress: string []) {
    //traverse the object tree
    traverseObject(dmrRoot, (key: string, value: any, trail: string []) => {
      this.visitTraversedObject(builder, value, trail.concat(key));
    }, dmrAddress);

    //and finally visit root object itself...
    this.visitTraversedObject(builder, dmrRoot, dmrAddress);
  }

  private visitTraversedObject(builder: CompositeOpBuilder, obj: any,
                               address: string[]) {
    this.addCompositeOperationsToBuilder(builder, address, obj, []);
  }

  private addSocketBindingToEndpoint(socketBindings: ISocketBinding[], endpoints: IEndpoint[]): void {
    for (let endpoint of endpoints) {
      for (let socketBinding of socketBindings) {
        if (endpoint.getSocketBindingName() === socketBinding.name) {
          endpoint.setSocketBinding(socketBinding);
        }
      }
    }
  }

  private getEndpointsRootAddress(profile: string): string[] {
    let endpointPath: string[] = ["subsystem", "datagrid-infinispan-endpoint"];
    return this.launchType.getProfilePath(profile).concat(endpointPath);
  }

  private getEndpointAddress(endpoint: IEndpoint, profile: string): string[] {
    let endpointPath: string[] = ["subsystem", "datagrid-infinispan-endpoint"];
    return this.launchType.getProfilePath(profile).concat(endpointPath).concat(endpoint.getType()).concat(endpoint.getName());
  }


  private addCompositeOperationsToBuilder(builder: CompositeOpBuilder, address: string[], config: any,
                                          excludedAttributes: string[], force: boolean = false): void {
    let createAddOp: boolean = force || config["is-new-node"];
    let remove: boolean = config["is-removed"];
    if (createAddOp) {
      let request: IDmrRequest = this.createAddOperation(address, config, excludedAttributes);
      if (Object.keys(request).length > 2 || config["required-node"]) {
        // request.length > 2 means that the operation has the address and operation type, so add to builder
        // Or if 'required-node' is present, then we know that this node must be created, even if empty.
        // This is required for when child nodes may also have been defined without the parent.
        builder.add(this.createAddOperation(address, config, excludedAttributes));
      }
    } else if (remove) {
      builder.add(this.createRemoveOperation(address));
    } else {
      this.createWriteAttributeOperations(builder, address, config, excludedAttributes);
      this.composeWriteObjectOperations(builder, address, config);
    }
  }

  private createAddOperation(address: string[], config: any, excludedAttributes: string[]): IDmrRequest {
    let allowedObjects: string[] = ["indexing-properties", "string-keyed-table", "binary-keyed-table"];
    let op: IDmrRequest = {
      address: address,
      operation: "add"
    };

    if (isNotNullOrUndefined(config)) {
      // iterate properties of model object and append (key/value) properties to op object
      angular.forEach(config, (value, key) => {
        if (isNullOrUndefined(value)) {
          return;
        }

        if (isObject(value)) {
          // Only process allowed objects, these should be objects which are dmr attributes not children
          if (allowedObjects.indexOf(key) > -1) {
            op[key] = value;
          }
          return;
        }

        if (isJsonString(value)) { // handle JSON described objects
          value = this.parseJson(value, key);
        }
        op[key] = value;
      });
    }
    // Remove excluded attributes
    angular.forEach(excludedAttributes, attribute => delete op[attribute]);
    return op;
  }

  private createRemoveOperation(address: string[]): IDmrRequest {
    return <IDmrRequest> {
      address: address,
      operation: "remove"
    };
  }

  private createWriteAttributeOperations(builder: CompositeOpBuilder, address: string[], config: any,
                                         excludedAttributes: string[]): void {
    if (isNotNullOrUndefined(config)) {
      angular.forEach(config, (value, key) => {
        let excluded: boolean = excludedAttributes.some(attribute => key === attribute) || isNullOrUndefined(value) || isObject(value);
        if (!excluded) {
          if (isJsonString(value)) {
            value = this.parseJson(value, key);
          }
          builder.add(createWriteAttrReq(address, key, value));
        }
      });
    }
  }

  private composeWriteObjectOperations(builder: CompositeOpBuilder, address: string[], config: any): void {
    if (isNotNullOrUndefined(config)) {
      let includedAttributes: string[] = ["indexing-properties", "string-keyed-table", "binary-keyed-table"];
      angular.forEach(config, (value, key) => {
        let included: boolean = includedAttributes.some(attribute => key === attribute);
        if (included && isObject(value)) {
          builder.add(createWriteAttrReq(address, key, value));
        }
      });
    }
  }

  private parseJson(value: string, key: string): string {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.log("Invalid JSON value " + value + " for field " + key);
    }
  }
}

module.service("endpointService", EndpointService);
