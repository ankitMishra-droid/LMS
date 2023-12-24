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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
    initialData: Course;
    courseId: string;
    options: { label: string, value: string }[]
}

const formSchema = z.object({
    categoryId: z.string().min(1)
})

export const CategoryForm = ({
    initialData,
    courseId,
    options
}: CategoryFormProps) => {

    const router = useRouter()

    const [isEditting, setIsEditting] = useState(false)
    const toggleEdit = () => setIsEditting((current) => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            categoryId: initialData?.categoryId || ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course category Updated")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("somthing went wrong")
        }
    }

    const selectedOptions = options.find((option) => option.value === initialData.categoryId);
    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course category
            <Button variant="ghost" onClick={toggleEdit}>
            {isEditting ? (<>Canel</>):(
                <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit category
                </>
            )}
            </Button>
            </div>

            {!isEditting && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.categoryId && "text-slate-500 italic"
                )}>
                {selectedOptions?.label || "No category"}
                </p>
            )}

            {
                isEditting && 
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
                            <FormField 
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                          options={...options}
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
