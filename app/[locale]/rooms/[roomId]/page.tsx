import { RoomView } from "@/components/room/room-view"

interface RoomPageProps {
  params: Promise<{ roomId: number }>
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params

  return <RoomView roomId={roomId} />
}
