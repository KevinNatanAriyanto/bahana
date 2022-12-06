import { Instance, SnapshotOut, types, castToSnapshot, getSnapshot, destroy, unprotect, applySnapshot } from "mobx-state-tree"
// import { onSnapshot, onAction, onPatch, applySnapshot, applyAction, applyPatch, getSnapshot } from "mobx-state-tree"
import { NavigationStoreModel } from "../../navigation/navigation-store"
import { UserModel } from "@models/user"
import { SettingsModel } from "@models/settings"
import { TaskModel } from "@models/task"
import { ProjectModel } from "@models/project"
import { GpsModel } from "@models/gps"
import { EmployeeModel } from "@models/employee"
import { ClusterModel } from "@models/cluster"
import { OfficeModel } from "@models/office"
import { LeaveModel } from "@models/leave"
import { TaskReminderModel } from "@models/task-reminder"
import { PermissionModel } from "@models/permission"
import { DesignationModel } from "@models/designation"
import { TimelogModel } from "@models/timelog"
import { QueueModel } from "@models/queue"
import { ShipModel } from "@models/ship"
import { ShipScheduleModel } from "@models/ship-schedule"
import { QuestionModel } from "@models/question"
// import { CartItemModel } from "../cart-item"
import { NotificationModel } from "@models/notification"
import { AttendanceModel } from "@models/attendance"
import { omit } from "ramda"
import * as storage from "../../utils/storage"
import Reactotron from 'reactotron-react-native';
import { Api, ApiRajaongkir } from "@services/api"
import { Helper } from "@utils/helper"
import { Alert } from "react-native"
import Toast from 'react-native-root-toast';
import { NavigationScreenProps, NavigationActions, StackActions } from "react-navigation"
import update from 'immutability-helper';
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
// import { useStores } from "@models/root-store";

// const ROOT_STATE_STORAGE_KEY = "root"
const ApiInstance = new Api();
ApiInstance.setup();

// const ApiRajaongkirInstance = new ApiRajaongkir();
// ApiRajaongkirInstance.setup();

const user_allow_fields = [
	"id",
    "company_id",
    "name",
    "email",
    "image",
    "mobile",
    "gender",
    "locale",
    "status",
    "login",
    "super_admin",
    "email_verification_code",
    "unreadNotifications",
    "image_url",
    "modules",
    "roles",
    "role",
    "user_other_role",
    "onesignal_player_id",
    "access_token",
    "expires",
    "expires_in",
    "created_at",
    "updated_at",
    "jabatan"
];

const task_allow_fields = [
    "id",
];

// const rootStore = useStores()

