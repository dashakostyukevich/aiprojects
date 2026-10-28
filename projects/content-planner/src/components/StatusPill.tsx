import type { Status } from "../types"
import { statusChip } from "../styles"

/**
 * A small rounded label showing a post's status, e.g. "Draft".
 *
 * The word is always there. The pastel behind it only makes the six stages
 * quicker to tell apart on the way down a list.
 */
export default function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1
        text-xs ${statusChip[status]}`}
    >
      {status}
    </span>
  )
}
