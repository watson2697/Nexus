import express from "express";
import { closeDbConnection, initDb } from "./db";



const app = express();
let server: ReturnType<typeof app.listen>

const main = async () => {
  try {
    await initDb()
    const port = process.env.PORT || 7000;
    server = app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log(error)
    await closeDbConnection()
    server?.close()
  }

  // app.get('/greet/:what', (req, res) => res.json({ greeating: `Ciao a ${req.params.what}` }));
};

main();

