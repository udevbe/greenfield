export type ClientProps = { id: string; unresponsive: boolean; onClose: () => void; origin: string }
export function Client(props: ClientProps) {
  return (
    <div class="client">
      {props.id}
      <br />
      🌐 {props.origin}
      {props.unresponsive ? <p>Not responding</p> : null}
      <button onClick={props.onClose}>🗑️</button>
    </div>
  )
}
