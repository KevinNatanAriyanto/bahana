import { createStackNavigator } from "react-navigation"
// import { WelcomeScreen } from "../screens/welcome-screen"
// import { DemoScreen } from "../screens/demo-screen"
import { LandingpageScreen } from "../screens/landingpage-screen"
import { LoginScreen } from "../screens/login-screen"
import { ForgotScreen } from "../screens/login-screen/forgot-screen"
// import { RegisterScreen } from "../screens/register-screen"
import { HomeScreen } from "../screens/home-screen"
import { LaporanScreen, LaporanDetailScreen, FormLaporanScreen } from "../screens/laporan-screen"
import { TasksScreen, TasksDetailScreen, FormTasksScreen, ReportTasksScreen } from "../screens/tasks-screen"
import { PengajuanScreen, PengajuanDetailScreen, FormPengajuanScreen, FormBiayaScreen, FormSekretarisScreen } from "../screens/pengajuan-screen"
import { ProjectsScreen, ProjectsDetailScreen, FormProjectsScreen, AddMembersScreen } from "../screens/projects-screen"
import { SuccessScreen } from "../screens/success-screen"

import { AbsenceScreen, AbsenceHistoryScreen, AbsenceSuccessScreen, PertanyaanScreen, AbsenceScanScreen, AbsencePhotoScreen, AbsenceGpsScreen, AbsenceCheckGpsScreen  } from "../screens/absence-screen"
import { WorkReportListScreen, WorkReportDetailScreen } from "../screens/workreport-screen"
import { NotifScreen, NotifDetailScreen, FormNotifScreen } from "../screens/notif-screen"
import { AboutScreen, PrivacyScreen, TocScreen } from "../screens/static-screen"
import { MeetingScreen, AddMeetingScreen } from "../screens/meeting-screen"
import { OtorisasiScreen } from "../screens/otorisasi-screen"

import { FormScreen, FormListScreen, FormDetailScreen, FormHistoryScreen, FormAddScreen } from "../screens/form-screen"

import { BootstrapScreen } from "../screens/bootstrap-screen"
import { ProfileScreen, EditProfileScreen, ChangePasswordScreen, EditLokasiRumahScreen } from "../screens/profile-screen"
import { MenuScreen } from "../screens/menu-screen"

export const LandingNavigator = createStackNavigator(
  {
    // welcome: { screen: WelcomeScreen },
    // demo: { screen: DemoScreen },
    // landing: { screen: LandingpageScreen },
    // register: { screen: RegisterScreen },
    login: { screen: LoginScreen },
    forgot: { screen: ForgotScreen },
    // question: { screen: QuestionpageScreen },
    // questionlanding: { screen: QuestionpageLandingScreen },
    // questionone: { screen: QuestionpageOneScreen },
    // questiontwo: { screen: QuestionpageTwoScreen },
    // verify: { screen: VerifyScreen },
    success: { screen: SuccessScreen },

  },
  {
    headerMode: "none",
  },
)

