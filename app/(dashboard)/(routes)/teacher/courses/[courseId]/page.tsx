import { DescriptionForm } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/description-form";
import { ImageForm } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/image-form";
import { TitleForm } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/title-form";

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs";
import { DollarSign, File, LayoutDashboardIcon, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { CategoryForm } from "./_components/category-form";
import { IconBadge } from "@/components/icon-badge";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChapterForm } from "./_components/chapter-form";

const CourseIdPage = async({ params } : { params:{courseId: string} }) => {
    const { userId } = auth()
    if (!userId){
        return redirect("/")
    }
    
    const course = await db.course.findUnique({
        where:{
            id: params.courseId,
            userId
        }
        ,
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                }
            },
            attachments: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    });

    const categories = await db.category.findMany({
            orderBy: {
                name: "asc",
            },
    })

    if(!course){
        return redirect("/")
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished)
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    
    const completionText = `${completedFields}/${totalFields}`

    return(
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Course Setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        Completed fileds are ({completionText})
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboardIcon}/>
                        <h2 className="text-xl">
                            Customize Your Course
                        </h2>
                    </div>
                    <TitleForm
                    initialData={course}
                    courseId={course.id}
                    />
                    <DescriptionForm
                    initialData={course}
                    courseId={course.id}
                    />
                    <ImageForm
                    initialData={course}
                    courseId={course.id}
                    />
                    <CategoryForm
                    initialData={course}
                    courseId={course.id}
                    options={categories.map((category) => ({
                        label: category.name,
                        value: category.id
                    }))}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListChecks} />
                            <h2 className="text-xl">
                                Course Chapter
                            </h2>
                        </div>
                        <ChapterForm
                        initialData={course}
                        courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={DollarSign}/>
                            <h2 className="text-xl">
                                Sell Your Course
                            </h2>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <PriceForm 
                              initialData={course}
                              courseId={course.id}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={File}/>
                            <h2 className="text-xl">
                                Resources & Attachments
                            </h2>
                        </div>
                        <AttachmentForm
                        initialData={course}
                        courseId={course.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseIdPage