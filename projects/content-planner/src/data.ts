import type { Post } from "./types"
import { addDays, todayISO } from "./dates"

/*
  Example content, written by hand. On a first run these are copied into
  localStorage; after that they're ignored and the browser's copy is used.

  The dates are generated relative to today rather than typed in, so the
  calendar always opens on a month with something in it. `-5` means five days
  ago, `+9` means nine days from now.
*/
const today = todayISO()

function day(offset: number): string {
  return addDays(today, offset)
}

export const posts: Post[] = [
  {
    id: 1,
    title: "A slow week in Lisbon: five cafés worth the detour",
    platform: "Blog",
    type: "Carousel",
    date: day(-5),
    status: "Scheduled",
    notes: "Photos are in the shared album. Needs a pull quote.",
  },
  {
    id: 2,
    title: "What I learned billing hourly as a freelance designer",
    platform: "Threads",
    type: "Text",
    date: day(-1),
    status: "Draft",
  },
  {
    id: 3,
    title: "Packing for two weeks in Vietnam with one carry-on",
    platform: "Instagram",
    type: "Reel",
    date: day(2),
    status: "Scheduled",
  },
  {
    id: 4,
    title: "Morning routine that survived a remote-work winter",
    platform: "TikTok",
    type: "Reel",
    date: day(6),
    status: "Idea",
  },
  {
    id: 5,
    title: "The design tools I actually kept after a year",
    platform: "Blog",
    type: "Text",
    date: day(13),
    status: "Idea",
  },
  {
    id: 6,
    title: "Ten minutes at the train station café, no phone",
    platform: "Instagram",
    type: "Story",
    date: day(3),
    status: "Draft",
  },
  {
    id: 7,
    title: "Why my blog stopped growing and what I changed",
    platform: "Blog",
    type: "Text",
    date: day(-12),
    status: "Published",
  },
  {
    id: 8,
    title: "Three questions to ask before taking any freelance job",
    platform: "Threads",
    type: "Carousel",
    date: day(-9),
    status: "Published",
  },
  {
    id: 9,
    title: "A rainy week in the Scottish Highlands, in photos",
    platform: "Instagram",
    type: "Carousel",
    date: day(9),
    status: "Idea",
  },
  {
    id: 10,
    title: "The cost of a month of slow travel, itemised",
    platform: "Blog",
    type: "Text",
    date: day(-3),
    status: "Published",
  },
  {
    id: 11,
    title: "Notes toward a piece on designing in public",
    platform: "Threads",
    type: "Text",
    // No date yet: an idea worth keeping, not something committed to a day.
    date: null,
    status: "Idea",
  },
  {
    id: 12,
    title: "Six typography mistakes I made for two years",
    platform: "Blog",
    type: "Text",
    date: null,
    status: "Draft",
  },
]
