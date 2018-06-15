const express = require('express')
const axios = require('axios')

const githubRepoUrl = (owner, repo) =>
  `https://api.github.com/repos/${owner}/${repo}`

const vue = githubRepoUrl('vuejs', 'vue')
const react = githubRepoUrl('facebook', 'react')

const app = express()

app.get('/', (req, res, next) =>
  Promise.all([
    axios.get(vue),
    axios.get(react)
  ])
    .then(([ vue, react ]) =>
      vue.data.stargazers_count > react.data.stargazers_count
        ? `VueJS is ahead by ${vue.data.stargazers_count - react.data.stargazers_count}!`
        : `React is ahead by ${react.data.stargazers_count > vue.data.stargazers_count}!`
    )
    .then(data => res.json(data))
    .catch(next)
)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Ready at ${port}`))
