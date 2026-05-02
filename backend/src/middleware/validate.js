const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      errors: err.errors.map(e => ({ path: e.path, message: e.message })) 
    });
  }
};

// Common Schemas
const schemas = {
  grievance: z.object({
    body: z.object({
      category: z.enum(['Physical abuse', 'Medical neglect', 'Visitation denied', 'Food deprivation', 'Other']),
      description: z.string().min(10).max(1000)
    })
  }),
  legalRequest: z.object({
    body: z.object({
      caseType: z.string(),
      location: z.string(),
      message: z.string().optional()
    })
  }),
  earningRecord: z.object({
    body: z.object({
      prisonerId: z.string(),
      taskId: z.string(),
      amount: z.number().positive()
    })
  })
};

module.exports = { validate, schemas };
