"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TitleFormProps {
    initialData: {
        title: string
    },
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(3, {
        message: "title is required"
    })
})


export const TitleForm = ({
    initialData,
    courseId
}: TitleFormProps) => {

    const router = useRouter()

    const [isEditting, setIsEditting] = useState(false)
    const toggleEdit = () => setIsEditting((current) => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course Title Updated")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("somthing went wrong")
        }
    }
    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Title
            <Button variant="ghost" onClick={toggleEdit}>
            {isEditting ? (<>Canel</>):(
                <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit title
                </>
            )}
            </Button>
            </div>

            {!isEditting && (
            <p className="text-sm mt-2">
            {initialData.title}
            </p>
            )}

            {
                isEditting && 
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
                                        placeholder="e.g. 'Python DSA'"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <div className="flex items-center gap-x-2">
                                <Button type="submit" disabled={!isValid || isSubmitting}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                </>
            }
        </div>
    )
}
