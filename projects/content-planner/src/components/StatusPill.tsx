import type { Status } from "../types"
import { statusStyles } from "../styles"

/** A small rounded label showing a post's status, e.g. "Draft". */
export default function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1
        text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}
