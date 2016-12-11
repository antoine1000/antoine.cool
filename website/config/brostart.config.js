const projectListSync = require('../scripts/plugins/projectListSync')
const path = require('path')
const paths = require('./paths.config.js')
const projectOrder = require('./projects.config.js')

let projectList

const broStartConfig = {
  devServer: {
    historyAPIFallback: true,
    port: 8080,
    tunnel: false,
    xip: false,
    offline: false
  },
  templating: {
    yamlSafeLoad: false,
    autoPartials: true
  },
  lifecycle: {
    onHandlebarsInit (handlebars) {
      // load the project list
      projectList = projectListSync(
        path.join(paths.content, 'projets'),
        projectOrder,
        ['projet', 'date'])

      // add your own custom helpers, partials, decorators here
      handlebars.registerHelper('nl2br', (text) => {
        const reg = /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g
        const nl2brStr = (text + '').replace(reg, '$1' + '<br>' + '$2')
        return new handlebars.SafeString(nl2brStr)
      })
    },
    beforeHandlebarsRender (data) {
      // you can mutate data if you need to add/remove content before rendering
      if (data.layout === 'index.hbs') data.project = projectList.projects
      if (data.layout === 'projet.hbs') {
        data.nextProject = projectList.previousProjectFrom(data.projet)
        data.previousProject = projectList.nextProjectFrom(data.projet)
      }
    }
  }
}

module.exports = broStartConfig
