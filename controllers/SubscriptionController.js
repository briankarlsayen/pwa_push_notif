
const Subscription = require("../models/Subscription");

exports.createSubscription = async(req, res) => {
  const { subscriptionKey, accountType } = req.body;

  if(!subscriptionKey) return res.status(422).json({message: 'Subscription key is required.'})

  const subs = new Subscription({
    subscriptionKey, accountType
  });

  if(!subs) {
    return res.status(422).json({ message: error });
  } else {
    subs
    .save()
    .then(async(result) => {
      res.status(200).json({result})
    })
    .catch(err => {
      console.log(err)
    })
  }
};

exports.displayAllSubscriptions = async(req, res) => {
  try {
    Subscription.find()
    .then(result => res.status(200).json({result}))
    .catch(error => console.log(error))
  } catch(err) {
    console.log(err)
    res.status(500).json({err})
  }
}

exports.viewActiveSubscriptions = async(req, res) => {
  try {
    Subscription.find({isDeleted: false})
    .then(result => res.status(200).json({result}))
    .catch(error => console.log(error))
  } catch(err) {
    console.log(err)
    res.status(500).json({err})
  }
}

exports.archiveSubscription = async(req, res) => {
  try{
    const {id} = req.params
    if(!id) return res.status(422).json({message: "Unable to delete the subscription"})
    Subscription.updateOne(
      { _id: id },
      {
        $set: {
         isDeleted: true
        }
      }
    )
    .then(result => {
      if(result.modifiedCount === 1) return res.status(200).json({message: "Successfully deleted the subscription"})
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