const express = require('express');
const router = express.Router();

const errorMessages = {
  '404': 'Page not found',
  '500': 'Internal server error',
  '403': 'Forbidden',
  '401': 'Unauthorized',
  '400': 'Bad request',
  '502': 'Bad gateway',
  '503': 'Service unavailable'
};

router.get('/:status', (req, res) => {
  const status = req.params.status;
  const message = errorMessages[status] || 'An error occurred';
  res.status(status).render('error', { status, message });
});

module.exports = router;
