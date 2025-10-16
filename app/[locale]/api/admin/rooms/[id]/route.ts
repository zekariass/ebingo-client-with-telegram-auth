import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
// import { getServerSession } from "next-auth"

// import { authOptions } from "@/lib/auth"

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL

export async function PUT(
  request: NextRequest, 
  context: { params: { id: string } }) {
  try {

    const {id} = await context.params

    const supabase = await createClient();
    // const session = await getServerSession(authOptions)
    const {data: {session}, error} = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json()

    // const room = await prisma.room.update({
    //   where: { id: params.id },
    //   data: updates,
    // })

    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/secured/rooms/${id}`, {
          method: "PUT",
          body: JSON.stringify({id: id, ...updates}),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });
    
      const result = await response.json();

  
      if (!response.ok) {
      console.log("==========================================>>>>: ", result)

        return NextResponse.json({ error: result?.error || "Backend error" }, { status: response.status });
      }
  
      return NextResponse.json({ success: true, data: result.data });
    } catch (err) {
      console.error("Admin rooms error:", err);
      return NextResponse.json({ error: err}, { status: 500 });
    }
}



export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } } 
) {
  try {
    const { id } = await context.params;

    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (!session || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/secured/rooms/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return NextResponse.json(
        { error: result?.error || "Backend error. Room not deleted" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete room error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

