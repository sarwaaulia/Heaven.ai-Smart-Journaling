import { NextResponse } from "next/server";
import { deleteEntry } from "@/app/entries/read/actions";

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
    try {
        const {id} = await params;
        console.log(`delete id`, id)
        const deleteResult = await deleteEntry(id)

        if(deleteResult.error) {
            console.error(`failed to delete entry`, deleteResult.error)
            return NextResponse.json(
                {error: deleteResult.error},
                {status: 500}
            )
        }
        console.log(`api delte entry successfully`)
        return NextResponse.json({success: true})
    } catch (error: any) {
        console.error(error.message)
        return NextResponse.json(
            {error: `failed to delete entry cause server error`},
            {status: 500}
        )
    }
}
