import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import Reactotron from 'reactotron-react-native';
import { Alert } from "react-native"
import { CONFIG } from "@utils/config"

/**
 * Manages all requests to the API.
 */

export class ApiRajaongkir {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    // var current_user = (rootStore.getCurrentUser().access_token) ? rootStore.getCurrentUser().access_token : "";

    // console.log(this.config);

    this.apisauce = create({
      baseURL: CONFIG.RAJAONGKIR_URL,
      timeout: this.config.timeout,
      headers: {
        "key": CONFIG.RAJAONGKIR_KEY
      },
    });
  }

  // API RAJAONGKIR
  async getRajaongkirProvince(): Promise<Types.GetDefaultResult> {
    
    // make the api call
    this.apisauce.setHeader('Accept', 'application/json');
    this.apisauce.setHeader('Content-Type', 'application/json');
    const response: ApiResponse<any> = await this.apisauce.get(`/province`);

    // the typical ways to die when calling an api
    if (!response.ok || response.data.rajaongkir.status.code == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.rajaongkir.status.code == "error"){
        const result = response.data.rajaongkir;
      }

      const resultData: Types.AppDefault = response.data.rajaongkir.results;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getRajaongkirCity(param): Promise<Types.GetDefaultResult> {
    // make the api call
    this.apisauce.setHeader('Accept', 'application/json');
    this.apisauce.setHeader('Content-Type', 'application/json');
    const response: ApiResponse<any> = await this.apisauce.get(`/city?province=`+param.province_id);

    // the typical ways to die when calling an api
    if (!response.ok || response.data.rajaongkir.status.code == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.rajaongkir.status.code == "error"){
        const result = response.data.rajaongkir;
      }

      const resultData: Types.AppDefault = response.data.rajaongkir.results;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getRajaongkirFees(param): Promise<Types.GetDefaultResult> {
    // make the api call
    this.apisauce.setHeader('Accept', 'application/json');
    this.apisauce.setHeader('Content-Type', 'application/json');
    const response: ApiResponse<any> = await this.apisauce.post(`/cost`, param);
    Reactotron.log(response);

    // the typical ways to die when calling an api
    if (!response.ok || response.data.rajaongkir.status.code == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.rajaongkir.status.code == "error"){
        const result = response.data.rajaongkir;
      }

      const resultData: Types.AppDefault = response.data.rajaongkir.results;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
}
