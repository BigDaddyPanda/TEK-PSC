import axios from "axios";

export default async ({ Vue }) => {
  const goto = link => {
    window.open(link, "_blank");
  };
  Vue.prototype.$goto = goto;
  // const genResource = res =>
  //   `https://us-central1-tek-up-psc.cloudfunctions.net/${res}`;
  const genResource = res =>
    `http://localhost:5000/tek-up-psc/us-central1/${res}`;
  // const serverAdress = process.env.MODE;
  // const fbInstance = axios;
  Vue.prototype.$axios = axios;
  Vue.prototype.$faxios = axios.create({
    baseURL: genResource("")
  });
  Vue.prototype.$genRes = genResource;
};
