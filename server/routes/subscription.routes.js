const express = require("express");
const subscription = require("../controllers/SubscriptionController");
const router = express.Router();

router.get("/displayallsubscription", subscription.displayAllSubscriptions);
router.post("/viewactivesubscription", subscription.viewActiveSubscriptions);
router.post("/createsubscription", subscription.createSubscription);
router.put("/archivesubscription/:id", subscription.archiveSubscription);

module.exports = router;
