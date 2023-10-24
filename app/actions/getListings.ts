
import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    const query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount !== undefined) {
      query.roomCount = {
        gte: roomCount
      }
    }

    if (guestCount !== undefined) {
      query.guestCount = {
        gte: guestCount
      }
    }

    if (bathroomCount !== undefined) {
      query.bathroomCount = {
        gte: bathroomCount
      }
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      query.reservations = {
        none: {
          OR: [
            {
              endDate: { gte: startDate },
              startDate: { lte: startDate }
            },
            {
              startDate: { lte: endDate },
              endDate: { gte: endDate }
            }
          ]
        }
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error) {
    console.log(error);
  }
}
