// File: backend/src/app/api/shared/tourists/[id]/alerts/route.ts

import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/shared/tourists/{id}/alerts:
 *   get:
 *     summary: Get all alerts for a specific tourist
 *     description: Retrieves a list of alerts associated with a given tourist ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tourist.
 *     responses:
 *       200:
 *         description: A list of alerts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   alertId:
 *                     type: string
 *                   message:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *       404:
 *         description: Tourist not found.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const touristId = params.id;

  // In a real application, you would fetch this from your database
  // const alerts = await db.alerts.find({ where: { touristId } });
  console.log(`Fetching alerts for tourist ID: ${touristId}`);

  // Placeholder data for the prototype
  const mockAlerts = [
    { alertId: 'alert-123', message: 'Entered a high-risk zone.', timestamp: new Date().toISOString() },
    { alertId: 'alert-456', message: 'Deviated from planned itinerary.', timestamp: new Date().toISOString() },
  ];

  return NextResponse.json(mockAlerts, { status: 200 });
}

/**
 * @swagger
 * /api/shared/tourists/{id}/alerts:
 *   post:
 *     summary: Create a new alert for a specific tourist
 *     description: Manually creates and logs a new alert for a given tourist.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tourist.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               severity:
 *                 type: string
 *     responses:
 *       201:
 *         description: Alert created successfully.
 *       400:
 *         description: Invalid request body.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const touristId = params.id;
  const body = await request.json();

  if (!body.message || !body.severity) {
    return NextResponse.json({ error: 'Message and severity are required' }, { status: 400 });
  }

  // In a real application, you would save this to your database
  console.log(`Creating alert for tourist ${touristId}:`, body);

  const newAlert = {
    alertId: `alert-${Math.random().toString(36).substr(2, 9)}`,
    touristId,
    ...body,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(newAlert, { status: 201 });
}