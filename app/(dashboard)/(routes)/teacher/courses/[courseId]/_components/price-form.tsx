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
import { Input } from "@/components/ui/input";
import { priceFormat } from "@/lib/format";

interface PriceFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    price: z.coerce.number()
})


export const PriceForm = ({
    initialData,
    courseId
}: PriceFormProps) => {

    const router = useRouter()

    const [isEditting, setIsEditting] = useState(false)
    const toggleEdit = () => setIsEditting((current) => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            price: initialData?.price || undefined
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course price Updated")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("somthing went wrong")
        }
    }
    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Price
            <Button variant="ghost" onClick={toggleEdit}>
            {isEditting ? (<>Canel</>):(
                <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Price
                </>
            )}
            </Button>
            </div>

            {!isEditting && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.price && "text-slate-500 italic"
                )}>
                {initialData.price ? priceFormat(initialData.price) : "No price"}
                </p>
            )}

            {
                isEditting && 
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
                            <FormField 
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                        type="number"
                                        step="500"
                                        disabled={isSubmitting}
                                        placeholder="Set a price for your course"
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
