import { STATUSES } from "../types"
import type { ContentType, Platform, Status } from "../types"

/*
  The search box and the three dropdowns.

  This component holds no state of its own. It takes the current filters and
  reports changes through `onChange`, the same way Header reports a click. That
  keeps one copy of the filters, held by PostList.
*/

/** One dropdown whose first option is "All". */
function FilterSelect<T extends string>({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string
  value: T | "all"
  options: readonly T[]
  allLabel: string
  onChange: (value: T | "all") => void
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-xs font-medium text-ink-faint">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T | "all")}
        className="rounded-lg border border-line bg-card px-3 py-2 text-sm
          text-ink outline-none focus:border-ink-faint"
      >
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

const platforms: Platform[] = ["Instagram", "Threads", "TikTok", "Blog"]
const contentTypes: ContentType[] = [
  "Reel",
  "Carousel",
  "Story",
  "Text",
  "Blog post",
]

export default function FilterBar({
  search,
  platform,
  status,
  type,
  hasActiveFilters,
  onSearch,
  onPlatform,
  onStatus,
  onType,
  onClear,
}: {
  search: string
  platform: Platform | "all"
  status: Status | "all"
  type: ContentType | "all"
  /** True when anything other than "all" has been chosen. */
  hasActiveFilters: boolean
  onSearch: (value: string) => void
  onPlatform: (value: Platform | "all") => void
  onStatus: (value: Status | "all") => void
  onType: (value: ContentType | "all") => void
  onClear: () => void
}) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-medium text-ink-faint">Search</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search titles…"
            className="rounded-lg border border-line bg-card px-3 py-2 text-sm
              outline-none placeholder:text-ink-faint focus:border-ink-faint"
          />
        </label>

        {/* Only shown once something is actually filtered, so the toolbar
            stays quiet until it has something to do. */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded-full border border-line px-4 py-2
              text-sm text-ink-soft transition-colors hover:bg-ink/5
              hover:text-ink"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <FilterSelect
          label="Platform"
          value={platform}
          options={platforms}
          allLabel="All platforms"
          onChange={onPlatform}
        />
        <FilterSelect
          label="Status"
          value={status}
          options={STATUSES}
          allLabel="All statuses"
          onChange={onStatus}
        />
        <FilterSelect
          label="Content type"
          value={type}
          options={contentTypes}
          allLabel="All types"
          onChange={onType}
        />
      </div>
    </div>
  )
}
