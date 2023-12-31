"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course, Chapter } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { ChapterList } from "./chapter-list";

interface ChapterFormProps {
    initialData: Course & {chapters: Chapter[]};
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(3)
})


export const ChapterForm = ({
    initialData,
    courseId
}: ChapterFormProps) => {

    const router = useRouter()


    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const toggleCreating = () =>{
     setIsCreating((current) => !current)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            title: ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values)
            toast.success("Chapter Updated")
            toggleCreating()
            router.refresh()
        } catch {
            toast.error("somthing went wrong")
        }
    }

    const onReorder = async (updateData: { id: string, position: number }[] ) =>{
        try {
            setIsUpdating(true)

            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            })
            toast.success("Chapters reordered")
            router.refresh()
        } catch {
            toast.error("something went wrong")
        }
        finally{
            setIsUpdating(false)
        }
    }

    const onEdit = (id: string) => {
        router.push(`teacher/courses/${courseId}/chapters/${id}`)
    }
    return(
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {
                isUpdating && (
                    <div className="absolute flex items-center h-full w-full bg-slate-500/20 justify-center top-0 right-0 rounded-m">
                    <div className="animate-spin h-6 w-6 text-sky-700">
                        <Loader2 />
                    </div>
                    </div>
                )
            }
            <div className="font-medium flex items-center justify-between">
                Course Chapter
            <Button variant="ghost" onClick={toggleCreating}>
            {isCreating ? (<>Canel</>):(
                <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add a Chapter
                </>
            )}
            </Button>
            </div>

            {
                isCreating && 
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
                            <FormField 
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                        disabled={isSubmitting}
                                        placeholder="e.g. 'Introduction of the course...'"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            {/* <div className="flex items-center gap-x-2"> */}
                                <Button type="submit" disabled={!isValid || isSubmitting}>
                                    Create
                                </Button>
                            {/* </div> */}
                        </form>
                    </Form>
                </>
            }
            {
                !isCreating && (
                    <div className={cn(
                        !initialData.chapters.length && "text-slate-500 italic"
                    )}>
                        {!initialData.chapters.length && "No Chapters"}
                        <ChapterList 
                            onEdit={onEdit}
                            onReorder={onReorder}
                            items={initialData.chapters || []}
                        />
                    </div>
                )
            }
            {
                !isCreating && (
                    <p className="text-xs text-muted-foreground mt-4">
                        Drag and drop to reorder the chapters
                    </p>
                )
            }
        </div>
    )
}
