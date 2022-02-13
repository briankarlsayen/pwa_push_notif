const mongoose = require('mongoose')
const Notification = require("../models/Notification");
const Subscription = require("../models/Subscription");
const webpush = require('web-push');
require("dotenv").config();

const displayAllSubscription = () => {
  return Subscription.aggregate([
    {
      $match: {
        isDeleted: false
      }
    },
    {
      $project: {
        subscriptionKey: 1
      }
    }
  ])
}

//continue this
const deleteSubscription = async(id) => {
  return await Subscription.updateOne(
    { _id: id },
    {
      $set: {
       isDeleted: true
      }
    }
  )
}

exports.sendNotification = async(req, res) => {
  const { title, body, sentBy } = req.body;

  if(!title || 
    !body ||
    !sentBy) return res.status(422).json({message: 'Unable to send notification'})

    console.log(process.env.PUBLICKEY)
  const options = {
    vapidDetails: {
      subject: 'mailto:sample@gmail.com',
      publicKey: process.env.PUBLICKEY,
      privateKey:  process.env.PRIVATEKEY,
    },
    timeout: 10000,
  }

  const subscriptions = await displayAllSubscription()
  const data = {
    title,
    body
  };
  const dataBuffer = Buffer.from(JSON.stringify(data));

  try {
    const idsNotSent = [];
    const idsSent = [];
    if(subscriptions) {
      let promiseChain = Promise.resolve();
      for (let i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];
        promiseChain = promiseChain.then(() => {
          return triggerPushMsg(subscription);
        });
      }
      promiseChain.then(()=>{
        const notif = new Notification({
          title, 
          body, 
          receivedBy: idsSent, 
          sentBy 
        });
    
        if(!notif) {
          return res.status(422).json({ message: error });
        } else {
          notif
          .save()
          .then(async(result) => {
            res.status(200).json({result})
          })
          .catch(err => {
            console.log(err)
          })
        }
      })
    }

    const triggerPushMsg = async function(subscription) {
      return (
        webpush.sendNotification(
          subscription.subscriptionKey,
          dataBuffer,
          options
        )
        .then((result) => {
          let newSubscriptionId = subscription._id.toString()
          idsSent.push(newSubscriptionId)
          console.log(`Sent successfully to id: ${subscription._id}`)
        })
        .catch((err) => {
          if (err.statusCode === 404 || err.statusCode === 410) {
            idsNotSent.push(subscription._id)
            console.log('Subscription has expired or is no longer valid: ', err);
            //archive subs
            return deleteSubscription(subscription._id);
          } else {
            idsNotSent.push(subscription._id)
            console.log(`Unable to send notification to id: ${subscription._id}`)
            return deleteSubscription(subscription._id);
          }
        })
      )
    };
    
    } catch(error) {
      console.log(error.message)
    }
};

exports.displayAllNotifications = async(req, res) => {
  try {
    const notif = await Notification.find()
    res.status(200).json({result: notif})
  } catch(err) {
    console.log(err)
    res.status(500).json({err})
  }
}

exports.viewNotificationById = async(req, res) => {
  try {
    const {id} = req.params
    const notif = await Notification.findById(id)
    res.status(200).json({notif})
  } catch(err) {
    console.log(err)
    res.status(500).json({err})
  }
}

exports.archiveNotification = async(req, res) => {
  try{
    const {id} = req.params
    if(!id) return res.status(422).json({message: "Unable to delete the notification"})
    Notification.updateOne(
      { _id: id },
      {
        $set: {
         isDeleted: true
        }
      }
    )
    .then(result => {
      if(result.modifiedCount === 1) return res.status(200).json({message: "Successfully deleted the notification"})
      throw new Error();
    })
    .catch(err=> {
      return res.status(500).json({message: "Unable to archive user"})
    })
  } catch(err) {
    console.log(err)
    res.status(500).json({err})
  }
}