
const routes = [
  {
    path: '/',
    meta: { private: false },
    component: () => import('layouts/PublicLayout.vue'),
    redirect: "/landing",
    children: [
      { path: 'landing', component: () => import('pages/Public/Landing.vue') },
      { path: 'calendar', component: () => import('pages/Public/Calendar.vue') },
      { path: 'about-us', component: () => import('pages/Public/AboutUs.vue') }
    ]
  },
  {
    path: '/manager',
    redirect: "/setting-contest",
    meta: { private: true },
    component: () => import('layouts/ManagerLayout.vue'),
    children: [
      { path: 'setting-contest', component: () => import('pages/Manager/SettingContest.vue') },
      { path: 'setting-sheets', component: () => import('pages/Manager/SettingSheets.vue') },
      { path: 'admin-chatbox', component: () => import('pages/Manager/ChatBox.vue') }
    ]
  },
  {
    path: '/auth',
    meta: { private: true },
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/Auth/Login.vue') },
      { path: 'register', component: () => import('pages/Auth/Register.vue') }
    ]
  },
  {
    path: '/psc',
    component: () => import('layouts/PSCLayout.vue'),
    children: [
      { path: 'rules-desclaimer', component: () => import('pages/PSC/RulesDesclaimer.vue') },
      { path: 'week-activity-overView', component: () => import('pages/PSC/WeekActivity/WeekActivityOverView.vue') },
      { path: 'week-activity-sheets', component: () => import('pages/PSC/WeekActivity/Sheets.vue') },
      { path: 'week-activity-contests', component: () => import('pages/PSC/WeekActivity/Contests.vue') },
      { path: 'week-activity-final-standing', component: () => import('pages/PSC/WeekActivity/FinalStanding.vue') },
      { path: 'profile-overView', component: () => import('pages/PSC/Profile/ProfileOverView.vue') },
      { path: 'profile-settings', component: () => import('pages/PSC/Profile/ProfileSettings.vue') },
      { path: 'hall-of-fame', component: () => import('pages/PSC/HallOfFame.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
