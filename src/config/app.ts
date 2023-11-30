interface AppConfig {
  name: string;
  github: {
    title: string;
    url: string;
  };
  author: {
    name: string;
    url: string;
  };
}

export const appConfig: AppConfig = {
  name: "guillemette.dev",
  github: {
    title: "Michael Guillemette",
    url: "https://github.com/mjguillemette",
  },
  author: {
    name: "mjguillemette",
    url: "https://github.com/mjguillemette",
  },
};