const actionError = async (res, model) => {

    // console.log(res);
    Reactotron.log(res);
	
	// on error JWT
	if(res.msg == "Unable to authenticate with invalid API key and token."){
		model.removeCurrentUser();

		Toast.show("Your session has been expired. Please try to login again.",{
			duration: Toast.durations.LONG
		});

		// const resetAction = StackActions.reset({
		//   key: null,
		//   index: 0,
		//   actions: [NavigationActions.navigate({ 
		//   	routeName: 'landingStack' 
		//   })],
		// });
		// NavigationActions.dispatch(resetAction);

		// var param = {
    		// token: (model.currentUser.access_token) ? model.currentUser.access_token : null,
		// }

    	// var res = await ApiInstance.logoutUser(param);

    	// if(res.kind == "ok"){
    	// 	model.removeCurrentUser();
    	// }
	}else{
        var netinfo = await NetInfo.fetch();
        // console.log("internet connected before? "+netinfo.isConnected);

        // if(res.kind != "cannot-connect"){
        if(netinfo.isConnected){

    		var msg = "";
    		if(Array.isArray(res.msg) && res.msg.length > 0){
    			res.msg.map((item,i) => {
    				msg += item+"\n";
    			});
    		}else{
    			msg = res.msg;
    		}

            if(res.data && res.data.error){
                msg = res.data.error.message
            }

    		Toast.show((msg) ? msg : "Connection to server failed. Try again later.",{
    			duration: Toast.durations.LONG
    		});
        }
	}
}

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  navigationStore: types.optional(NavigationStoreModel, {}),
  // loading: types.boolean,
  notifications: types.array(NotificationModel, []),
  attendances: types.array(AttendanceModel, []),
  currentUser: types.optional(UserModel, {}),
  settings: types.optional(SettingsModel, {}),
  gps: types.optional(GpsModel, {}),
  employee: types.optional(EmployeeModel, {}),
  ship: types.optional(ShipModel, {}),
  ship_schedules: types.array(ShipScheduleModel, []),
  cluster: types.optional(ClusterModel, {}),
  office: types.optional(OfficeModel, {}),
  timelogs: types.array(TimelogModel, []),
  task_reminders: types.optional(TaskReminderModel, {}),
  tasks: types.array(TaskModel, []),
  projects: types.array(ProjectModel, []),
  assignees: types.array(UserModel, []),
  questions: types.array(QuestionModel, []),

  my_queues: types.array(QueueModel, []),
  my_attendance: types.optional(AttendanceModel, {}),
  my_permission: types.optional(PermissionModel, {}),
  my_designation: types.optional(DesignationModel, {}),
  my_leaves: types.array(LeaveModel, []),
  // notifications: types.optional(NotificationModel, {}),
})
.views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
.actions(self=> ({

    // storage queue
    async getAllQuestions(){
        var result = await self.getQuestion();
        if(result.kind == "ok" && result.data){
            self.removeData("questions");
            self.pushData("questions", result.data.pertanyaan);
        }
    },
    async getAllAssignees(){
        var result = await self.getAssignee();
        if(result.kind == "ok" && result.data){
            self.removeData("assignees");
            self.pushData("assignees", result.data.assignee);
        }
    },
    async getAllProjects(){
        var result = await self.getProjects();
        if(result.kind == "ok" && result.data){
            self.removeData("projects");
            self.pushData("projects", result.data);
        }
    },
    async getAllUserInfo(){
        var result = await self.getProfileUser();
        if(result.kind == "ok" && result.data){
            // rootStore.assignData("currentUser", result.data.employee)

            var res = self.convertValueIntoReadable(result.data.employee);
            var user = { ...self.currentUser };
            user.employee = res;

            self.removeData("currentUser");
            self.assignData("currentUser", user)
        }
    },

    saveAttendanceFormat(datas){
        var arr = [];
        datas.map((item,i) => {
            var tmp = { ...item };

            if(item.clock_in_image == ""){
                tmp.clock_in_image = null
            }else if(item.clock_in_image){
                tmp.clock_in_image = {
                    name: item.clock_in_image
                }
            }

            if(item.clock_out_image == ""){
                tmp.clock_out_image = null
            }else if(item.clock_out_image){
                tmp.clock_out_image = {
                    name: item.clock_out_image
                }
            }

            arr.push(tmp)
        })

        return arr
    },
    async getAllAttendances(){
        var result = await self.getAbsenceHistory();
        if(result.kind == "ok" && result.data){

            var arr = self.saveAttendanceFormat(result.data.attendance)

            self.removeData("attendances");
            self.pushData("attendances", arr);
        }
    },
    async getAllTimelogs(limit = null){
        var param = {
          assignee_user_id: self.getCurrentUser().id,
          offset: 0,
          limit: (!!limit) ? limit : 999
        }
        var result = await self.getLogsList(param);
        if(result.kind == "ok" && result.data.data.project_time_log){
            self.removeData("timelogs");
            self.pushData("timelogs", result.data.data.project_time_log);
        }
    },
    async getAllTasks(){
        var param = {
            assignee_user_id: self.getCurrentUser().id,
            offset: 0,
            limit: 999
        }
        var result = await self.getTasks(param);

        if(result.kind == "ok" && result.data){
            self.removeData("tasks");
            
            var tasks = result.data.task;
            Promise.all(tasks.map( async (item,i) => {

                param = {
                    id: item.id
                }

                var detail = await self.getDetailTask(param);
                if(detail.kind == "ok" && detail.data){
                    tasks[i] = detail.data
                    return Promise.resolve('ok')
                }
            })).then(data => {
                self.pushData("tasks", tasks);
            });
        }
    },

    async startQueue(){
        if(self.my_queues.length > 0){

            // select first queue
            var index = 0;
            var selected_queue = self.my_queues[index];

            // try running
            if(!selected_queue.status){
                var res = await selected_queue.sync(self);

                if(res){
                    
                    // callback after running queues
                    if(selected_queue.will_update == "tasks"){
                        self.getAllTasks()
                    }else if(selected_queue.will_update == "attendances"){
                        self.getAllAttendances()
                    }else if(selected_queue.will_update == "timelogs"){
                        self.getAllTimelogs()
                    }

                    // remove processed queue
                    var filteredItems = self.my_queues.slice(0, index).concat(self.my_queues.slice(index + 1, self.my_queues.length))
                    self.update("my_queues", filteredItems);

                    Toast.show('Sinkronisasi data berhasil')
                }else{
                    Toast.show('Sikronisasi data gagal, silahkan coba beberapa saat lagi')
                }
            }else{
                Toast.show("Proses masih berjalan, silahkan tunggu beberapa saat")
            }
        }else{
            // Toast.show("Tidak ada proses yang perlu di sinkronisasi")
        }
    },

    // storage attendances
    findLatestCheckin(){
        var result = null;

        if(self.attendances.length > 0){
            var attendances = self.attendances.map(d => moment(d.clock_in_date));
            var maxDate = moment.max(attendances);

            result = self.attendances.filter(function(item){
                if(moment(item.clock_in_date).isSame(maxDate)){
                    return item
                }
            });

            console.log(result)
        }

        return result;
    },

    // storage tasks
    findTaskById(id){
        var result = self.tasks.filter(function(item){
            if(item.id == id){
                return item
            }
        });

        return result;
    },
    updateTaskById(id, param){
        var task = self.findTaskById(id);

        if(task.length > 0){
            task = task[0];

            Object.keys(param).map((key,i) => {
                task.update(key, param[key])
            });
        }
    },

    // storage timelogs
    findTimelogByMoreThan(days, look_status){

        // var days = 2;
        // var look_status = 'in_review'

        var was = moment().subtract(days,'days').format();
        var before = moment().subtract(5,'years').format();
        
        var result = self.timelogs.filter(function(item){
            var now = moment(item.created_at).format();

            if(moment(now).isBetween(before,was) && item.status == look_status){
                return item;
            }
        });

        return result;
    },
    findTimelogById(id){
        var result = self.timelogs.filter(function(item){
            if(item.id == id){
                return item
            }
        });

        return result;
    },
    findTimelogByTaskId(task_id){
        var result = self.timelogs.filter(function(item){
            if(item.task_id == task_id){
                return item
            }
        });

        return result;
    },
    findLogAfterCheckIn(clockin_time){
        var result = self.timelogs.filter(function(item){
            if(moment(item.end_time).isSameOrAfter(clockin_time)){
                return item
            }
        });

        return result;
    },
    updateTimelogById(id, param){
        var timelog = self.findTimelogById(id);

        if(timelog.length > 0){
            timelog = timelog[0];

            Object.keys(param).map((key,i) => {
                timelog.update(key, param[key])
            });
        }
    },
	
    // General
    async getServerTime(){

        // var param = {
        //     token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
        // }

        var res = await ApiInstance.getServerTime();

        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },

    update(key, value){
        self[key] = value;
    },

    convertValueIntoReadable(data){
        var res = data;

        if(typeof data === "object"){
            res = {};
            Object.keys(data).map((key,i) => {
                if(data[key] && typeof data[key] === "object" || typeof data[key] === "array"){
                    // res[key] = JSON.stringify(data[key])
                    res[key] = data[key]
                }else if(data[key] && typeof data[key] !== "object" && typeof data[key] !== "array"){
                    res[key] = data[key]
                }else{
                    res[key] = null
                }
            });
        }

        return res;
    },
    pushData(param, data, sync_status = true, index = -1){

        if(Array.isArray(data)){
            data.map((item,i) => {
                // item.data = item;
                // var tmp = self.convertValueIntoReadable(item);
                // self[param].push(tmp);
                item.is_sync = sync_status;
                // item.created_at = moment().format()
                // item.updated_at = moment().format()

                self[param].push(item);
            })
        }else{
            data.is_sync = sync_status;
            // data.created_at = moment().format()
            // data.updated_at = moment().format()

            if(index == -1){
                self[param].push(data);
            }else{
                self[param].splice(index, 0, data);
            }
        }
    },
    assignData(param, data){
        var res = self.convertValueIntoReadable(data);

        applySnapshot(self[param], res);
        
    },
    getData(param){
        return getSnapshot(self[param])
    },
    setData(param, data){
        self[param] = (data) ? data : "";
    },
    removeData(key){
        if(self[key]){
            destroy(self[key]);
        }
    },

    // User
    assignCurrentUser(data){
        Object.keys(data).map((key,i) => {

    		if(user_allow_fields.indexOf(key) != -1){

    			if(typeof data[key] !== "object"){
    				self.setCurrentUser(key, data[key]);
				}else if(typeof data[key] === "object"){
                    self.setCurrentUser(key, JSON.stringify(data[key]));
                }else if(typeof data[key] === "array"){
                    self.setCurrentUser(key, JSON.stringify(data[key]));
                }else{
					self.setCurrentUser(key, "");
				}
    		}
		});
    },
 	setCurrentUser(param, data){
 		if(!data){
 			data = "";
 		}

      	eval("self.currentUser."+param+ "= data");
    },
    showCurrentUser(param){
      self.currentUser = getSnapshot(self.currentUser);
      eval("var val = self.currentUser."+param);
      return val;
    },
    getCurrentUser(){
      return getSnapshot(self.currentUser)
    },
    removeCurrentUser(){
    	destroy(self.currentUser);
    },

    // Notice / notification
    getNotifications(filter){
        var arr = [];
        var res = getSnapshot(self.notifications);

        if(filter && filter.read == "yes"){
            res = res.filter(t => t.read == "yes");
        }

        if(filter && filter.read == "no"){
            res = res.filter(t => (t.read != "yes"));
        }

        return res;
    },

    // Notifications DB
    async getNotificationsDB(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getNotificationsDB(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async readNotificationsDB(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.readNotificationsDB(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async checkUnreadNotifDB(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.checkUnreadNotifDB(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    checkNotice(id){
        return getSnapshot(self.notifications).filter(t => t.id == id)
    },
    addNotice(data){
        var obj = {};
        Object.keys(data).map((key,i) => {
            if(notice_allow_fields.indexOf(key) != -1){

                if(typeof data[key] !== "object"){
                    if(key != 'id'){
                        eval("obj."+key+" = data[key].toString()");
                    }else{
                        eval("obj."+key+" = data[key]");
                    }
                    
                }else if(typeof data[key] === "object"){
                    eval("obj."+key+" = JSON.stringify(data[key])");
                }else{
                    eval("obj."+key+" = ''");
                }
            }
        });

        // Reactotron.log(obj)
        self.notifications.push(NotificationModel.create(obj));
    },
    removeNotification(idx){
        self.notifications.splice(idx,1);
    },
    removeAllNotifications(){
        self.notifications = [];
    },
    setNotification(data){
        Reactotron.log("=======obj" + data)
        self.notifications.push(NotificationModel.create(data));
    },
    openAllNotifications() {
        self.notifications.map((item,i) => {
            item.read = "yes"
        });
    },


    // API
    async doRegister(data){
    	// var data = getSnapshot(self.currentUser);
    	var res = await ApiInstance.registerUser(data);

        if(res.kind == "ok"){
            // self.removeCurrentUser();
            
        }else{
            actionError(res, self);
        }

        return res;
    },
    async doForgot(data){
        var param = {
            ...data
        }

        var res = await ApiInstance.forgotUser(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async doLogin(user){
        var res = await ApiInstance.loginUser(user);
        // Reactotron.log(res)

        if(res.kind == "ok"){
            self.removeCurrentUser();

            res.user.user.company_id = res.user.user.company_id.toString();
            res.user.user.access_token = res.user.token;
            res.user.user.expires = res.user.expires;
            res.user.user.expires_in = res.user.expires_in;
            res.user.user.jabatan = res.user.employee.jabatan;

            Reactotron.log('res.user.user');
            Reactotron.log(res.user.user);

            self.assignCurrentUser(res.user.user);
            
            self.setCurrentUser("data", JSON.stringify(res.user.user));
        }else{
            actionError(res, self);
        }

        return res;
    },
    async doLogout(){

    	var param = {
    		token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
		}

    	var res = await ApiInstance.logoutUser(param);

    	if(res.kind == "ok"){
    		self.removeCurrentUser();
            // self.removeAllRunningTasks();
            // self.removeAllNotifications();
    	}else{
    		actionError(res, self);
    	}

    	return res;
    },
    async editUser(user){
    	var param = {
    		token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
    		data: user
		}

    	var res = await ApiInstance.editUser(param);

    	if(res.kind != "ok"){
    		actionError(res, self);
    	}

    	return res;
    },
    async getCurrentProfile(){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            id: self.currentUser.id
        }

        var res = await ApiInstance.getUser(param);

        if(res.kind != "ok"){
            actionError(res, self);
        }

        return res;
    },
    async getProfileUser(){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            id: self.currentUser.id
        }

        var res = await ApiInstance.getProfileUser(param);

        if(res.kind != "ok"){
            actionError(res, self);
        }

        return res;
    },
    async editPassword(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        Reactotron.log('editPassword rootstore')
        Reactotron.log(param)
        var res = await ApiInstance.editPassword(param);

        if(res.kind != "ok"){
            actionError(res, self);
        }

        return res;
    },
    async getUser(id){
    	var param = {
    		token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
    		id: id
		}

    	var res = await ApiInstance.getUser(param);

    	if(res.kind == "ok"){
    		self.removeCurrentUser();
    	}else{
    		actionError(res, self);
    	}

    	return res;
    },

    // Attendances
    async storeAttendance(data){
        // depriciated
        
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.storeAttendance(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getAttendances(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            user_id: self.currentUser.id,
            ...data
        }

        var res = await ApiInstance.getAttendances(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getAttendanceSettings(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getAttendanceSettings(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },

    // Company
    async getCurrentCompany(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getCurrentCompany(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },

    // Departments
    async getDepartments(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getDepartments(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getDepartmentMembers(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getDepartmentMembers(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },

    // Projects
    async getProjects(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getProjects(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getDetailProject(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getDetailProject(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async deleteProject(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.deleteProject(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getProjectCategories(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getProjectCategories(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async addCategory(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.addCategory(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async addProject(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.addProject(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async editProject(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.editProject(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },

    // Tasks
    async getTasks(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        // var res = await ApiInstance.getTasks(param);
        var res = await ApiInstance.getTasksList(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async createTask(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.createTask(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async updateTask(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.updateTask(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getDetailTask(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getDetailTask(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async startTask(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.startTask(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async stopTask(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.stopTask(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async deleteTask(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.deleteTask(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },

    // Assignee
    async getAssignee(){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null
        }

        var res = await ApiInstance.getAssignee(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    // async updateStatusTask(data){
    //     var param = {
    //         token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
    //         ...data
    //     }

    //     var res = await ApiInstance.updateStatusTask(param);
    //     if(res.kind != "ok"){
    //         actionError(res, self);
    //     }
    //     return res;
    // },

    // Otorisasi
    async editNotifSettings(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.editNotifSettings(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },

    // Notice
    async getNotices(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getNotice(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async createNotices(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.createNotices(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getTeams(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getTeams(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getSubCompanyList(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getSubCompanyList(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getDetailNotice(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getDetailNotice(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getUnreadNotice(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getUnreadNotice(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getCustomNotif(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getCustomNotif(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async markNoticesRead(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.readNotifications(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },

    // Status
    async getStatus(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getStatus(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },

    // Tickets
    async ticketReply(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.ticketReply(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getTickets(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getTickets(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getDetailTicket(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getDetailTicket(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getTicketType(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getTicketType(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getTicketDivisions(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getTicketDivisions(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async editTicket(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            id: data.id,
            data: data
        }

        var res = await ApiInstance.editTicket(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async createTicket(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.createTicket(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async deleteTicket(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.deleteTicket(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },

    // Timelogs
    async getLogsList(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.getLogsList(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getLogs(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getLogs(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getDetailLog(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getDetailLog(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async postTerimaTask(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.postTerimaTask(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async postTolakTask(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.postTolakTask(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },

    /*
    async postLog(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            data: data
        }

        var res = await ApiInstance.postLog(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    */

    // Static
    async getAbout(){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
        }

        var res = await ApiInstance.getAbout(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getPrivacy(){
    	var param = {
    		token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
		}

    	var res = await ApiInstance.getPrivacy(param);
    	if(res.kind != "ok"){
    		actionError(res, self);
    	}
    	return res;
    },
    async getToc(){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
        }

        var res = await ApiInstance.getToc(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getSlideshow(data){
    	var param = {
    		token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
    		...data
		}

    	var res = await ApiInstance.getSlideshow(param);
    	if(res.kind != "ok"){
    		actionError(res, self);
    	}
    	return res;
    },
    async getSettings(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getSettings(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getAbsenceHistory(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.getAbsenceHistory(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getEmployeePermission(){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
        }

        var res = await ApiInstance.getEmployeePermission(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getCheckMyLeave(param){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...param
        }

        var res = await ApiInstance.getCheckMyLeave(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getMyLeave(param){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...param
        }

        var res = await ApiInstance.getMyLeave(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async checkAttendance(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.checkAttendance(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getOffice(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.getOffice(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async storeAttendanceUsed(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            // ...data
        }
        var res = await ApiInstance.storeAttendanceUsed(param, data);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getLeaveList(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.getLeaveList(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getLeaveDetail(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.getLeaveDetail(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getLeaveStatus(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.getLeaveStatus(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getLeaveType(){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
        }
        var res = await ApiInstance.getLeaveType(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getLeaveOnlyType(){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
        }
        var res = await ApiInstance.getLeaveOnlyType(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async leaveStore(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
        }
        var res = await ApiInstance.leaveStore(param,data);
        if(res.kind != "ok" || (res.kind == "ok" && res.data.error)){
            actionError(res, self);
        }
        return res;
    },
    async approveLeave(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.approveLeave(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async rejectLeave(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.rejectLeave(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async checkPosition(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.checkPosition(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getLeaveListNew(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.getLeaveListNew(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async akomodasi(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.akomodasi(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async createPengeluaran(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
        }
        var res = await ApiInstance.createPengeluaran(param, data);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async markDone(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.markDone(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async sekretarisAddAccomodation(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.sekretarisAddAccomodation(param,data);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getQuestion(){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            // ...data
        }
        var res = await ApiInstance.getQuestion(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async storeGPS(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.storeGPS(param);

        // console.log('sending to server', res)

        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async notifyAtasanKeluarRadius(){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            // ...data
        }
        var res = await ApiInstance.notifyAtasanKeluarRadius(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async cekWifi(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.cekWifi(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getListSPK(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.getListSPK(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getHistorySPK(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.getHistorySPK(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },

    async getListDepartment(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.getListDepartment(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getListMember(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.getListMember(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async sendNotification(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }
        var res = await ApiInstance.sendNotification(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getComments(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getComments(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async sendComments(data){
        var param = data;
        param.append("token", (self.currentUser.access_token) ? self.currentUser.access_token : null);

        var res = await ApiInstance.sendComments(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async sendNotes(data){
        var param = data;
        param.append("token", (self.currentUser.access_token) ? self.currentUser.access_token : null);

        var res = await ApiInstance.sendNotes(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async editNotes(data){
        var param = data;
        param.data.append("token", (self.currentUser.access_token) ? self.currentUser.access_token : null);

        var res = await ApiInstance.editNotes(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async getNotes(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.getNotes(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
    async deleteNotes(data){
        var param = {
            token: (self.currentUser.access_token) ? self.currentUser.access_token : null,
            ...data
        }

        var res = await ApiInstance.deleteNotes(param);
        if(res.kind != "ok"){
            actionError(res, self);
        }
        return res;
    },
}))
// .postProcessSnapshot(
// 	omit(["navigationStore"])
// )

// .preProcessSnapshot(omit(["navigationStore", "loading", "runningTasks", "currentUser"]))
.preProcessSnapshot(omit(["navigationStore", "loading"]))

// .preProcessSnapshot(snapshot => ({
//   navigationStore: null,
//   currentUser: null
// }))
// .create({
//     loading: false
// })
// .preProcessSnapshot(omit(["navigationStore", "loading"]))
/**
 * The RootStore instance.
 */
export type RootStore = Instance<typeof RootStoreModel>

/**
 * The data of a RootStore.
 */
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>
