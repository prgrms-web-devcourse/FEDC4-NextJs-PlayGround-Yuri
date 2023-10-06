export default function PhotoModal({params}) {
  const photo = photos.find((p) => p.id === params.id);

  return (
    <div>
      <div photo={photo}/>
    </div>
  )
}