import dva from "dva";
import "./index.css";

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require("./models/page").default);
app.model(require("./models/articles").default);
app.model(require("./models/article").default);
app.model(require("./models/user").default);

// 4. Router
app.router(require("./router").default);

// 5. Start
app.start("#root");
