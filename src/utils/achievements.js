import _ from "lodash";
export default {
  achievementsList: [
    {
      name: "achievement 4",
      required: [
        {
          target: "problem",
          goal: 1
        }
      ],
      icon: "statics/achievements/novice_thinker.png",
      color: "blue-grey-5",
      label: "Novice Thinker",
      description: "You proved you have positive iQ by solving first problem"
    },
    {
      name: "achievement 2",
      required: [
        {
          target: "contest",
          goal: 1
        }
      ],
      icon: "statics/achievements/discovery.png",
      color: "yellow-9",
      label: "Discovery Novice",
      description: "You proved you have positive iQ by solving first problem!"
    },
    {
      name: "achievement 3",
      required: [
        {
          target: "contest",
          goal: 2
        }
      ],
      icon: "statics/achievements/mystery_buster.png",
      color: "green",
      label: "Mystery Buster",
      description:
        "You are a Sea monster and Python slayer! see what I did there? :D"
    },
    {
      name: "achievement 7",
      required: [
        {
          target: "contest",
          goal: 3
        }
      ],
      icon: "statics/achievements/trophy_hunter.png",
      color: "teal",
      label: "Trophy Hunter",
      description:
        "Skills win games. and you are a set of Problem Solving Skills"
    },
    {
      name: "achievement 6",
      required: [
        {
          target: "problem",
          goal: 300
        }
      ],
      icon: "statics/achievements/problem_solver.png",
      color: "pink-5",
      label: "Problem Solver",
      description: "Problem Solver is your middle name, or nickname..."
    },
    {
      name: "achievement 5",
      required: [
        {
          target: "problem",
          goal: 500
        }
      ],
      icon: "statics/achievements/outstanding.png",
      color: "pink-9",
      label: "Outstanding",
      description: "Now problems have to solve you!"
    },
    {
      name: "achievement 1",
      required: [
        {
          target: "problem",
          goal: 1000
        }
      ],
      icon: "statics/achievements/advanced.png",
      color: "purple",
      label: "Advanced Legend",
      description:
        "You are the most advanced of the TEK-UPPERS Problem Solvers."
    }
  ],
  /**
   * seek for each achievement requirement whether the served
   * params meet its goals
   * @param {*} lessonsCount length of solved lessons
   * @param {*} problemsCount length of solved problems
   * @param {*} contestsCount contests user sat/passed
   */
  filterAchievements(lessonsCount, problemsCount, contestsCount) {
    return _.filter(this.achievementsList, e => {
      let problemMilestone = _.find(e.required, ["target", "problem"]);
      if (problemMilestone) {
        if (problemsCount < problemMilestone.goal) {
          return false;
        }
      }
      let lessonMilestone = _.find(e.required, ["target", "lesson"]);
      if (lessonMilestone) {
        if (lessonsCount < lessonMilestone.goal) {
          return false;
        }
      }
      let contestMilestone = _.find(e.required, ["target", "contest"]);
      if (contestMilestone) {
        if (contestsCount < contestMilestone.goal) {
          return false;
        }
      }
      return true;
    });
  },

  /**
   * returns the achievement logo form statics/achievements/logo folder
   * @param {*} a achievements count
   */
  getAchievementLogo(a) {
    let v = 1;
    if (a < 1) v = 1;
    if (a > 7) v = 7;
    return `statics/achievements/logo/ach-logo (${v}).png`;
  }
};
