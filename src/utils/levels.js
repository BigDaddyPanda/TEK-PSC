export default {
  levelsSet: [
    {
      id: 0,
      name: "level 0",
      maximum_xp: 50,
      icon: "statics/levels/Asset 0.png",
      color: "green",
      label: "Mushroom",
      description:
        "Just signed to our platform, you have to work harder to become more than Teemo's ultimate"
    },
    {
      id: 1,
      name: "level 1",
      maximum_xp: 100,
      icon: "statics/levels/Asset 1.png",
      color: "brown-3",
      label: "Novice Solver",
      description:
        "You are to shine even brighter <3 brighter than just a coin!"
    },
    {
      id: 2,
      name: "level 2",
      maximum_xp: 230,
      icon: "statics/levels/Asset 2.png",
      color: "brown",
      label: "Solution Charmer",
      description:
        "Nothing can stand between you and the solution, not even tricky problems"
    },
    {
      id: 3,
      name: "level 3",
      maximum_xp: 420,
      icon: "statics/levels/Asset 3.png",
      color: "teal-7",
      label: "Oracle of TEK-PS",
      description: "Unless caught on steriods, you are a promising genius!"
    },
    {
      id: 4,
      name: "level 4",
      maximum_xp: 690,
      icon: "statics/levels/Asset 4.png",
      color: "red",
      label: "Problem Born",
      description:
        "Mythic Legend! You know problems more than TEK-Coders team, all combined!"
    },
    {
      id: 5,
      name: "level 5",
      maximum_xp: 800,
      icon: "statics/levels/Asset 5.png",
      color: "purple",
      label: "Legendray Tourist",
      description:
        "This whole thing was just a piece of cake! You smashed every problem into sub-problems!"
    }
  ],
  calculateLevel(xp) {
    let level = 0;
    let prev = 50;
    let next = 100;
    if (xp > 50) {
      level = 1;
      prev = 50;
      next = 100;
    }
    if (xp > 100) {
      level = 2;
      prev = 100;
      next = 230;
    }
    if (xp > 230) {
      level = 3;
      prev = 230;
      next = 420;
    }
    if (xp > 420) {
      level = 4;
      prev = 420;
      next = 690;
    }
    if (xp > 690) {
      level = 5;
      prev = 690;
      next = 800;
    }
    return { level_state: this.levelsSet[level], curr: xp, next, prev };
  }
};
