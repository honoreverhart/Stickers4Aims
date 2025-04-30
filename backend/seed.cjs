const { client, createTables, createUser, createSticker } = require("./db");

async function builtdb() {
  try {
    client.connect();
    console.log("connected to database");

    await createTables();
    console.log("tables created");

    await createUser({
      username: "moe",
      password: "m_pw",
    });
    await createUser({
      username: "lucy",
      password: "l_pw",
    });
    await createUser({
      username: "ethyl",
      password: "e_pw",
    });
    await createUser({
      username: "curly",
      password: "c_pw",
    });
    await createSticker({ name: "run" });
    await createSticker({
      name: "bench",
    });
    await createSticker({
      name: "backsquat",
    });

    console.log("feed done!");
    client.end();
  } catch (error) {
    throw error;
  }
}
builtdb();
