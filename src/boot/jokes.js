import _ from "lodash";

const lessonLoadingJokes = [
  "If it seems hard, Dynamically Program it...",
  "Tourist is over rated, you are better",
  "Loading Content from localhost",
  "Screaming to help Goku defeat Freeza",
  "Getting random Quiz from Google"
];

export default async ({ Vue }) => {
  Vue.prototype.$lessonJoke = () => _.sample(lessonLoadingJokes);
};
