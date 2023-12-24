import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST (
    req: Request,
    {params} : { params: {courseId: string}}
){
    try {
        const { userId } = auth()
        const { url } = await req.json()

        if(!userId){
            return new NextResponse("UNAUTHORIZED USR", {status: 401})
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            }
        })

        if(!courseOwner){
            return new NextResponse("UNAUTHORISED OWNER", {status: 
            401});
        }

        const attachments = await db.attachments.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId: params.courseId
            }
        });

        return NextResponse.json(attachments);
    } catch (error) {
        console.log("COURSE_ID_Attachments", 500)
        return new NextResponse("Internal Error", {status: 500})
    }
}