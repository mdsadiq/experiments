const { faker } = require('@faker-js/faker');
const express = require('express');
const fs = require('fs');
const path = require('path')

var app = module.exports = express();

app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'html');


const readLogFiles = () => {
  // readFileSync("./logs", { encoding: 'utf8', flag: 'r' });
  const files = fs.readdirSync("./logs");
  return files.map(file => {
    filename = file.split(".log")[0]
    return {
      name: filename,
      id: filename,
      link: filename
    }
  })
}

app.get('/', (req, res) => {
  const logFiles = readLogFiles()
  res.render('index', {
    deployments: logFiles
  });
});

app.get('/start-deployment', (req, res) => {
  const logFiles = readLogFiles()
  res.render('deployment');
});

app.get('/deployment/new', (req, res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.write(`data: Connected to server\n\n`);

  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      res.write(`data: ${new Date().toISOString()} :: ${faker.lorem.lines({ min: 1, max: 1 })}\n\n`);
    }, 1000 * i)
  }
  // res.end();
});

app.get('/deployment/:deploymentId', (req, res) => {
  const { deploymentId } = req.path
  console.log(deploymentId)

  res.render('deployment', {
    deployments: [{
      name: '001-01', link: "/001-01", id: "01"
    }, { name: '001-02', link: "/001-02", id: "02" }, {
      name: '003-03', link: "/003-03", id: "03"
    }]
  });
});



app.listen(3000, () => {
  console.log("server running on http://localhost:3000")
})
