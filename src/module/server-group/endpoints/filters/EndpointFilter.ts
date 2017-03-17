import {IEndpoint} from "../../../../services/endpoint/IEndpoint";
import {isNotNullOrUndefined} from "../../../../common/utils/Utils";

export function endpointFilter(): Function {
  return (endpoints: IEndpoint[], query: string) => {
    let validQuery: boolean = !(query === undefined || query === null) && query.length > 0;
    if (validQuery) {
      let ret: IEndpoint [] = endpoints.filter(endpoint => {
        return isNotNullOrUndefined(endpoint.name) && endpoint.name.indexOf(query) > -1 ||
          isNotNullOrUndefined(endpoint["socket-binding"]) && endpoint["socket-binding"].name.indexOf(query) > -1;
      });
      return ret;
    } else {
      return endpoints;
    }
  };
}
