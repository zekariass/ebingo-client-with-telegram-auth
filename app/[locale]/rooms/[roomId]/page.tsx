import { RoomView } from "@/components/room/room-view"
import { WinnerOverlay } from "@/components/room/winner/winner-overlay";

interface RoomPageProps {
  params: { roomId: string; locale: string }
}

export default async function RoomPage({ params }: RoomPageProps) {
  const resolvedParams = await params
  const roomId = Number(resolvedParams.roomId)
  return <>
      <RoomView roomId={roomId} />
      <WinnerOverlay />
  </>
}
