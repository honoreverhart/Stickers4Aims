const {
  client,
  createTables,
  createUser,
  fetchUsers,
  createSticker,
  fetchStickers,
  destroySticker,
  editSticker,
  authenticate,
  findUserWithToken,
} = require("./db");
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const path = require("path");

//middleware
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send("Token is required");
    }

    const user = await findUserWithToken(token);
    if (!user) {
      return res.send(401).send("Invalid Token or user not found");
    }

    req.user = user;
  } catch (ex) {
    next(ex);
  }
};

//RESTful

app.post("/api/auth/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    res.send(await createUser(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth/me", isLoggedIn, (req, res, next) => {
  try {
    res.send(req.user);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/stickers", async (req, res, next) => {
  try {
    res.send(await fetchStickers());
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/stickers", async (req, res, next) => {
  try {
    res.send(
      await createSticker({
        name: req.body.name,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/stickers/:id", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await destroySticker(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.patch("/api/edit_stickers", isLoggedIn, async (req, res, next) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).send("Missing required fields: id or name");
    }

    const result = await editSticker({id, name});
    res.status(200).send(result);

  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.lofe(err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err });
});

const init = async () => {
  const port = process.env.PORT || 3001;
  await client.connect();
  console.log("connected to database");

  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
