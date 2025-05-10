import { auth } from "@clerk/nextjs/server";
import { db } from "../../../../lib/db";
import { files } from "../../../../lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request:NextRequest) =>{
    try {
        const {userId} = await auth();
        if (!userId) {
            return NextResponse.json({error:"Unauthorized "},{status:401})
        }
        //parse request body
        const body = await request.json();
        const {ImageKit,userId:bodyUserId} = body;

        if (bodyUserId !== userId) {
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }
        if (!ImageKit || !ImageKit.url) {
            return NextResponse.json({error:"Invalid file upload data"},{status:401})
        }

        const fileData = {
            name:ImageKit.name || "untitled",
            path:ImageKit.filePath || `/droply/${userId}/${ImageKit.name}`,
            size:ImageKit.size || 0,
            type:ImageKit.fileType || "image",
            fileUrl:ImageKit.thumbnailUrl || null,
            userId,
            parentId:null,
            isFolder:false,
            isStarred:false,
            isTrash:false
        }

      const [newFile] =  await db.insert(files).values(fileData).returning()

      return NextResponse.json(newFile)

    } catch (error:any) {
        return Response.json({error:"Failed to save info to database"},{status:500})
    }
}