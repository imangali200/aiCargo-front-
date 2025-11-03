import axios from "axios";
export default defineNuxtPlugin(() => {
  const instance = axios.create({
    baseURL: "https://ai-cargo.onrender.com/",
  });
  return {
    provide: {
      axios: instance,
    },
  };
});
