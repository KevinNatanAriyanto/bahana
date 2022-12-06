import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Picker, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, Linking } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomDrawerCustom, SectionedMultiSelect } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
import I18n from "i18n-js";
import { useStores } from "@models/root-store";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-root-toast';
import {useNetInfo} from "@react-native-community/netinfo";
import Modal from 'react-native-modalbox';
import Reactotron from 'reactotron-react-native';
// import BottomDrawer from 'rn-bottom-drawer';
import { Radio } from 'native-base';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import Accordion from 'react-native-collapsible/Accordion';
import DateTimePicker from "react-native-modal-datetime-picker";
import DocumentPicker from 'react-native-document-picker';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
  row: {
    flexDirection: "row"
  },
  icon_add: {
    marginRight: 10, color: "#381D5C"
  }
}


export interface FormTasksScreenProps extends NavigationScreenProps<{}> {
}

export const FormTasksScreen: React.FunctionComponent<FormTasksScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(1);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [departmentMembers, setDepartmentMembers] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [projectTeams, setProjectTeams] = useState([]);
    const [showRelated, setShowRelated] = useState(true);

    const [startDateVisible, setStartDateVisible] = useState(false);
    const [endDateVisible, setEndDateVisible] = useState(false);
    
    // data to pass
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [selectedAssignee, setSelectedAssignee] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedDepartmentMember, setSelectedDepartmentMember] = useState([]);
    const [selectedCCTugas, setSelectedCCTugas] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [selectedRelated, setSelectedRelated] = useState([]);
    const [selectedInterval, setSelectedInterval] = useState(null);
    const [selectedRepeatVal, setSelectedRepeatVal] = useState(null);
    const [selectedRepeatUnit, setSelectedRepeatUnit] = useState(null);
    const [selectedRepeatTimes, setSelectedRepeatTimes] = useState(null);

    const [taskRelated, setTaskRelated] = useState(false);
    const [taskCC, setTaskCC] = useState(false);
    const [taskInterval, setTaskInterval] = useState(false);
    const [taskGPS, setTaskGPS] = useState(false);
    const [taskCamera, setTaskCamera] = useState(false);
    const [taskRepeat, setTaskRepeat] = useState(false);
    const [taskFiles, setTaskFiles] = useState((props.navigation.state.params.task && props.navigation.state.params.task.files) ? props.navigation.state.params.task.files : []);
    const [spesifik, setSpesifik] = useState(false);
    const [spesifikArray, setSpesifikArray] = useState([]);
    const [spesifikArraySemua, setSpesifikArraySemua] = useState(false);
    const [spesifikArrayDiri, setSpesifikArrayDiri] = useState(false);
    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
    const [activeSections, setActiveSections] = React.useState([0]);

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    useEffect( () => {
      loadAll();

    }, []);

    useEffect( () => {
      loadProjects();

    }, [showRelated]);
    useEffect( () => {
      loadDepartments();

    }, [taskCC]);
    useEffect( () => {
      if(selectedDepartment != ""){
        loadDepartmentMembers();
      }

    }, [selectedDepartment]);

    const loadAll = async () => {
      // await loadProjects()
      await rootStore.getAllProjects();

      await loadAssignee()
      await loadTasks()

      if(props.navigation.state.params.task){
        await loadExistingData()
      }
    }

    const loadExistingData = () => {
      // on edit
      // Reactotron.log(props.navigation.state.params.task);
      if(props.navigation.state.params.task){

        var tt = props.navigation.state.params.task;

        setTaskTitle(tt.heading);
        setTaskDescription(tt.description);

        if(tt.users.length > 0){
          setSelectedAssignee([tt.users[0].id]);
        }

        setSelectedProject(tt.project.id)
        setSelectedStartDate(moment(tt.start_date).format("DD-MM-YYYY"))
        setSelectedEndDate(moment(tt.due_date).format("DD-MM-YYYY"))
        
        var is_requires_gps = (tt.is_requires_gps) ? true : false;
        setTaskGPS(is_requires_gps);

        var is_requires_camera = (tt.is_requires_camera) ? true : false;
        setTaskCamera(is_requires_camera)

        var dependent_task_id = (tt.dependent_task_id) ? true : false;
        // setTaskRelated(dependent_task_id)
        if(dependent_task_id){
          setSelectedRelated(tt.dependent_task_id)
        }

        var interval_report = (tt.interval_report) ? true : false;
        setTaskInterval(interval_report)
        if(interval_report){
          setSelectedInterval(tt.interval_report.toString())
        }

        var recurring_task_id = (tt.recurring_task_id) ? true : false;
        setTaskRepeat(recurring_task_id)

        if(tt.files.length > 0){
          var files = [];
          tt.files.map((item,i) => {
            files.push({
              uri: item.file_url,
              name: item.filename
            })
          })
        }
      }
    }

    const doSave = () => {
      var validate = false;

      let formData = new FormData();

      formData.append("heading", taskTitle);
      formData.append("description", taskDescription);
      formData.append("start_date", selectedStartDate);
      formData.append("due_date", selectedEndDate);
      formData.append("project_id", selectedProject);
      formData.append("is_requires_gps", taskGPS);
      formData.append("is_requires_camera", taskCamera);

      var _selectedAssignee = [];
      selectedAssignee.map((item,i) => {
        _selectedAssignee.push(item)
      });

      var _selectedMember = [];
      // selectedCCTugas
      selectedDepartmentMember.map((item,i) => {
        _selectedMember.push(item.toString())
      });

      if(_selectedMember.length > 0){
        formData.append("cc_user_id",JSON.stringify(_selectedMember));
      }

      if(props.navigation.state.params.type != "edit"){
        formData.append("user_id",JSON.stringify(_selectedAssignee));
      }else{
        formData.append("user_id", _selectedAssignee[0]);
      }

      // formData.append("interval_report_check", taskInterval);
      // formData.append("interval_report", "");
      // var array = []
      // if(props.navigation.state.params.type != "edit"){
      //   if(spesifik){
      //     assignees.map((item,i) => {
      //       if(item.selected){
      //         array.push(item.id)
      //       }
      //     })
      //     formData.append("user_id", JSON.stringify(array));
      //   }else{
      //     formData.append("user_id", JSON.stringify([selectedAssignee]));  
      //   }  
      // }else{
      //   formData.append("user_id", selectedAssignee);  
      // }
      
      

      /*
      var param = {
        heading: taskTitle,
        description: taskDescription,
        start_date: selectedStartDate,
        due_date: selectedEndDate,
        project_id: selectedProject,
        // dependent_task_id: "",

        is_requires_gps: taskGPS,
        is_requires_camera: taskCamera,
        interval_report_check: taskInterval,
        interval_report: "",

        // repeat: "",
        // repeat_count: "",
        // repeat_type: "",
        // repeat_cycles: "",
        user_id: selectedAssignee,
      };
      */

      taskFiles.map((item,i) => {

        if(item.uri && item.uri.indexOf("http") == -1){
          var ind = i+1;
          formData.append("files"+ind, {
            uri: item.uri,
            name: item.name,
            type: (item.type) ? item.type : "jpg"
          });
        }
      })

      // if(taskRelated && selectedRelated && selectedRelated.length > 0){
      if(selectedRelated && selectedRelated.length > 0){
        formData.append("dependent_task_id", selectedRelated[0]);
      }
      if(taskInterval && selectedInterval){
        formData.append("interval_report_check", taskInterval);
        formData.append("interval_report", selectedInterval);
      }
      if(taskRepeat && (selectedRepeatUnit && selectedRepeatVal && selectedRepeatTimes) ){
        var repeatVal = (taskRepeat) ? 'yes' : 'no';
        formData.append("repeat", repeatVal);
        
        formData.append("repeat_count", selectedRepeatVal);
        formData.append("repeat_type", selectedRepeatUnit);
        formData.append("repeat_cycles", selectedRepeatTimes);
      }

      Reactotron.log(formData)

      if( (!selectedAssignee || selectedAssignee.length == 0) || taskTitle == "" || taskDescription == "" || selectedStartDate == "" || selectedEndDate == "" || !selectedProject || selectedProject == ""){
        validate = false;

        if(!selectedAssignee || selectedAssignee.length == 0){
          Toast.show("Anda harus memilih penerima tugas");
        }
        else if(taskTitle == ""){
          Toast.show("Anda harus mengisi judul tugas");
        }
        else if(taskDescription == ""){
          Toast.show("Anda harus mengisi deskripsi tugas");
        }
        else if(selectedStartDate == ""){
          Toast.show("Anda harus memilih tanggal mulai tugas");
        }
        else if(selectedEndDate == ""){
          Toast.show("Anda harus memilih tanggal selesai tugas");
        }
        else if(!selectedProject || selectedProject == ""){
          Toast.show("Anda harus memilih proyek");
        }
        
      }
      // else if(taskRelated && !selectedRelated && selectedRelated.length > 0){
      else if(!selectedRelated && selectedRelated.length > 0){
        Toast.show("Anda harus memilih tugas yang bersangkutan");
        validate = false;
      }
      else if(taskInterval && !selectedInterval){
        Toast.show("Anda harus mengisi kolom interval");
        validate = false;
      }
      else if(taskRepeat && (!selectedRepeatUnit || !selectedRepeatVal || !selectedRepeatTimes) ){
        Toast.show("Anda harus mengisi kolom diulang tugas dengan benar");
        validate = false;
      }
      // else if((spesifik)&&(array.length==0)){
      //   Toast.show("Anda harus memilih penerima tugas secara spesifik");
      //   validate = false;
      // }
      else{
        validate = true;
      }
      if(validate){
        if(props.navigation.state.params.type == "edit"){
          // param.task_id = props.navigation.state.params.task.id;
          formData.append("task_id", props.navigation.state.params.task.id);
          doEdit(formData);

        }else{
          doAdd(formData);
        }
      }
    }

    const doAdd = async (param) => {
      setLoading(true);
      var result = await rootStore.createTask(param);
      setLoading(false);

      // get from storage when offline
      var isOffline = false;
      if(result.kind != "ok"){

          result.data = {};
          result.kind = "ok"
          isOffline = true;

          var object = {};
          param._parts.forEach((value, key) => {
              object[value[0]] = value[1]
          });

          // add new task record
          var rand_id = new Date().getTime();
          object.is_requires_gps = (object.is_requires_gps) ? 1 : 0
          object.is_requires_camera = (object.is_requires_camera) ? 1 : 0
          object.board_column_id = 3; // set state todo
          object.due_date = moment(object.due_date, "DD-MM-YYYY").format();
          object.start_date = moment(object.start_date, "DD-MM-YYYY").format();
          object.users = [{
            ...rootStore.getCurrentUser()
          }]
          object.create_by = {
            ...rootStore.getCurrentUser()
          }
          object.taskboard_columns = {
            id: 3,
            column_name: "Akan Dilakukan",
            slug: "incomplete"
          }

          rootStore.pushData('tasks', {
            id: rand_id,
            ...object
          }, false)

          // save to queue
          rootStore.pushData('my_queues', {
              related_id: rand_id,
              type: 'task-add',
              action: 'createTask',
              will_update: "tasks",
              description: "Menambahkan tugas",
              data: JSON.stringify(param)
          });
      }

      if(result.kind == "ok" && result.data){
        Toast.show("Anda berhasil menambahkan tugas");
        goBack();
        props.navigation.state.params.onBack();
      }
    }
    const doEdit = async (param) => {
      setLoading(true);
      var result = await rootStore.updateTask(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        Toast.show("Anda berhasil mengubah informasi tugas");
        goBack();
        props.navigation.state.params.onBack();
      }
    }

    const handleStartDatePicked = date => {
      var date_str = moment(date).format("DD-MM-YYYY");

      setSelectedStartDate(date_str);
      setStartDateVisible(false);
    };

    const handleEndDatePicked = date => {
      var date_str = moment(date).format("DD-MM-YYYY");

      setSelectedEndDate(date_str);
      setEndDateVisible(false);
    };

    const loadProjects = async () => {
      // setLoading(true);
      // var cur_prof = await rootStore.getProfileUser();
      var cur_prof = rootStore.getCurrentUser();
      // Reactotron.log(cur_prof)
      // setLoading(false);

      // if(cur_prof.kind == "ok" && cur_prof.data){
        var param = {

        };

        if(showRelated){
          param = {
            ...param,
            team_id: cur_prof.employee.department_id,
            wilayah_id: cur_prof.employee.wilayah_id,
            subcompany_id: cur_prof.employee.sub_company_id,
          }
        }
        // console.log("============param");
        // console.log(param);

        setLoading(true);
        var result = await rootStore.getProjects(param);
        setLoading(false);

        // get from storage when offline
        var isOffline = false;
        if(result.kind != "ok"){
            result.data = {};
            result.kind = "ok"
            isOffline = true;

            var res_projects = rootStore.getData("projects");

            var arr = [];
            res_projects.map((p, i) => {
              if(showRelated){
                if(p.team_id == param.team_id && p.wilayah_id == param.wilayah_id && p.subcompany_id == param.subcompany_id){
                  arr.push(p);
                }
              }else{
                arr.push(p);
              }
            });

            result.data = arr
        }

        if(result.kind == "ok" && result.data){
          setProjects(result.data)
        }
      // }
    }
    const loadAssignee = async () => {
      var param = {

      };

      setLoading(true);
      var result = await rootStore.getAssignee();
      setLoading(false);

      // get from storage when offline
      var isOffline = false;
      if(result.kind != "ok"){
          result.data = {};
          result.kind = "ok"
          isOffline = true;

          result.data.assignee = rootStore.getData("assignees");
      }

      if(result.kind == "ok" && result.data){
        var array = []
        result.data.assignee.map((item,i)=>{

          if(item.id != rootStore.getCurrentUser().id){
            data = {
              ...item,
              selected:false
            }
            array.push(data)
          }
        })
        // Reactotron.log(array)
        setAssignees(array)
      }
    }

    const loadDepartments = async () => {
      var param = {

      };

      setLoading(true);
      var result = await rootStore.getDepartments();
      setLoading(false);

      if(result.kind == "ok" && result.data){
        setDepartments(result.data.data)
      }
    }
    const loadDepartmentMembers = async () => {
      var param = {
        department_id: selectedDepartment,
        module: "cc"
      };

      setLoading(true);
      var result = await rootStore.getDepartmentMembers(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){

        if(departmentMembers.length > 1){
          var tmp = [ ...departmentMembers, ...result.data.user ];
          setDepartmentMembers(tmp)

        }else{
          setDepartmentMembers(result.data.user)
        }
      }
    }

    const pickDocument = async () => {
      try {
        const results = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.images],
        });

        // var files = taskFiles;
        // Reactotron.log(results)

        // for (const res of results) {
        //   Reactotron.log(
        //     res.uri,
        //     res.type, // mime type
        //     res.name,
        //     res.size
        //   );

        //   files.push({
        //     uri: res.uri,
        //     type: res.type,
        //     name: res.name,
        //     size: res.size
        //   })
        // }

        setTaskFiles(results);

      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    }

    const loadTasks = async () => {
      var param = {
        limit: 30
      }

      setLoading(true);
      var result = await rootStore.getTasks(param);
      setLoading(false);

      // get from storage when offline
      var isOffline = false;
      if(result.kind != "ok"){
          result.data = {};
          result.kind = "ok"
          isOffline = true;

          result.data.task = rootStore.getData("tasks");
      }

      if(result.kind == "ok" && result.data){
        setTasks(result.data.task)
      }
    }

    // Accordion
    const SECTIONS = [
        {
            title: 'Isi detail tugas',
            slug: "detail-tugas"
        },
        {
            title: 'Opsi tugas',
            slug: "opsi-tugas"
        },
        {
            title: 'Unggah dokumen pendukung',
            slug: "unggah-dokumen"
        },
    ];

    const _renderSectionTitle = section => {
        return (
          <View style={styles.content}>
            
          </View>
        );
    };

    const _renderHeader = section => {
        return (
          <View style={{ ...layout.accordion.header.wrapper }}>
            <Text style={{ ...layout.typography.h4, ...layout.accordion.header.title }}>{section.title}</Text>
            <Icon name="ios-arrow-down" style={{ ...layout.accordion.header.icon }} size={20} />
          </View>
        );
    };

    const _renderContent = section => {
        return (
          <View style={{ ...layout.accordion.content.wrapper }}>
            {(section.slug == 'detail-tugas' &&
              _renderDetail()
            )}
            {(section.slug == 'opsi-tugas' &&
              _renderOpsi()
            )}
            {(section.slug == 'unggah-dokumen' && !rootStore.settings.offline_mode &&
              _renderDokumen()
            )}
          </View>
        );
    };

    const _updateSections = activeSections => {
        setActiveSections(activeSections);
    };

    /*
    const ubahSpesifik = () =>{
      setSpesifik(!spesifik)
    }

    const ubahSpesifikArray = (value) =>{
      var array = []
      assignees.map((item,i) => {
        if((value.id == rootStore.getCurrentUser().id) &&(value.selected == true)){
          setSpesifikArrayDiri(false)
        }else if((value.id == rootStore.getCurrentUser().id) &&(value.selected == false)){
          setSpesifikArrayDiri(true)
        }
        if((item.id == value.id)&&(item.selected == true)){
          var data =  {
            ...item,
            selected : false
          } 
        }else if((item.id == value.id)&&(item.selected == false)){
          var data =  {
            ...item,
            selected : true
          } 
        }else{
          var data = {...item}
        }
        array.push(data)
      })
      // Reactotron.log()
      setAssignees(array)      
    }
    const pilihSemuaSpesifikArray = () => {
      var array = []
      assignees.map((item, i)=>{
        if(!spesifikArraySemua){
           var data =  {
            ...item,
            selected : true
          }
          array.push(data)
        }else{
           var data =  {
            ...item,
            selected : false
          }         
          array.push(data)
        }
      })
      if(!spesifikArraySemua){
        setSpesifikArrayDiri(true)
      }else{
        setSpesifikArrayDiri(false)
      }
      setAssignees(array)
      setSpesifikArraySemua(!spesifikArraySemua)
    }
    const renderSpesifikItem = () => {
      var diri = {
        id : rootStore.getCurrentUser().id,
        selected : spesifikArrayDiri
         }
      return (
        <View style={{ ...layout.accordion.content.wrapper }}>
          <TouchableOpacity style={{...layout.checkbox.wrapper}} onPress={() => pilihSemuaSpesifikArray()}>
            <View style={layout.checkbox.rounded}>
              {(spesifikArraySemua &&
                <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
              )}
            </View>
            <Text style={layout.checkbox.text}>Pilih semua</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...layout.checkbox.wrapper}} onPress={() => ubahSpesifikArray(diri)}>
              <View style={layout.checkbox.rounded}>
                {(diri.selected &&
                  <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                )}
              </View>
            <Text style={layout.checkbox.text}>Diri sendiri</Text>
          </TouchableOpacity>
          {assignees.map((item,i) => {
              // Reactotron.log('item.id')
              // Reactotron.log(item.id)
              return(
                <TouchableOpacity style={{...layout.checkbox.wrapper}} onPress={() => ubahSpesifikArray(item)}>
                  <View style={layout.checkbox.rounded}>
                    {(item.selected &&
                      <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                    )}
                  </View>
                <Text style={layout.checkbox.text}>{item.name}</Text>
              </TouchableOpacity>
              )
            })}
        </View>
      );
    };
    */

    const items = [
      {
        name: 'Pilih penerima tugas',
        id: 0,
        children: [
          {
            id: rootStore.getCurrentUser().id,
            name: "Diri Sendiri"
          },
          ...assignees
        ]
      },
    ];
    const items_tasks = [
      {
        name: 'Pilih tugas',
        id: 0,
        children: [
          ...tasks
        ]
      },
    ];
    const items_projects = [
      {
        name: 'Pilih semua proyek',
        id: 0,
        children: [
          ...projects
        ]
      },
    ];
    const items_department_members = [
      {
        name: 'Pilih Member',
        id: 0,
        children: [
          ...departmentMembers
        ]
      },
    ];

    // const onSelectedItemsChange = (selectedItems) => {
      // this.setState({ selectedItems });
      // Reactotron.log(selectedItems);
      // setSelectedAssignee(selectedItems);
    // };

    const changeRelated = () => {
      setShowRelated(!showRelated)
    }

    const _renderDetail = () => {
      return(
        <View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="ios-folder" style={{ ...layout.textbox.icon }} size={20} />
              <TextInput
                  style={{ ...layout.textbox.input }}
                  placeholder="Tulis judul tugas"
                  onChangeText={text => setTaskTitle(text)}
                  value={taskTitle}
              />
          </View>

          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
              <Picker
                  selectedValue={selectedProject}
                  onValueChange={(itemValue, itemIndex) => setSelectedProject(itemValue)}
                  style={{ ...layout.dropdown.input }}
              >
                  <Picker.Item label="Pilih Proyek" value="" />
                  {projects.map((item,i) => {
                    return(
                      <Picker.Item key={"project"+i} label={item.project_name} value={item.id} />
                    )
                  })}
              </Picker>
          </View>

          <View style={{ ...layout.textbox.wrapper }}>
              <TouchableOpacity
                style={layout.checkbox.wrapper}
                onPress={() => changeRelated()}
              >
                <View style={layout.checkbox.rounded}>
                  {(showRelated == 1) &&
                    <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                  }
                </View>
                <Text style={layout.checkbox.text}>Tampilkan proyek divisi terkait</Text>
              </TouchableOpacity>
          </View>

          {/*
          {(!spesifik) && 
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, marginBottom:10 }}>
              <Icon name="ios-person" style={{ ...layout.textbox.icon }} size={20} />
              <Picker
                  selectedValue={selectedAssignee}
                  onValueChange={(itemValue, itemIndex) => setSelectedAssignee(itemValue)}
                  style={{ ...layout.dropdown.input }}
              >
                  <Picker.Item label="Pilih Penerima Tugas" value="" />
                  <Picker.Item label="Diri Sendiri" value={rootStore.getCurrentUser().id} />
                  {assignees.map((item,i) => {
                    return(
                      <Picker.Item key={"assignee"+i} label={item.name} value={item.id} />
                    )
                  })}
              </Picker>
          </View>
          }

          {(props.navigation.state.params.type != "edit") &&
            <TouchableOpacity style={{...layout.checkbox.wrapper, marginBottom: 20}} onPress={() => ubahSpesifik()}>
              <View style={layout.checkbox.rounded}>
                {(spesifik &&
                  <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                )}
              </View>
              <Text style={layout.checkbox.text}>Spesifik</Text>
          </TouchableOpacity>  
          }
          
          {(spesifik) && (props.navigation.state.params.type != "edit") &&
            renderSpesifikItem()
          }
          */}

          {/*
          <View style={{ marginBottom: 20, ...layout.textbox.outline, borderRadius: 10 }}>
            <SectionedMultiSelect
              items={items_projects}
              uniqueKey="id"
              subKey="children"
              displayKey={"project_name"}
              selectText="Pilih proyek"
              searchPlaceholderText={"Cari Proyek..."}
              showDropDowns={false}
              readOnlyHeadings={true}
              onSelectedItemsChange={(selectedItems) => {
                setSelectedProject(selectedItems[0]);
              }}
              selectedItems={selectedProject}
              selectChildren={true}
              single={true}
            />
          </View>
          */}

          <View style={{ marginBottom: 20, ...layout.textbox.outline, borderRadius: 10 }}>
            <SectionedMultiSelect
              items={items}
              uniqueKey="id"
              subKey="children"
              selectText="Pilih penerima tugas"
              searchPlaceholderText={"Cari Orang..."}
              showDropDowns={false}
              readOnlyHeadings={true}
              onSelectedItemsChange={(selectedItems) => {
                setSelectedAssignee(selectedItems);
              }}
              selectedItems={selectedAssignee}
              selectChildren={true}
              single={(props.navigation.state.params.task) ? true : false}
              // styles={{
              //   container: { ...layout.textbox.wrapper, ...layout.textbox.outline }
              // }}
            />
          </View>

          <TouchableOpacity onPress={() => setStartDateVisible(true)} style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="ios-calendar" style={{ ...layout.textbox.icon }} size={20} />
              <TextInput
                  style={{ ...layout.textbox.input }}
                  placeholder="Tanggal Mulai "
                  editable={false}
                  value={selectedStartDate}
              />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEndDateVisible(true)} style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="ios-calendar" style={{ ...layout.textbox.icon }} size={20} />
              <TextInput
                  style={{ ...layout.textbox.input }}
                  placeholder="Deadline "
                  editable={false}
                  value={selectedEndDate}
              />
          </TouchableOpacity>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <TextInput
                  style={{ ...layout.textbox.textarea }}
                  placeholder="Deskripsi"
                  multiline={true}
                  onChangeText={text => setTaskDescription(text)}
                  value={taskDescription}
              />
          </View>
        </View>
      )
    }

    const _renderOpsi = () => {
      return(
        <View>
          <TouchableOpacity style={layout.checkbox.wrapper} onPress={() => setTaskCC(!taskCC)}>
              <View style={layout.checkbox.rounded}>
                {(taskCC &&
                  <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                )}
              </View>
              <Text style={layout.checkbox.text}>Tugas ini dilaporkan ke lainnya</Text>
          </TouchableOpacity>
          {(taskCC &&
            <View>
              <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                  <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
                  <Picker
                      selectedValue={selectedDepartment}
                      onValueChange={(itemValue, itemIndex) => setSelectedDepartment(itemValue)}
                      style={{ ...layout.dropdown.input }}
                  >
                      <Picker.Item label="Pilih Departemen" value="" />
                      {(departments && departments.length > 0 && departments.map((item,i) => {
                        return(
                          <Picker.Item key={"department"+i} label={item.team_name} value={item.id} />
                        )
                      }))}
                  </Picker>
              </View>

              <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <View style={layout.dropdown.input}>
                    <SectionedMultiSelect
                      items={items_department_members}
                      uniqueKey={"id"}
                      displayKey={"name"}
                      subKey="children"
                      selectText="Pilih Penerima Notifikasi"
                      searchPlaceholderText={"Cari Orang..."}
                      showDropDowns={false}
                      readOnlyHeadings={true}
                      onSelectedItemsChange={(selectedItems) => {
                        setSelectedDepartmentMember(selectedItems);
                      }}
                      selectedItems={selectedDepartmentMember}
                      selectChildren={true}
                      single={false}
                    />
                </View>
              </View>
            </View>
          )}

          {/* <TouchableOpacity style={layout.checkbox.wrapper} onPress={() => setTaskRelated(!taskRelated)}>
              <View style={layout.checkbox.rounded}>
                {(taskRelated &&
                  <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                )}
              </View>
              <Text style={layout.checkbox.text}>Tugas ini berkaitan dengan tugas lainnya</Text>
          </TouchableOpacity> */}
          {/* {(taskRelated && 
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} /> */}
                {/*
                <Picker
                    selectedValue={selectedRelated}
                    onValueChange={(itemValue, itemIndex) => setSelectedRelated(itemValue)}
                    style={{ ...layout.dropdown.input }}
                >
                    <Picker.Item label="Pilih Tugas" value="" />

                    {(tasks && tasks.length > 0 && tasks.map((item,i) => {
                      return(
                        <Picker.Item key={"task"+i} label={item.heading} value={item.id} />
                      )
                    }))}
                </Picker>
                */}

                {/* <View style={layout.dropdown.input}>
                  <SectionedMultiSelect
                    items={items_tasks}
                    uniqueKey={"id"}
                    displayKey={"heading"}
                    subKey="children"
                    selectText="Pilih Tugas"
                    searchPlaceholderText={"Cari Tugas..."}
                    showDropDowns={false}
                    readOnlyHeadings={true}
                    onSelectedItemsChange={(selectedItems) => {
                      setSelectedRelated(selectedItems);
                    }}
                    selectedItems={selectedRelated}
                    selectChildren={true}
                    single={true}
                  />
                </View>
            </View>
          )} */}

          <TouchableOpacity style={layout.checkbox.wrapper} onPress={() => setTaskInterval(!taskInterval)}>
              <View style={layout.checkbox.rounded}>
                {(taskInterval &&
                  <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                )}
              </View>
              <Text style={layout.checkbox.text}>Tugas ini perlu dilaporkan secara berkala</Text>
          </TouchableOpacity>
          {(taskInterval &&
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <Icon name="ios-time" style={{ ...layout.textbox.icon }} size={20} />
                <TextInput
                    value={selectedInterval}
                    onChangeText={text => setSelectedInterval(text)}
                    style={{ ...layout.textbox.input }}
                    placeholder="Masukkan Interval Waktu (Menit)"
                    keyboardType={"number-pad"}
                />
            </View>
          )}

          <TouchableOpacity style={layout.checkbox.wrapper} onPress={() => setTaskGPS(!taskGPS)}>
              <View style={layout.checkbox.rounded}>
                {(taskGPS &&
                  <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                )}
              </View>
              <Text style={layout.checkbox.text}>Tugas ini memerlukan akses GPS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={layout.checkbox.wrapper} onPress={() => setTaskCamera(!taskCamera)}>
              <View style={layout.checkbox.rounded}>
                {(taskCamera &&
                  <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                )}
              </View>
              <Text style={layout.checkbox.text}>Tugas ini memerlukan akses ke kamera</Text>
          </TouchableOpacity>

          {(props.navigation.state.params.type != "edit" &&
            <View>

              {(!rootStore.settings.offline_mode &&
                <TouchableOpacity style={layout.checkbox.wrapper} onPress={() => setTaskRepeat(!taskRepeat)}>
                    <View style={layout.checkbox.rounded}>
                      {(taskRepeat &&
                        <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                      )}
                    </View>
                    <Text style={layout.checkbox.text}>Ulangi Tugas</Text>
                </TouchableOpacity>
              )}
              
              {(taskRepeat &&
                <View>
                  <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                      <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
                      <TextInput
                          style={{ ...layout.textbox.input }}
                          placeholder="Masukkan Angka"
                          onChangeText={text => setSelectedRepeatVal(text)}
                          value={selectedRepeatVal}
                          keyboardType={"number-pad"}
                      />
                  </View>
                  <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                      <Icon name="ios-time" style={{ ...layout.textbox.icon }} size={20} />
                      <Picker
                          selectedValue={selectedRepeatUnit}
                          onValueChange={(itemValue, itemIndex) => setSelectedRepeatUnit(itemValue)}
                          style={{ ...layout.dropdown.input }}
                      >
                          <Picker.Item label="Pilih Satuan Waktu" value="" />
                          <Picker.Item label="Hari" value="day" />
                          <Picker.Item label="Minggu" value="week" />
                          <Picker.Item label="Bulan" value="month" />
                          <Picker.Item label="Tahun" value="year" />
                      </Picker>
                  </View>
                  <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                      <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
                      <TextInput
                          style={{ ...layout.textbox.input }}
                          placeholder="Masukkan Jumlah Pengulangan"
                          onChangeText={text => setSelectedRepeatTimes(text)}
                          value={selectedRepeatTimes}
                          keyboardType={"number-pad"}
                      />
                  </View>
                </View>
              )}
            </View>
          )}

        </View>
      )
    }

    const _renderDokumen = () => {
      return(
        <View>
          <View style={{...layout.file_field.container, marginTop: 0 }}>
            
            {(taskFiles.map((item,i) => {
              return(
                <TouchableOpacity 
                  key={"file"+i} 
                  style={{...layout.file_field.container_inside}}
                  onPress={() => (props.navigation.state.params.task) ? Linking.openURL(item.file_url) : null }
                >
                    <View style={{flexDirection:'row'}}>
                        <Image source={require('@assets/doc.png')} style={{...layout.file_field.image_doc}} />
                        <View style={{marginLeft:0.027*deviceWidth}}>
                            <Text style={{...layout.file_field.namefile}}>{(item.name) ? item.name : item.filename}</Text>
                        </View>
                    </View>
                    {/*
                    <TouchableOpacity style={{...layout.file_field.button_group}}>
                        <Image source={require('@assets/ic_delete.png')} style={{...layout.file_field.image_ic_delete}} />
                    </TouchableOpacity>
                    */}
                </TouchableOpacity>
              )
            }))}

            <TouchableOpacity style={styles.row} onPress={() => pickDocument()}>
              <Icon name="ios-add-circle-outline" style={{ ...styles.icon_add }} size={20} />
              <Text style={{ ...layout.typography.body, color: "#381D5C" }}>Upload Dokumen</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    const formatDate = (datenow) => {
        return moment(datenow).format("MMM Do YYYY");
    }
    const formatTime = (datenow) => {
        return moment(datenow).format("h:mm:ss a");
    }

    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />

        <DateTimePicker
          isVisible={startDateVisible}
          onConfirm={handleStartDatePicked}
          onCancel={() => setStartDateVisible(false)}
          mode={"date"}
          minimumDate={new Date()}
        />

        <DateTimePicker
          isVisible={endDateVisible}
          onConfirm={handleEndDatePicked}
          onCancel={() => setEndDateVisible(false)}
          mode={"date"}
          minimumDate={new Date()}
        />

        <Head type="detail" title={(props.navigation.state.params.type == 'add') ? 'Tambah tugas baru' : 'Ubah Tugas'} navigation={props.navigation} />
        
        <ScrollView style={layout.container.content_wtabbar}>
            
          <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
            <Accordion
                sections={SECTIONS}
                activeSections={activeSections}
                renderSectionTitle={_renderSectionTitle}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                onChange={_updateSections}
                underlayColor={"#fff"}
                sectionContainerStyle={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section, ...layout.accordion.section }}
            />

            <Button onPress={() => doSave()} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
                <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>SIMPAN</Text>
            </Button>
            
          </View>

        </ScrollView>

      </View>
    )
})
