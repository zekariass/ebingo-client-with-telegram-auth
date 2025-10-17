// import { NextRequest, NextResponse } from "next/server";
// import { signupSchema, SignupFormData } from "@/lib/validation/signup-validation";
// import { createClient } from "@/lib/supabase/server";
// import { supabaseAdmin } from "@/lib/supabase/admin-client";


// const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!;

// export async function POST(req: NextRequest) {
//   let supabaseId = null;
//   const supabase = await createClient();

//   const deleteUser = async (supabaseId: string)=> {
//     return await supabaseAdmin.auth.admin.deleteUser(supabaseId)
//   };
//   try {
//     const json: unknown = await req.json();


//     const validated: SignupFormData = signupSchema.parse(json);


//     const { email, password, phone, firstName, lastName, nickName, dateOfBirth } = validated;

//     // Create Supabase server client

//     // Create user via admin API
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password
//     });

//     if (error || !data.user) {
//       return NextResponse.json({ message: error?.message || "Supabase error" }, { status: 400 });
//     }

//     supabaseId = data.user.id;

//     // Save additional info to backend DB
//     const backendResponse = await fetch(`${BACKEND_BASE_URL}/api/v1/public/user-profile/create`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         supabaseId,
//         firstName,
//         lastName,
//         nickName,
//         email,
//         phone,
//         dateOfBirth: dateOfBirth.toISOString().split("T")[0]
//       }),
//     });


//     if (!backendResponse.ok) {
       
//       try{
//         // supabase.auth.admin.deleteUser(supabaseId);
//         const {data, error} = await deleteUser(supabaseId)
//         if (error){
//           console.error("Error deleting user in supabase: ", error)
//         }else{
//           console.info("User deleted: ", data)
//         }
//       }catch(err: any){
//         return NextResponse.json({message: err.message || "Server error"})
//       }

//       const text = await backendResponse.text();
//       return NextResponse.json({ message: "Something went wrong. Please contact the admin." }, { status: 500 });
//     }

//     return NextResponse.json({ message: "Signup successful", supabaseId }, { status: 200 });
//   } catch (err: any) {
//     if (supabaseId) {
//       const {data, error} = await deleteUser(supabaseId)
//         if (error){
//           console.error("Error deleting user in supabase: ", error)
//         }else{
//           console.info("User deleted: ", data)
//         }
//     }
//     return NextResponse.json({ message: err.message || "Server error" }, { status: 400 });
//   }
// }

