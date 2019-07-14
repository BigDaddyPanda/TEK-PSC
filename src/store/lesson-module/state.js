export default {
  //
  dialog: false,
  lessons: [],
  lessonPreview: {
    lessonId: null,
    name: "",
    content: "",
    editor: "",
    isWeekActivity: false,
    addedDate: "",
    coverPhoto: "",
    isPublic: true,
    tags: [],
    quiz: [
      {
        question: "",
        answers: ["", "", "", ""],
        correct: [2]
      }
    ],
    nextLesson: "",
    completedBy: []
  }
};
