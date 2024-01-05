"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Chapter, MuxData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "../../../../../../_components/file-upload";

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null};
    courseId: string;
    chapterId: string
}

const formSchema = z.object({
    videoUrl: z.string().min(1)
})


export const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoFormProps) => {

    const router = useRouter()

    const [isEditting, setIsEditting] = useState(false)
    const toggleEdit = () => setIsEditting((current) => !current)

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            console.log("under onSubmit in ImageForm.tsx")
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chater Updated")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("somthing went wrong")
        }
    }
    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4 overflow-hidden">
            <div className="font-medium flex items-center justify-between">
                Course image
            <Button variant="ghost" onClick={toggleEdit}>
            {
            isEditting &&
             (<>Canel</>)
            }
            { !isEditting && !initialData.videoUrl &&
            (
                <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add a video
                </>
            )}
            { !isEditting && initialData.videoUrl &&
            (
                <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit video
                </>
            )}
            </Button>
            </div>

            {!isEditting && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 rounded-md bg-slate-200">
                        <Video className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer 
                          playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                )
            )}

            {
                isEditting && 
                <div>
                    <FileUpload 
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            onSubmit({ videoUrl: url || ""})
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        upload this chapter&apos;s video
                    </div>
                </div>
            }
            {
                initialData.videoUrl && !isEditting && (
                    <div className="text-xs text-muted-foreground mt-2">
                        video can take a few minutes to process. refresh the page if video does not appear
                    </div>
                )
            }
        </div>
    )
}
