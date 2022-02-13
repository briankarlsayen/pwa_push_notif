const express = require("express");
const notification = require("../controllers/NotificationController");
const router = express.Router();

router.get("/displayallnotification", notification.displayAllNotifications);
router.get("/viewnotification/:id", notification.viewNotificationById);
router.post("/sendnotification", notification.sendNotification);
router.put("/archivenotification/:id", notification.archiveNotification);

module.exports = router;
