import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Registra usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "segredo123"
 *     responses:
 *       201:
 *         description: Dados do usuário criado
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    example: 1
 *                  email:
 *                   type: string
 *                   example: user@example.com
 *                  createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-01-01T00:00:00Z'
 *                  updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-01-01T00:00:00Z'
 */
router.post('/', async (_req, res) => {
  res.status(200).json({});
});

export default router;
