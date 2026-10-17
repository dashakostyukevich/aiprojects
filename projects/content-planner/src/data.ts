import type { Post } from "./types"

/*
  Example content, written by hand. Nothing here is saved anywhere — closing
  the tab throws it away, which is fine for now. Later this file gets
  replaced by data loaded from the browser's localStorage.

  The `day` number says which column of the weekly schedule a post appears in:
  0 = Monday, 1 = Tuesday ... 6 = Sunday. A day of -1 means "not on this
  week's board" — used by posts that already went out in an earlier week.
*/

export const posts: Post[] = [
  {
    id: 1,
    title: "A slow week in Lisbon: five cafés worth the detour",
    platform: "Blog",
    type: "Carousel",
    date: "Mar 18",
    status: "Scheduled",
    day: 1,
  },
  {
    id: 2,
    title: "What I learned billing hourly as a freelance designer",
    platform: "Threads",
    type: "Text",
    date: "Mar 19",
    status: "Draft",
    day: 2,
  },
  {
    id: 3,
    title: "Packing for two weeks in Vietnam with one carry-on",
    platform: "Instagram",
    type: "Reel",
    date: "Mar 20",
    status: "Published",
    day: 3,
  },
  {
    id: 4,
    title: "Morning routine that survived a remote-work winter",
    platform: "TikTok",
    type: "Reel",
    date: "Mar 21",
    status: "Scheduled",
    day: 4,
  },
  {
    id: 5,
    title: "The design tools I actually kept after a year",
    platform: "Blog",
    type: "Text",
    date: "Mar 23",
    status: "Idea",
    day: 6,
  },
  {
    id: 6,
    title: "Ten minutes at the train station café, no phone",
    platform: "Instagram",
    type: "Story",
    date: "Mar 17",
    status: "Draft",
    day: 0,
  },
  {
    id: 7,
    title: "Why my blog stopped growing and what I changed",
    platform: "Blog",
    type: "Text",
    date: "Mar 10",
    status: "Published",
    day: -1,
  },
  {
    id: 8,
    title: "Three questions to ask before taking any freelance job",
    platform: "Threads",
    type: "Carousel",
    date: "Mar 12",
    status: "Published",
    day: -1,
  },
  {
    id: 9,
    title: "A rainy week in the Scottish Highlands, in photos",
    platform: "Instagram",
    type: "Carousel",
    date: "Mar 22",
    status: "Idea",
    day: 5,
  },
  {
    id: 10,
    title: "The cost of a month of slow travel, itemised",
    platform: "Blog",
    type: "Text",
    date: "Mar 19",
    status: "Idea",
    day: 2,
  },
]

/** The seven columns of the weekly schedule, Monday first. */
export const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

export const weekDates = ["17", "18", "19", "20", "21", "22", "23"]
