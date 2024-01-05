import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import isURL from "is-url";

const { Video } = new Mux(
  process.env.MUX_ACCESS_TOKEN!,
  process.env.MUX_SECRET_ID!
);

async function checkAuthentication(): Promise<string | null> {
  const { userId } = auth();
  return userId ? userId : null;
}

async function checkCourseOwnership(courseId: string, userId: string): Promise<boolean> {
  const courseOwner = await db.course.findUnique({
    where: {
      id: courseId,
      userId,
    },
  });
  return !!courseOwner;
}

async function updateChapter(params: { chapterId: string; courseId: string }, values: any): Promise<any> {
  return db.chapter.update({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    data: {
      ...values,
    },
  });
}

async function handleVideoUpdate(params: { chapterId: string }, values: any): Promise<void> {
  if (isURL(values.videoUrl)) {
    const existingMuxData = await db.muxData.findFirst({
      where: {
        chapterId: params.chapterId,
      },
    });

    if (existingMuxData) {
      await Video.Assets.del(existingMuxData.assetId);
      await db.muxData.delete({
        where: {
          id: existingMuxData.id,
        },
      });
    }

    const asset = await Video.Assets.create({
      input: values.videoUrl,
      playback_policy: "public",
      test: false,
    });

    await db.muxData.create({
      data: {
        chapterId: params.chapterId,
        assetId: asset.id,
        playbackId: asset.playback_ids?.[0]?.id,
      },
    });
  }
}

export async function PATCH(req: Request, { params }: { params: { chapterId: string; courseId: string } }) {
  try {
    const userId = await checkAuthentication();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isCourseOwner = await checkCourseOwnership(params.courseId, userId);

    if (!isCourseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { isPublished, ...values } = await req.json();
    const updatedChapter = await updateChapter(params, values);

    if (values.videoUrl) {
      await handleVideoUpdate(params, values);
    }

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("CHAPTER_ID_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
