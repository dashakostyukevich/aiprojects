import type { Idea, Post } from "./types"
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
    status: "Filming",
  },
  {
    id: 5,
    title: "The design tools I actually kept after a year",
    platform: "Blog",
    type: "Text",
    date: day(13),
    status: "Scripting",
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
    status: "Editing",
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
    // Still loose notes: the first stage, and no day committed to yet.
    date: null,
    status: "Draft",
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

/*
  Example ideas, on the same footing as the posts above: written by hand,
  copied in on a first run, then ignored in favour of the browser's copy.

  An idea is only an id and a title, so most of these are one line — that is
  the point of the short form. One has no tag at all, to show the
  "Uncategorised" group, and one has already become a post (id 2 below, linked
  to the billing post) to show what a promoted idea looks like on the page.
*/
export const ideas: Idea[] = [
  {
    id: 1,
    title: "The first sentence decides everything",
    tag: "Hooks",
    notes: "Open with the consequence, not the setup.",
  },
  {
    id: 2,
    title: "\"I billed hourly for three years. Here's what it cost me.\"",
    tag: "Hooks",
    // Already used once — which is exactly why the idea is kept afterwards.
    postId: 2,
    notes: "Worked better as an opener than as the headline.",
  },
  {
    id: 3,
    title: "What freelance work actually costs beyond the day rate",
    tag: "Topics",
    notes: "Invoicing gaps, unpaid admin, the quiet months.",
  },
  {
    id: 4,
    title: "Why every portfolio site looks the same now",
    tag: "Topics",
  },
  {
    id: 5,
    title: "Overhead desk shot, one warm lamp, nothing switched on",
    tag: "Visuals",
    notes: "Same framing every week so the grid reads as a set.",
  },
  {
    id: 6,
    title: "Time-lapse of a blank page filling up with type",
    tag: "Visuals",
  },
  {
    id: 7,
    title: "A short piece about declining the wrong clients",
    tag: "Post ideas",
    notes: "Three examples, then the script I actually use.",
  },
  {
    id: 8,
    title: "Something about the cafés where work actually happens",
  },
]
