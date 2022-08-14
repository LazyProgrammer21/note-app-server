const express = require("express");
const cors = require("cors");

const App = express();
App.use(express.static("build"));
App.use(cors());
App.use(express.json());

////Middle Ware Format/SYntax

// App.use((request, response, next) => {});
//hamle middleware banayerw yetikai xodyo vane yo app post garnu mildaina app.use line 11 execute le kei ny gardaina. yo app yei adkinxa.
//evertime we request like get post line 14 will be executed.
App.use((request, response, next) => {
  // console.log("this is middleware");
  // next(); //ya next garena vane yo app yei freexe hunxa....so to avoid we use next, yedi aru middleware xa vane tyo execute garr navaye request k aaxa like post/get tesma ja vaneko ho
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  response.somethis = "Hello World!!";
  next();
});
// App.use(express.json());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-1-17T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    date: "2022-1-17T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-1-17T19:20:14.298Z",
    important: true,
  },
];

App.get("/", (request, response) => {
  // response.send("<h1>hello world there</h1>");

  response.send(response.somethis);
});

App.get("/notes", (request, response) => {
  response.json(notes);
});

App.get("/notes/:id", (request, response) => {
  const currentId = Number(request.params.id);
  const thisNote = notes.find((note) => note.id === currentId);
  if (thisNote) response.json(thisNote);
  else
    response
      .status(404)
      .json({ error: 404, message: `there is no note with id ${currentId}` });
});

App.delete("/notes/:id", (request, response) => {
  const currentId = Number(request.params.id);
  notes = notes.filter((note) => note.id !== currentId);

  response.status(204).end();
});

const generatedId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

App.post("/notes/", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generatedId(),
  };
  notes = notes.concat(note);
  response.json(note);
});

///this code handles the error of the request url is invalid. After executing all the middle ware and request url
App.use((request, response, next) => {
  response.status(404).send("<h1>No routes found for this request</h1>");
});
const PORT = process.env.PORT || "3001";
App.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
//part3aCompleted
