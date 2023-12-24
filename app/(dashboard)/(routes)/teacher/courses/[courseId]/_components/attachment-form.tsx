"use client";

import * as z from "zod";
import axios from "axios";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachments, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "../../../../../_components/file-upload";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachments[] };
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1)
})


export const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {

    const router = useRouter()

    const [isEditting, setIsEditting] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)

    const toggleEdit = () => setIsEditting((current) => !current)

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success("Course Updated")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("somthing went wrong")
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeleting(id)
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
            toast.success("Dleted SuccessFully")
            router.refresh()
        } catch (error) {
            toast.error("somthing went wrong")
        }
        finally{
            setDeleting(null)
        }
    }
    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachments
            <Button variant="ghost" onClick={toggleEdit}>
            {
            isEditting &&
             (<>Canel</>)
            }
            { !isEditting &&
            (
                <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add a file
                </>
            )}
            </Button>
            </div>

            {!isEditting && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No attachments yet
                        </p>
                    )}
                    {
                        initialData.attachments.length > 0 && (
                            <div className="space-y-2">
                                {
                                    initialData.attachments.map((attachment) => (
                                        <div key={attachment.id} className="flex items-center p-3 w-full border-sky-200 border bg-sky-100 text-sky-700 rounded-md">
                                            <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                                            <p >
                                                {
                                                   attachment.name
                                                }
                                            </p>
                                            {
                                                deleting === attachment.id && (
                                                    <div>
                                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                                    </div>
                                                )
                                            }
                                            {
                                                deleting !== attachment.id && (
                                                    <button onClick={() => onDelete(attachment.id)}>
                                                    <div>
                                                        <X className="h-4 w-4"/>
                                                    </div>
                                                    </button>
                                                )
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </>
            )}

            {
                isEditting && 
                <div>
                    <FileUpload 
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            onSubmit({ url: url || ""})
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload You Attachments
                    </div>
                </div>
            }
        </div>
    )
}
