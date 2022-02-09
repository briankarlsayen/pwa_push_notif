const express = require('express')
const cors = require('cors')
const app = express()
const router = express.Router()
const webpush = require('web-push');
const vapidKeys = {
  publicKey: 'BMsFhyOx-CYwyDhQcQTw-vuWr3uco4SzQFc_0SbxC-8Gvs61cGKeKXbKOigSC8-vRnPdu0pMVtb08Wfs9EftrmM',
  privateKey: 'i5Jgws6Z8oV1_qhSxgC0fqiUkiLAQ0AELLhYFyJvK_4'
}
const PORT = 5006

app.use(cors())
app.use(express.json())

const pushSubscription = {"endpoint":"https://wns2-par02p.notify.windows.com/w/?token=BQYAAADvIemDtsPQav8V9tay8NZWtFIFW9pJeuhQoZK0hTkAFVOcGEumiKsISpq6O%2bb3nsk3Q3hJ1c1u3HDI%2fsZrwmCmezYzv0qze6smxNnmbaXRTf3DpOg7Dv3YOJbI97mGS8Xq5vrBJ33JpvZuV83hOrceZuSKriVewpY09sUKVoTQbOsjgWNMu1nzsAe2IAK852qSJsVSlG26FEKBtFwHNW1HjM7o%2boQb3u%2bVxzT8H0IW%2fsfkivrStS6yX8kvIeq2aHDrj%2bxMTBceoIiMt2og1vPMyG%2bD1%2fJjvhz5uH5QpJ4bxC%2b%2fPHspPO%2fLJLCF8DDTHvU%3d","expirationTime":null,"keys":{"p256dh":"BIdxxQIwk5ZNmWKq-IfUCR_H94KWnVlrJ0F3eb6jVlDepw0RAmwVjb_NRAvFEjh1Tc8VNP3CS2V2oDSPRcBmOVo","auth":"S62RsyQou6M1HEh66lo6Gw"}}

const payload = 'henlo';

const dataToSend = {
  notification: {
    title: "notif",
    body: "tyhe boduy",
    icon:""
  }
}

const options = {
  // gcmAPIKey: '< GCM API Key >',
  vapidDetails: {
    subject: 'mailto:sample@gmail.com',
    publicKey: vapidKeys.publicKey,
    privateKey:  vapidKeys.privateKey,
  },
  timeout: 10000,
  // proxy: 'http://127.0.0.1:5500/push-notifications/app/'
}

app.post('/notif', async function (req, res) {
  try {
    const data = req.body;
    if( !data.title || !data.body ) return res.status(422).json({message: "Fill up all details"})
    const dataBuffer = Buffer.from(JSON.stringify(data));
    webpush.sendNotification(
      pushSubscription,
      dataBuffer,
      options
    )
    .catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log('Subscription has expired or is no longer valid: ', err);
        return deleteSubscriptionFromDatabase(subscription._id);
      } else {
        console.log(err)
        throw err;
      }
    });
    
    res.send('POST request to the homepage')
  } catch(err) {
    console.log(err)
  }
})

//save subscription key
app.post('/subscription', (req, res) => {
  try {
    const data = req.body.data
    res.status(201).json({result: data})
  } catch(err) {
    res.status(500).json({message: err})
  }
})

app.listen(PORT, () => console.log(`listening to port ${PORT}`))