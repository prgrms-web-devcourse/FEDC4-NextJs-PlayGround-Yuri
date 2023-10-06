import Frame from "../../../../components/frame/frame";
import Modal from "../../../../components/modal/modal";
import swagPhotos, { Photo } from "../../../../photo";

export default function PhotoModal({
  params: { id: photoId },
}: {
  params: { id: string };
}) {
  const photos = swagPhotos;
  const photo: Photo = photos.find((p) => p.id === photoId)!;

  return (
    <Modal>
      <Frame photo={photo} />
    </Modal>
  );
}
