import colors from "colors";
import { PORT } from "./config/env.js";
import app from "./app.js";

const PORTENV = Number(PORT);

app.listen(PORTENV, () => {
  console.log(colors.cyan.bold(`Server is running on port ${PORT}`));
});
