const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const app = express()
const fetch = require('node-fetch')
const base64 = require('base-64')

app.get('/', (req, res) => res.send('online'))
app.post('/', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  let username = "";
  let password = "";
  let token = "";

  function welcome () {
    agent.add('Webhook works!')
  }

  async function login (username, password) {
    let request = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
      redirect: 'follow'
    }

    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/login',request)
    const serverResponse = await serverReturn.json()
    const token = await serverResponse.token

    return token;
  }


  let intentMap = new Map()
  intentMap.set('Default Welcome Intent', welcome)
  intentMap.set('Choose Category', navigate)
  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT || 8080)
