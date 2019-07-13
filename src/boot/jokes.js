import _ from "lodash";

const lessonLoadingJokes = [
  "Getting random content from GFG",
  "Tourist is over rated, you are better",
  "Reporting Czerny for picking Quinn top",
  "Loading Content",
  "Rendering 2KB of 4K Memes ..."
];

export default async ({ Vue }) => {
  Vue.prototype.$lessonJoke = () => _.sample(lessonLoadingJokes);
};
