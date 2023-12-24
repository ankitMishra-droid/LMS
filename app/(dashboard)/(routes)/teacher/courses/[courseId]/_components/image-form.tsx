"use client";

import * as z from "zod";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "../../../../../_components/file-upload";

interface ImageFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required"
    })
})


export const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps) => {

    const router = useRouter()

    const [isEditting, setIsEditting] = useState(false)
    const toggleEdit = () => setIsEditting((current) => !current)

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            console.log("under onSubmit in ImageForm.tsx")
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course Updated")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("somthing went wrong")
        }
    }
    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course image
            <Button variant="ghost" onClick={toggleEdit}>
            {
            isEditting &&
             (<>Canel</>)
            }
            { !isEditting && !initialData.imageUrl &&
            (
                <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add an image
                </>
            )}
            { !isEditting && initialData.imageUrl &&
            (
                <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit image
                </>
            )}
            </Button>
            </div>

            {!isEditting && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 rounded-md bg-slate-200">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image 
                            alt="upload"
                            fill
                            className="rounded-md object-cover"
                            src={initialData.imageUrl}
                        />
                    </div>
                )
            )}

            {
                isEditting && 
                <div>
                    <FileUpload 
                        endpoint="courseImage"
                        onChange={(url) => {
                            onSubmit({ imageUrl: url || ""})
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recomended
                    </div>
                </div>
            }
        </div>
    )
}
