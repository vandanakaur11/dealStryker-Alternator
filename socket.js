let io;
module.exports = {
  init: function (server) {
    // start socket.io server and cache io value
    io = require("socket.io")(server, {
      allowEIO3: true,
      cors: { credentials: true, origin: [
        "https://app.dealstryker.com/", "https://app.dealstryker.com", "https://app.dealstryker.com/*",
      "https://chassis-staging.herokuapp.com", "https://chassis-staging.herokuapp.com/", "https://chassis-staging.herokuapp.com/*"] },
    });
    return io;
  },
  getio: function () {
    // return previously cached value
    if (!io) {
      throw new Error("must call .init(server) before you can call .getio()");
    }
    return io;
  },
};
