const express = require("express");

const { v4: uuidv4, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body

  if (validate(id)) {
    const repository = repositories.find(repository => repository.id === id);

    if (!repository) {
      return response.status(404).json({ error: "Repository not found" });
    }

    repository.title = title;
    repository.url = url;
    repository.techs = techs;

    return response.json(repository);
  } else {
    return response.status(404).json({ error: "id no valid" });
  }

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  if (validate(id)) {
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex < 0) {
      return response.status(404).json({ error: "Repository not found" });
    }
    repositories.splice(repositoryIndex, 1);
    return response.status(204).send();
  } else {
    return response.status(404).json({ error: "id no valid" });
  }

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (validate(id)) {
    const repository = repositories.find(repository => repository.id === id);

    if (!repository) {
      return response.status(404).json({ error: "Repository not found" });
    }

    repository.likes = repository.likes + 1;

    return response.json(repository);
  } else {
    return response.status(404).json({ error: "id no valid" });
  }


});

module.exports = app;
