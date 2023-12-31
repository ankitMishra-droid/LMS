import {db} from "@/lib/db";

const ChapterIdPage = async ({
    params
}: {
    params: { courseId: string; chapterId: string}}
) => {
    return(
        <div>
            ChapterId Page
        </div>
    )
}

export default ChapterIdPage