const routes = [
  {
    path: "/",
    meta: { private: false },
    component: () => import("layouts/PSCLayout.vue"),
    redirect: "/landing",
    children: [
      {
        path: "landing",
        meta: { title: "TEK PS" },
        component: () => import("pages/Public/Landing.vue")
      },
      {
        path: "calendar",
        meta: { title: "TEK PS-Calendar" },
        component: () => import("pages/Public/Calendar.vue")
      },
      {
        path: "about-us",
        meta: { title: "TEK PS-About Us" },
        component: () => import("pages/Public/AboutUs.vue")
      }
    ]
  },
  {
    path: "/manager",
    redirect: "/manager/contest",
    meta: { private: true, requiresAdminShip: true },
    component: () => import("layouts/PSCLayout.vue"),
    children: [
      {
        path: "lesson",
        meta: { title: "TEK PS- Lesson" },
        component: () => import("pages/Manager/Lesson.vue")
      },
      {
        path: "contest",
        meta: { title: "TEK PS- Contest" },
        component: () => import("pages/Manager/Contest.vue")
      },
      {
        path: "sheet",
        meta: { title: "TEK PS- Sheets" },
        component: () => import("pages/Manager/Sheets.vue")
      },
      {
        path: "admin-chatbox",
        meta: { title: "TEK PS-Admin Chatbox" },
        component: () => import("pages/Manager/ChatBox.vue")
      }
    ]
  },
  {
    path: "/psc",
    meta: { private: true },
    component: () => import("layouts/PSCLayout.vue"),
    redirect: "/psc/week-activity-overview",
    children: [
      {
        path: "rules-desclaimer",
        meta: { title: "TEK PS-Rules Desclaimer" },
        component: () => import("pages/PSC/RulesDesclaimer.vue")
      },
      {
        path: "profile",
        meta: { title: "TEK PS-Profile" },
        component: () => import("pages/Auth/Profile.vue")
      },
      {
        path: "week-activity-overview",
        meta: { title: "TEK PS-Week Activity Overview" },
        component: () => import("pages/PSC/WeekActivity/OverView.vue")
      },
      {
        path: "week-activity-lessons",
        meta: { title: "TEK PS-Week Activity Lessons" },
        component: () => import("pages/PSC/WeekActivity/Lesson.vue")
      },
      {
        path: "lesson/:id",
        meta: { title: "TEK PS-Lesson" },
        component: () => import("pages/PSC/Content/Lesson.vue")
      },
      {
        path: "round/:id",
        meta: { title: "TEK PS- Round" },
        component: () => import("pages/PSC/Content/Round.vue")
      },
      {
        path: "week-activity-sheets",
        meta: { title: "TEK PS-Week Activity Sheets" },
        component: () => import("pages/PSC/WeekActivity/Sheets.vue")
      },
      {
        path: "contests",
        meta: { title: "TEK PS-Week Activity Contests" },
        component: () => import("pages/PSC/WeekActivity/Contests.vue")
      },
      {
        path: "contest/:id",
        meta: { title: "TEK PS-Contests Final Standing" },
        component: () => import("pages/PSC/WeekActivity/FinalStanding.vue")
      },
      {
        path: "ratings",
        meta: { title: "TEK PS-Weekly Ratings" },
        component: () => import("pages/PSC/WeekActivity/Ratings.vue")
      },
      {
        path: "hall-of-fame",
        meta: { title: "TEK PS-Hall Of Fame" },
        component: () => import("pages/PSC/HallOfFame.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
