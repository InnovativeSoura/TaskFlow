// src/socket/socket.js

import { io } from "socket.io-client";

/* ======================================================
   SERVER URL
====================================================== */

/*
  VITE_API_URL:
  https://taskflow-t8cj.onrender.com

  OR:
  https://taskflow-t8cj.onrender.com/api

  Socket.IO must connect to the server root,
  not /api.
*/

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/*
  Remove trailing slash.
*/
const CLEAN_API_URL =
  API_URL.replace(/\/+$/, "");

/*
  Remove /api only if it exists at the end.
*/
const SERVER_URL =
  CLEAN_API_URL.replace(/\/api$/, "");

console.log("====================================");
console.log("🔌 TaskFlow Socket Configuration");
console.log("====================================");
console.log("🌐 API URL:", API_URL);
console.log("🔌 Socket URL:", SERVER_URL);
console.log("====================================");

/* ======================================================
   SOCKET INSTANCE
====================================================== */

const socket = io(SERVER_URL, {
  /*
    Use WebSocket directly.

    Your Render backend already supports
    WebSocket connections successfully.
  */
  transports: ["websocket"],

  /*
    Needed because your backend uses credentials
    and cross-origin requests.
  */
  withCredentials: true,

  /*
    Reconnect automatically if the connection
    temporarily drops.
  */
  reconnection: true,

  /*
    Number of reconnection attempts.
    Infinity keeps trying until the server
    becomes available again.
  */
  reconnectionAttempts: Infinity,

  /*
    Wait 1 second before the first reconnect.
  */
  reconnectionDelay: 1000,

  /*
    Maximum reconnect delay.
  */
  reconnectionDelayMax: 5000,

  /*
    Randomisation prevents clients from all
    reconnecting at exactly the same moment.
  */
  randomizationFactor: 0.5,

  /*
    Connection timeout.
  */
  timeout: 20000,

  /*
    Don't establish duplicate connections.
  */
  autoConnect: true,
});

/* ======================================================
   CONNECT
====================================================== */

socket.on("connect", () => {
  console.log(
    "===================================="
  );

  console.log(
    "✅ Socket Connected:",
    socket.id
  );

  console.log(
    "🌐 Socket Server:",
    SERVER_URL
  );

  console.log(
    "===================================="
  );
});

/* ======================================================
   CONNECT ERROR
====================================================== */

socket.on("connect_error", (error) => {
  console.warn(
    "⚠️ Socket Connection Error:",
    error.message
  );
});

/* ======================================================
   DISCONNECT
====================================================== */

socket.on("disconnect", (reason) => {
  console.log(
    "🔌 Socket Disconnected:",
    reason
  );

  /*
    Important:

    If the browser puts the page into the
    Back-Forward Cache, the disconnect is
    expected.

    The pageshow listener below will reconnect
    when the page is restored.
  */
});

/* ======================================================
   RECONNECTING
====================================================== */

socket.io.on("reconnect_attempt", (attempt) => {
  console.log(
    `🔄 Socket Reconnect Attempt #${attempt}`
  );
});

/* ======================================================
   RECONNECTED
====================================================== */

socket.io.on("reconnect", (attempt) => {
  console.log(
    `✅ Socket Reconnected After ${attempt} Attempt(s)`
  );

  console.log(
    "🆔 New Socket ID:",
    socket.id
  );
});

/* ======================================================
   RECONNECT ERROR
====================================================== */

socket.io.on("reconnect_error", (error) => {
  console.warn(
    "⚠️ Socket Reconnect Error:",
    error.message
  );
});

/* ======================================================
   RECONNECT FAILED
====================================================== */

socket.io.on("reconnect_failed", () => {
  console.error(
    "❌ Socket Reconnection Failed"
  );
});

/* ======================================================
   PAGEHIDE
====================================================== */

/*
  Chrome may place the page into the
  Back-Forward Cache when navigating away.

  An active WebSocket connection can cause
  the browser to terminate the connection.

  We explicitly disconnect here so the browser
  doesn't report a confusing WebSocket failure.
*/

const handlePageHide = () => {
  if (socket.connected) {
    console.log(
      "📦 Page hidden - closing Socket.IO connection"
    );

    socket.disconnect();
  }
};

window.addEventListener(
  "pagehide",
  handlePageHide
);

/* ======================================================
   PAGESHOW
====================================================== */

/*
  If the browser restores the page from
  Back-Forward Cache, reconnect Socket.IO.
*/

const handlePageShow = (event) => {
  /*
    event.persisted === true means that the
    page was restored from the bfcache.
  */

  if (event.persisted) {
    console.log(
      "♻️ Page restored from Back-Forward Cache"
    );

    if (!socket.connected) {
      console.log(
        "🔄 Reconnecting Socket.IO..."
      );

      socket.connect();
    }
  }
};

window.addEventListener(
  "pageshow",
  handlePageShow
);

/* ======================================================
   VISIBILITY CHANGE
====================================================== */

/*
  This does NOT disconnect the socket just because
  the user switches tabs.

  We only use it for diagnostics.

  This prevents unnecessary disconnect/reconnect
  cycles when the user simply changes tabs.
*/

const handleVisibilityChange = () => {
  if (document.visibilityState === "visible") {
    console.log(
      "👁️ TaskFlow page became visible"
    );

    /*
      If the socket unexpectedly disconnected
      while the page became visible, reconnect.
    */
    if (
      !socket.connected &&
      !socket.active
    ) {
      console.log(
        "🔄 Socket inactive - reconnecting..."
      );

      socket.connect();
    }
  }
};

document.addEventListener(
  "visibilitychange",
  handleVisibilityChange
);

/* ======================================================
   EXPORT
====================================================== */

export default socket;