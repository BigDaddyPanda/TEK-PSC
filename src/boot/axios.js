import axios from "axios";

export default async ({ Vue }) => {
  const instance = axios.create({
    headers: { "X-Custom-Header": "foobar" }
  });
};
