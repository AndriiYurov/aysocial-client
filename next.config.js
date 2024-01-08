// const execsync = require("child_process").execsync;

// const lastcommitcommand = "git rev-parse head";

// module.exports = {
//   async generatebuildid() {
//     return execsync(lastcommitcommand).tostring().trim();
//   },
// };

module.exports = {
  experimental: {
    scrollRestoration: true,
  },
};
