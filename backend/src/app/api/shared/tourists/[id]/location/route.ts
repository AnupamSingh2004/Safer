// File: backend/src/app/api/shared/tourists/[id]/location/route.ts

import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/shared/tourists/{id}/location:
 *   get:
 *     summary: Get current location of a specific tourist
 *     description: Retrieves the current location data for a given tourist ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tourist.
 *     responses:
 *       200:
 *         description: Current location data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 touristId:
 *                   type: string
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *                 timestamp:
 *                   type: string
 *                 accuracy:
 *                   type: number
 *       404:
 *         description: Tourist not found.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const touristId = params.id;

  // In a real application, you would fetch this from your database
  // const location = await db.locations.findFirst({ where: { touristId }, orderBy: { timestamp: 'desc' } });
  console.log(`Fetching location for tourist ID: ${touristId}`);

  // Placeholder data for the prototype
  const mockLocation = {
    touristId,
    latitude: 28.6139,
    longitude: 77.2090,
    timestamp: new Date().toISOString(),
    accuracy: 10
  };

  return NextResponse.json(mockLocation, { status: 200 });
}

/**
 * @swagger
 * /api/shared/tourists/{id}/location:
 *   post:
 *     summary: Update location for a specific tourist
 *     description: Updates the current location for a given tourist.
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
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               accuracy:
 *                 type: number
 *     responses:
 *       200:
 *         description: Location updated successfully.
 *       400:
 *         description: Invalid request body.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const touristId = params.id;
  const body = await request.json();

  if (!body.latitude || !body.longitude) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  // In a real application, you would save this to your database
  console.log(`Updating location for tourist ${touristId}:`, body);

  const updatedLocation = {
    touristId,
    ...body,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(updatedLocation, { status: 200 });
}