// import { db } from "@/lib/db"
// import { auth } from "@clerk/nextjs"
// import { NextResponse } from "next/server"

// export async function DELETE(
//     req: Request,
//     { params }: { params: { courseId: string, attachmentId: string }}
// ){
//     try {
//         const { userId } = auth()
        
//         if(!userId){
//             return new NextResponse("Unauthorized user", { status: 401 })
//         }

//         const courseOwner = await db.course.findUnique({
//             where: {
//                 id: params.courseId,
//                 userId: userId
//             }
//         })

//         if(!courseOwner){
//             return new NextResponse("Unauthorised Owner", { status: 401 })
//         }

//         const attachment = await db.attachments.delete({
//             where: {
//                 courseId: params.courseId,
//                 id: params.attachmentId
//             }
//         })

//         return NextResponse.json(attachment)
//     } catch (error) {
//         console.log("DELETE_COURSE_ID", error)
//         return new NextResponse("Internal Server Error", { status: 500})
//     }
// }

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string, attachmentId: string }}
){
    try {
        const { userId } = auth();
        
        if (!userId) {
            return new NextResponse("User authentication failed", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!courseOwner) {
            return new NextResponse("Course ownership verification failed", { status: 401 });
        }

        const attachment = await db.attachments.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentId
            }
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.error("DELETE_ATTACHMENT_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
