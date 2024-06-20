import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { ObjectId } from "mongodb";
export async function getSearch(term?: string) {
  let userId;
  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }
  let streams = [];
  if (userId) {
    streams = await db.stream.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: term, mode: "insensitive" } },
              { user: { username: { contains: term, mode: "insensitive" } } },
            ],
          },
          {
            user: {
              blocking: {
                none: {
                  blockedId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        user: true,
        id: true,
        name: true,
        isLive: true,
        thumbnailUrl: true,
        updatedAt: true,
      },
      orderBy: [{ isLive: "desc" }, { updatedAt: "desc" }],
    });
  } else {
    streams = await db.stream.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { user: { username: { contains: term, mode: "insensitive" } } },
        ],
      },
      select: {
        user: true,
        id: true,
        name: true,
        isLive: true,
        thumbnailUrl: true,
        updatedAt: true,
      },
      orderBy: [{ isLive: "desc" }, { updatedAt: "desc" }],
    });
  }
  return streams;
}
