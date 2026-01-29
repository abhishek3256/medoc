const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

router.post('/', tokenController.generateToken);
router.get('/:doctorId', tokenController.getDoctorTokens);
router.put('/:id/cancel', tokenController.cancelToken);
router.put('/:id/status', tokenController.updateTokenStatus);

// Since simple routes, we can put slot check here or in separate file. 
// User asked for GET /api/slots/:doctorId in requirements.
// I will just add it here for simplicity or creates separate slotRoutes?
// User said "Build Express API routes in routes folder: ... GET /api/slots/:doctorId"
// I will treat slots as related to tokens/doctors. I'll add it to this file for now or create a slotRoutes if strictly needed.
// Actually, I'll allow `GET /slots/:doctorId` to be defined here if I mount it correctly in server.js or just add to `tokenRoutes` but `server.js` mounts `/api/tokens`.
// Wait, `server.js` has `app.use('/api/tokens', tokenRoutes);`. So `GET /api/tokens/slots/:id`?
// No, user requested `GET /api/slots/:doctorId`. 
// I should probably add `app.use('/api/slots', slotRoutes)` in server.js or handle it.
// I'll check server.js again. I didn't add slotRoutes there. 
// I will add a new router for slots or just modifying the server.js to use tokenRoutes for slots? No that's messy.
// I'll create `slotRoutes.js` and update `server.js`.
// Or just put it in `doctorRoutes` as `/doctors/:id/slots`?
// User specifically asked for `GET /api/slots/:doctorId`.
// I will Create `backend/routes/slotRoutes.js` and Update `server.js`.

module.exports = router;
