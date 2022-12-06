import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import Reactotron from 'reactotron-react-native';
import { Alert } from "react-native"
import { CONFIG } from "@utils/config"
import reactotron from "reactotron-react-native";

/**
 * Manages all requests to the API.
 */

export class Api {
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
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        "Accept": "application/json",
        // "Authorization": this.config.token,
        "Content-Type": "application/json",
      },
    });
  }

  async forgotUser(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/auth/forgot-password`, param)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async loginUser(data): Promise<Types.GetDefaultResult> {
    // make the api call
    this.apisauce.setHeader('Accept', 'application/json');
    this.apisauce.setHeader('Content-Type', 'application/json');
    const response: ApiResponse<any> = await this.apisauce.post(`/auth/login`, data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.error) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && !response.data.error){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", user: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async logoutUser(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/auth/logout`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getUser(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/client/`+param.id+`?fields=id,name,email,image,modules`, {
      user_id: param.id
    })

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async editUser(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'multipart/form-data');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/auth/updateProfile`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getProfileUser(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'multipart/form-data');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/auth/getProfile`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async registerUser(data): Promise<Types.GetDefaultResult> {
    // make the api call
    // console.log(data);

    this.apisauce.setHeader('Accept', 'multipart/form-data');
    this.apisauce.setHeader('Content-Type', 'multipart/form-data');

    // let formData = new FormData();

    const response: ApiResponse<any> = await this.apisauce.post(`/user/register`, data)
    // console.log(response);

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", user: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async editPassword(data): Promise<Types.GetDefaultResult> {
    // make the api call
    // console.log(data);
    // Reactotron.log('editPassword api.ts 1')
    // Reactotron.log(data)
    
    if(data.token){
      this.apisauce.setHeader('Authorization', "Bearer "+data.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    // let formData = new FormData();
    // Reactotron.log('editPassword api.ts')
    // Reactotron.log(data)
    const response: ApiResponse<any> = await this.apisauce.post(`/auth/updateProfile`, data)
    // console.log(response);

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", user: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  
  // API Company
  async getCurrentCompany(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/company`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API General
  async getServerTime(): Promise<Types.GetDefaultResult> {
    
    this.apisauce.setHeader('Accept', 'application/json');
    this.apisauce.setHeader('Content-Type', 'application/json');

    const response: ApiResponse<any> = await this.apisauce.post(`/attendance/getServerTime`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API Departments
  async getDepartments(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/department/list`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getDepartmentMembers(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/department/getMember`, param)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API Projects
  async getProjects(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    var filters = '&filters=';
    var existing_filter = [];
    // Reactotron.log('fn getTasks')
    if(param.category_id || param.search){
      // Reactotron.log('fn getTasks masuk filter')
      if(param.category_id){
        existing_filter.push('category_id eq "'+param.category_id+'"');
      }
    }

    if(param.search){
      // Reactotron.log('fn getTasks masuk filter param search')
      // Reactotron.log(param.search)
      existing_filter.push('project_name lk "%'+param.search+'%"');
    }

    // Reactotron.log("api param ===================");
    // Reactotron.log(param);

    if(param.team_id && param.wilayah_id && param.subcompany_id){
      existing_filter.push('team_id eq '+param.team_id);
      existing_filter.push('wilayah_id eq '+param.wilayah_id);
      existing_filter.push('subcompany_id eq '+param.subcompany_id);
    }

    existing_filter.map((item, i) => {
      filters += item;

      if(i != existing_filter.length-1){
        filters += " and ";
      }
    });

    const response: ApiResponse<any> = await this.apisauce.get(`/project?limit=999&&`+param.sortby+filters)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getDetailProject(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/project/`+param.id+`/?fields=id,project_name,project_summary,notes,start_date,deadline,status,project_admin,projectAdminData,category,client{id,name},created_at,projectActivity{*}`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async deleteProject(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.delete(`/project/`+param.id)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getProjectCategories(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/project-category/?limit=999`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async addCategory(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/project-category`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async addProject(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/project`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async editProject(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.put(`/project/`+param.data.id, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API Assignee
  async getAssignee(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/getAssignee`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API Tasks
  async getTasksList(param): Promise<Types.GetDefaultResult> {
    // Filter tasks by project_id, board_column_id, due_date
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post('/task/getListTugas', param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getTasks(param): Promise<Types.GetDefaultResult> {
    // Filter tasks by project_id, board_column_id, due_date
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    var filters = '';
    var existing_filter = [];
    // Reactotron.log('fn getTasks')
    if(param.project_id || param.board_column_id || param.due_date || param.assignee_user_id || param.start_date || param.end_date){
      filters = "&filters=";
      // Reactotron.log('fn getTasks masuk filter')
      if(param.project_id){
        existing_filter.push('project_id eq "'+param.project_id+'"');
      }
      if(param.board_column_id){
        existing_filter.push('board_column_id eq "'+param.board_column_id+'"');
      }
      if(param.due_date){
        existing_filter.push('due_date eq "'+param.due_date+'"');
      }
      if(param.assignee_user_id){
        existing_filter.push('assignee_user_id eq "'+param.assignee_user_id+'"');
      }
      if(param.start_date && param.start_date != ""){
        existing_filter.push('start_date ge "'+param.start_date+'"');
      }
      if(param.end_date && param.end_date != ""){
        existing_filter.push('start_date le "'+param.end_date+'"');
      }
    }
    if(param.search){
      // Reactotron.log('fn getTasks masuk filter param search')
      // Reactotron.log(param.search)
      existing_filter.push('heading lk "%'+param.search+'%"');
    }

    existing_filter.map((item, i) => {
      filters += item;

      if(i != existing_filter.length-1){
        filters += " and ";
      }
    });

    // Reactotron.log('abcd 2')
    // Reactotron.log('/task?fields=id,heading,description,start_date,due_date,status,is_requires_gps,is_requires_camera,created_at,updated_at,total_working_time,interval_report,users{*},taskboardColumns{*},project{*}&&order=due_date asc&order=id desc'+filters)
    const response: ApiResponse<any> = await this.apisauce.get('/task?fields=id,heading,description,start_date,due_date,board_column_id,users{id,name},project{*},category{id,category_name},priority,status,is_private,create_by{id,name},history{id,user_id,details,board_column_id},files{id,filename},interval_report,is_requires_gps,is_requires_camera,total_working_time,taskboardColumns{*}&&order=due_date asc&order=id desc'+filters)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async startTask(param): Promise<Types.GetDefaultResult> {
    // Filter tasks by project_id, board_column_id, due_date
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/task/startTask`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async stopTask(param): Promise<Types.GetDefaultResult> {
    // Filter tasks by project_id, board_column_id, due_date
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/task/stopTask`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async deleteTask(param): Promise<Types.GetDefaultResult> {
    // Filter tasks by project_id, board_column_id, due_date
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/task/deleteTask`, param)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  /*
  async updateStatusTask(param): Promise<Types.GetDefaultResult> {
    // Filter tasks by project_id, board_column_id, due_date
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.put(`/task/`+param.id+`?board_column_id=`+param.board_column_id)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  */

  async getDetailTask(param): Promise<Types.GetDefaultResult> {
    // Filter tasks by project_id, board_column_id, due_date
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/task/`+param.id+`?fields=id,heading,description,start_date,due_date,board_column_id,taskboardColumns{*},users{id,name},project{id,project_name},category{id,category_name},priority,status,is_private,is_requires_gps,is_requires_camera,recurring_task_id,dependent_task_id,interval_report,time_log_active,create_by{id,name},files{id,hashname,filename,file_url},history{id,user_id,details,board_column_id,activity_log,date_time},timelog,atasan_1,cc_user_id,cc_user,created_at,assignee_user,assignee_user_id`)
    // const response: ApiResponse<any> = await this.apisauce.post(`/task/getDetail`, {id: param.id})

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async createTask(param): Promise<Types.GetDefaultResult> {
    // Filter tasks by project_id, board_column_id, due_date
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/task/storeTask`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async updateTask(param): Promise<Types.GetDefaultResult> {
    // Filter tasks by project_id, board_column_id, due_date
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/task/editTask`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API Status / Taskboard
  async getStatus(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/taskboard-columns?order=priority asc`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API Otorisasi
  async editNotifSettings(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/employee/editNotificationSetting`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API Notification DB
  async getNotificationsDB(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/auth/getNotification`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async readNotificationsDB(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/auth/setNotificationAsRead`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async checkUnreadNotifDB(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/auth/getStatusReadNotif`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API Notice
  async getNotice(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/notice/getList?fields=id,heading,description,to,created_at,files,linkFile,updated_at&&order=created_at desc`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async createNotices(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'multipart/form-data');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/store-notice`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      if(response.data.error){
        return { kind: "error", data: response.data.error }
      }
      else{
        const resultData: Types.AppDefault = response.data;

        return { kind: "ok", data: resultData }
      }

    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getTeams(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/getTeams`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getSubCompanyList(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/sub-company/list`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getDetailNotice(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/notice/`+param.id+`/?fields=id,heading,description,to,created_by,created_by_user,sub_company_id,for_sub_company,team_id,for_department&&order=created_at desc&&limit=100`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getUnreadNotice(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/auth/getUnreadNotifications`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getCustomNotif(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/auth/getCustomNotifications`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async readNotifications(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/auth/readNotifications`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API Attendance
  async storeAttendance(param): Promise<Types.GetDefaultResult> {
    // depriciated
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/employee/storeAttendance`, param)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getAttendances(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/attendance?filters=user_id eq `+param.user_id+`&&order=created_at desc`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API Attendance Settings
  async getAttendanceSettings(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/attendance_settings`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API Tickets
  async ticketReply(param): Promise<Types.GetDefaultResult> {
    // Filter tasks by project_id, board_column_id, due_date
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/ticket/postTicketReply`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getTickets(param): Promise<Types.GetDefaultResult> {
    // Filter logs by status
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    var filters = '';
    var existing_filter = [];

    if(param.status || param.subject){
      filters = "&filters=";

      if(param.status){
        existing_filter.push('status eq "'+param.status+'"');
      }
      if(param.subject){
        existing_filter.push('status lk "%'+param.status+'%"');
      }
    }

    existing_filter.map((item, i) => {
      filters += item;

      if(i != existing_filter.length-1){
        filters += " and ";
      }
    });

    const response: ApiResponse<any> = await this.apisauce.get(`ticket?fields=user_id,type_id,subject,description,status,created_at,priority,requester{*},reply{*,files},reply:user{*}`+filters)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getDetailTicket(param): Promise<Types.GetDefaultResult> {
    // Filter logs by status
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`ticket/`+param.id+`?fields=user_id,type_id,subject,description,status,created_at,priority,requester{*},reply{*,files},reply:user{*}`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getTicketType(param): Promise<Types.GetDefaultResult> {
    // Filter logs by status
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`ticket/getTicketType`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getTicketDivisions(param): Promise<Types.GetDefaultResult> {
    // Filter logs by status
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`ticket/getTicketAgent`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async editTicket(param): Promise<Types.GetDefaultResult> {
    // Filter logs by status
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.put(`ticket/`+param.id, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async createTicket(param): Promise<Types.GetDefaultResult> {
    // Filter logs by status
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`ticket`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async deleteTicket(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.delete(`/ticket/`+param.id)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  // API Timelog
  async getLogsList(param): Promise<Types.GetDefaultResult> {
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`time-log/list`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getLogs(param): Promise<Types.GetDefaultResult> {
    // Filter logs by status
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    var filters = '';
    var existing_filter = [];

    if(param.status || param.user_id){
      filters = "&filters=";

      if(param.status){
        existing_filter.push('status eq "'+param.status+'"');
      }

      if(param.user_id){
        existing_filter.push('user_id eq "'+param.user_id+'"');
      }
    }

    existing_filter.map((item, i) => {
      filters += item;

      if(i != existing_filter.length-1){
        filters += " and ";
      }
    });

    const response: ApiResponse<any> = await this.apisauce.get(`timelog/?fields=id,task{*},project{*},user{*},start_time,end_time,image,memo,total_hours,total_minutes,status,checker_user_id,checker,latitude,longitude&order=created_at desc`+filters)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getDetailLog(param): Promise<Types.GetDefaultResult> {
    // Filter tasks by project_id, board_column_id, due_date
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/timelog/`+param.id+`?fields=id,task{*},project{*},user{*},start_time,end_time,image,image_full_path,memo,total_hours,total_minutes,status,checker_user_id,checker,latitude,longitude,reason,image_full_path,files{id,hashname,filename,file_url},list_comments`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async postTerimaTask(param): Promise<Types.GetDefaultResult> {
    // Filter tasks by project_id, board_column_id, due_date
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    var reason = "";
    if(param.reason){
      reason = "&reason="+param.reason;
    }

    const response: ApiResponse<any> = await this.apisauce.put(`/timelog/`+param.task_id+`?status=`+param.status+`&checker_user_id=`+param.checker_user_id+reason)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  /*
  async postLog(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      // this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      // this.apisauce.setHeader('Accept', 'multipart/form-data');
      // this.apisauce.setHeader('Content-Type', 'multipart/form-data; boundary=---------------------------974767299852498929531610575');

      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'multipart/form-data');

      // this.apisauce.setHeader('Accept', 'application/json');
      // this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post('/timelog', param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  */

  // API Static
  async getAbout(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/general/get-about`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getPrivacy(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/general/get-privacy-policy`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getToc(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/general/get-term-condition`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getSettings(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/general/get-setting`)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getAbsenceHistory(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/attendance/getHistoryAttendance`, param)
    Reactotron.log('param')
    Reactotron.log(param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getEmployeePermission(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/auth/getEmployeePermission`)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getCheckMyLeave(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/leave/check-my-leave`, param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getMyLeave(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/leave/employee`, param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async checkAttendance(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/attendance/checkAttendance`,param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getOffice(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/attendance/getOffice`,param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async storeAttendanceUsed(param, data): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/attendance/storeAttendance`,data)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response;
      }

      const resultData: Types.AppDefault = response;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getLeaveList(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    var filters = '';
    var existing_filter = [];

    user_id_all =''
    // user_id eq "'+param.tujuan_pengajuan+'"
    Reactotron.log('param.tujuan_pengajuan.map')
    Reactotron.log(param.tujuan_pengajuan)
    if(param.tujuan_pengajuan.length == 1){
      param.tujuan_pengajuan.map((item,i)=>{
        user_id_all += 'user_id eq '+item
      })
    }else{
      param.tujuan_pengajuan.map((item,i)=>{
        user_id_all += 'user_id eq '+item
        if(i != param.tujuan_pengajuan.length-1){
          user_id_all += ' or '
        }
      })
    }
    
    filters = "";
    existing_filter = '?filters=leave_date ge "'+param.start_date+'" and (leave_date le "'+param.end_date+'" and (leave_type_id eq "'+param.tipe_pengajuan+'" and ('+user_id_all+')))';
    filters = existing_filter;

    // Reactotron.log('filters')
    // Reactotron.log(filters)
    const response: ApiResponse<any> = await this.apisauce.get("/leave"+filters)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getLeaveListNew(param): Promise<Types.GetDefaultResult> {
    // make the api call

    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }
    // Reactotron.log('param newLoadList c2')
    // Reactotron.log(param)

    const response: ApiResponse<any> = await this.apisauce.post(`/leave/getList`,param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // Reactotron.log('param newLoadList d1')
    // Reactotron.log(param)
    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getLeaveDetail(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/leave/getDetail`,param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getLeaveStatus(param): Promise<Types.GetDefaultResult> {
    // make the api call
    
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/leave/activity`,param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getLeaveType(param): Promise<Types.GetDefaultResult> {
    // make the api call
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.get(`/leave-type`,param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getLeaveOnlyType(param): Promise<Types.GetDefaultResult> {
    // make the api call
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/tipe-cuti/list`,param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async leaveStore(param, data): Promise<Types.GetDefaultResult> {
    // make the api call
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/leave/storeLeave`,data)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async approveLeave(param): Promise<Types.GetDefaultResult> {
    // make the api call
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/leave/approveLeave`,param)
    // console.log(response);

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async rejectLeave(param): Promise<Types.GetDefaultResult> {
    // make the api call
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/leave/rejectLeave`,param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async checkPosition(param): Promise<Types.GetDefaultResult> {
    // make the api call
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/attendance/check-position`,param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  
  async akomodasi(param): Promise<Types.GetDefaultResult> {
    // make the api call
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/leave/butuh-akomodasi`,param)
    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async createPengeluaran(param, data): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }
    const response: ApiResponse<any> = await this.apisauce.post(`/leave/create-pengeluaran`,data)
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }
      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async markDone(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }
    const response: ApiResponse<any> = await this.apisauce.post(`/leave/dinas-to-done`,param)
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }
      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async sekretarisAddAccomodation(param,data): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }
    const response: ApiResponse<any> = await this.apisauce.post(`/leave/sekretaris-add-accomodation`,data)
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }
      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getQuestion(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }
    const response: ApiResponse<any> = await this.apisauce.post(`/pertanyaan/list`,param)
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }
      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async storeGPS(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/employee/storeGps`,param)
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async notifyAtasanKeluarRadius(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }
    const response: ApiResponse<any> = await this.apisauce.post(`/employee/notifyAtasanKeluarRadius`,param)
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }
      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async cekWifi(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }
    const response: ApiResponse<any> = await this.apisauce.post(`/auth/checkWifiExist`,param)
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }
      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

 async getListSPK(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }
    const response: ApiResponse<any> = await this.apisauce.post(`/spk/getList`,param)
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }
      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getHistorySPK(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }
    const response: ApiResponse<any> = await this.apisauce.post(`/spk/getHistorySPK`,param)
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }
      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  
  async getListDepartment(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }
    const response: ApiResponse<any> = await this.apisauce.post(`/department/list`,param)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      if(response.data){
        const result = response.data;
      }
      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
  async getListMember(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    param.module = "meeting"

    const response: ApiResponse<any> = await this.apisauce.post(`/department/getMember`,param)
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }
      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async sendNotification(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }
    const response: ApiResponse<any> = await this.apisauce.post(`/send/one-signal`,param)
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }
      const resultData: Types.AppDefault = response.data.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getComments(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/comment-tugas/list-data`, param)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async sendComments(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'multipart/form-data');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/comment-tugas/store-data`, param)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async sendNotes(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'multipart/form-data');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/notes/store-data`, param)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async editNotes(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'multipart/form-data');
      this.apisauce.setHeader('Content-Type', 'multipart/form-data');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/notes/`+param.id+`/update-data`, param.data)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async getNotes(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/notes/list-data`, param)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }

  async deleteNotes(param): Promise<Types.GetDefaultResult> {
    if(param.token){
      this.apisauce.setHeader('Authorization', "Bearer "+param.token);
      this.apisauce.setHeader('Accept', 'application/json');
      this.apisauce.setHeader('Content-Type', 'application/json');
    }

    const response: ApiResponse<any> = await this.apisauce.post(`/notes/delete-data`, param)

    // the typical ways to die when calling an api
    if (!response.ok || response.data.status == "error") {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if(response.data && response.data.status != "error"){
        const result = response.data;
      }

      const resultData: Types.AppDefault = response.data;
      return { kind: "ok", data: resultData }
    } catch {
      return { kind: "bad-data", msg: response.data.message }
    }
  }
}