export const PrimaryNavigator = createStackNavigator(
  {
    home: { screen: HomeScreen },

    otorisasi: { screen: OtorisasiScreen },

    tasks: { screen: TasksScreen },
    form_tasks: { screen: FormTasksScreen },
    report_tasks: { screen: ReportTasksScreen },
    task_detail: { screen: TasksDetailScreen },

    forms: { screen: FormScreen },
    form_list: { screen: FormListScreen },
    form_detail: { screen: FormDetailScreen },
    form_history: { screen: FormHistoryScreen },
    form_add: { screen: FormAddScreen },

    laporan: { screen: LaporanScreen },
    form_laporan: { screen: FormLaporanScreen },
    laporan_detail: { screen: LaporanDetailScreen },

    pengajuan: { screen: PengajuanScreen },
    form_pengajuan: { screen: FormPengajuanScreen },
    pengajuan_detail: { screen: PengajuanDetailScreen },
    form_biaya: { screen: FormBiayaScreen },
    form_sekretaris: { screen: FormSekretarisScreen },

    notif: { screen: NotifScreen },
    form_notif: { screen: FormNotifScreen },
    notif_detail: { screen: NotifDetailScreen },

    projects: { screen: ProjectsScreen },
    form_projects: { screen: FormProjectsScreen },
    projects_detail: { screen: ProjectsDetailScreen },
    add_members: { screen: AddMembersScreen },

    // verify: { screen: VerifyScreen },
    success: { screen: SuccessScreen },
    absence: { screen: AbsenceScreen },
    absence_history: { screen: AbsenceHistoryScreen },
    absence_success: { screen: AbsenceSuccessScreen },
    absence_pertanyaan: { screen: PertanyaanScreen },
    absence_photo: { screen: AbsencePhotoScreen },
    absence_scan_qr: { screen: AbsenceScanScreen },
    absence_check_gps: { screen: AbsenceCheckGpsScreen },
    absence_gps: { screen: AbsenceGpsScreen },
    work_report_list:{screen : WorkReportListScreen},
    work_report_detail:{screen : WorkReportDetailScreen},
    meeting: { screen: MeetingScreen },
    add_meeting: { screen: AddMeetingScreen },
    // complaint: { screen: ComplaintScreen },
    // chef: { screen: ChefScreen },
    // chefList: { screen: ChefListScreen },
    // chefDetail: { screen: ChefDetailScreen },
    change_password: { screen: ChangePasswordScreen },
    edit_lokasi_rumah: { screen: EditLokasiRumahScreen },
    edit_profile: { screen: EditProfileScreen },
    profile: { screen: ProfileScreen },
    // premium: { screen: PremiumScreen },
    // premiumDetail: { screen: PremiumDetailScreen },
    menu: { screen: MenuScreen },
    // news: { screen: NewsScreen },
    // newsDetail: { screen: NewsDetailScreen },
    // organisation: { screen: OrganisationScreen },
    // education: { screen: EducationScreen },
    // vacancy: { screen: VacancyScreen },
    // vacancyPost: { screen: VacancyPostScreen },
    // vacancyList: { screen: VacancyListScreen },
    // vacancyDetail: { screen: VacancyDetailScreen },
    // vacancyApply: { screen: VacancyApplyScreen },
    // event: { screen: EventScreen },
    // eventDetail: { screen: EventDetailScreen },
    // eventPropose: { screen: EventProposeScreen },
    // forum: { screen: ForumScreen },
    // forumDetail: { screen: ForumDetailScreen },
    // learning: { screen: LearningScreen },
    // learningList: { screen: LearningListScreen },
    // learningDetail: { screen: LearningDetailScreen },
    // learningCourse: { screen: LearningCourseScreen },
    // shop: { screen: ShopScreen },
    // shopList: { screen: ShopListScreen },
    // shopPayment: { screen: ShopPaymentScreen },
    // shopDetail: { screen: ShopDetailScreen },
    // shopReview: { screen: ShopReviewScreen },
    // charity: { screen: CharityScreen },
    // charityList: { screen: CharityListScreen },
    // charityDetail: { screen: CharityDetailScreen },
    // certification: { screen: CertificationScreen },
    // certificationStatus: { screen: CertificationStatusScreen },
    // certificationForm: { screen: CertificationFormScreen },
    // certificationResto: { screen: CertificationRestoScreen },
    // funding: { screen: FundingScreen },
    // fundingDetail: { screen: FundingDetailScreen },
    // fundingPost: { screen: FundingPostScreen },
    // donation: { screen: DonationScreen },
    // business: { screen: BusinessScreen },
    // businessdetail: { screen: BusinessDetailScreen },
    about: { screen: AboutScreen },
    privacy: { screen: PrivacyScreen },
    toc: { screen: TocScreen },
    // recipes: { screen: RecipesScreen },
    // recipesDetail: { screen: RecipesDetailScreen },
    // recipesInput: { screen: RecipesInputScreen },

    bootstrap: { screen: BootstrapScreen },
  },
  {
    headerMode: "none",
  },
)

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 */
export const exitRoutes: string[] = ["login", "home"]
