type Props = {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: Props) {
  return (
    <div>
      <h1>Project {params.id}</h1>
      {/* Aquí puedes renderizar los detalles del proyecto */}
    </div>
  )
}