import {getGlossary, setGlossary} from "./data/glossary.js";
import {glossaryFilename, mindMapFilename, port} from "./data/constant.js";
import {downloadFile} from "./utils/download-file.js";
import {downloadFileCallback} from "./utils/download-file-callback.js";
import {loadData} from "./utils/load-data.js";
import {loadFileCallback} from "./utils/load-file-callback.js";

import express from "express";
import {getMindMap, setMindMap} from "./data/mindmap.js";

const app = express();

app.use(express.json());

app.get("/mind-map", (request, response) => {
  response.writeHead(200);
  response.end(JSON.stringify(getMindMap()));
});

app.get("/glossary", (request, response) => {
  const term = request.query.term;

  if (!term) {
    response.writeHead(200);
    response.end(JSON.stringify(getGlossary()));

    return;
  }

  if (getGlossary()[term]) {
    response.writeHead(200);
    response.end(getGlossary()[term]);
  } else {
    response.writeHead(404);
    response.end();
  }
});

app.put("/glossary", (request, response) => {
  const glossaryUrl = request.body.glossaryUrl;

  downloadFile(glossaryUrl, glossaryFilename, downloadFileCallback(glossaryFilename, setGlossary));

  response.writeHead(200);
  response.end();
});

app.put("/mind-map", (request, response) => {
  const mindMapUrl = request.body.mindMapUrl;

  downloadFile(mindMapUrl, mindMapFilename, downloadFileCallback(mindMapFilename, setMindMap));

  response.writeHead(200);
  response.end();
});


app.listen(port, () => {
  loadData("./data/default/glossary.json", loadFileCallback, setGlossary);
  loadData("./data/default/mindmap.json", loadFileCallback, setMindMap);
});
