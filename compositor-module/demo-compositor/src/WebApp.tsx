export type WebAppProps = { url: URL; onClose: () => void }
export function WebApp(props: WebAppProps) {
  return (
    <div>
      {props.url.href}
      <button onClick={props.onClose}>🗑️</button>
    </div>
  )
}
