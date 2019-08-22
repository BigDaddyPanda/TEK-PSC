export default {
  theme: [
    {
      label: 'Dark',
      value: 'monokai'
    },
    {
      label: 'Light',
      value: 'chrome'
    }
  ],
  size: [12, 18, 24, 32].map(e => ({ label: e + " px", value: e + "px" })),
  lang: [
    {
      label: 'C/C++',
      value: 'c_cpp'
    },
    {
      label: 'Python',
      value: 'python'
    }
  ]
};
