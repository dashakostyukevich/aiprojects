import type { PillarType } from "./types"

/*
  The written half of the Pillars page: for each of the nine types, what it is
  for, how to make one land, and how it usually goes wrong.

  This is content rather than code. It lives in its own file for two reasons:
  `types.ts` should stay types and arrays, and this is the one part of the page
  that is editorial writing — it is easy to revise without touching layout, and
  easy to read through in one go.

  Kept deliberately short. Nine types times three paragraphs is already a lot to
  read, and advice nobody finishes reading is advice nobody follows.
*/
export interface PillarTypeGuide {
  /** What this pillar does for the reader, in a sentence or two. */
  summary: string
  /** The specific move that separates a good one from a forgettable one. */
  makeItLand: string
  /** The usual failure, said plainly. */
  watchOut: string
}

export const PILLAR_GUIDE: Record<PillarType, PillarTypeGuide> = {
  Educational: {
    summary:
      "You know something the reader needs. Teaching it is the cheapest way " +
      "to earn trust, because it is useful before it asks for anything.",
    makeItLand:
      "Teach the specific version, not the topic. \"How I cut my edit time " +
      "in half\" is a post; \"editing tips\" is a heading. One thing a reader " +
      "can do today beats five things they can admire.",
    watchOut:
      "If anyone in your field could have written it, you are reciting, not " +
      "teaching. Put yourself in it — the mistake you made, the number you " +
      "actually got.",
  },

  Promotional: {
    summary:
      "What you do or sell, said out loud. Skipping it is not modesty: it " +
      "leaves the reader guessing what you are for.",
    makeItLand:
      "Sell the outcome, not the inventory. One clear thing to do next, and " +
      "an honest reason it is worth doing now. Show the work being used " +
      "rather than describing the offer.",
    watchOut:
      "If asking is most of what you post, none of it works. Keep this a " +
      "minority and let the other eight types carry the trust it spends.",
  },

  Engaging: {
    summary:
      "A post built to make replying easy. Comments are the cheapest signal " +
      "that something landed, and they show the next reader that it did.",
    makeItLand:
      "Ask something with a real answer — a choice, an opinion, a story. " +
      "\"Which of these two would you pick?\" gets replies; \"thoughts?\" " +
      "does not. Reply to the first few yourself; the thread is the post.",
    watchOut:
      "Engagement bait reads as a transaction, and readers can tell. If the " +
      "question has no interesting answer, do not ask it.",
  },

  Inspiring: {
    summary:
      "Not motivational quotes — the visible proof that the thing you talk " +
      "about is possible. It gives people a reason to keep following.",
    makeItLand:
      "Ground it in something you can point at: before, after, and the " +
      "unglamorous middle nobody photographs. Specific hope persuades; " +
      "general hope evaporates by the next scroll.",
    watchOut:
      "Inspiration without evidence is a poster. If it could sit on any " +
      "account in your field, it belongs on none of them.",
  },

  Entertaining: {
    summary:
      "Light, funny, shareable. It gets you sent to people who were not " +
      "looking for you, and it buys room for the posts that ask for something.",
    makeItLand:
      "Borrow a format, not a joke. Take the meme, the sketch, the trend " +
      "structure that already works, and put your own subject in the middle " +
      "of it.",
    watchOut:
      "Forced humour costs more trust than no humour. If it is not funny to " +
      "you, it is not funny — post the honest one instead.",
  },

  Community: {
    summary:
      "Content that treats your readers as people who know each other, " +
      "rather than as an audience. It is the type that turns a feed into a " +
      "place.",
    makeItLand:
      "Name them, quote them, answer them in public. The cheapest community " +
      "post is a reply you turned into a post, with permission — their words " +
      "and your answer.",
    watchOut:
      "Community is a practice, not a format. One \"community post\" a month " +
      "reads as a gesture; the type only works when it is a habit.",
  },

  Authenticity: {
    summary:
      "The unpolished side: what the work actually looks like, including the " +
      "parts that did not work. The type that makes the other eight " +
      "believable.",
    makeItLand:
      "Show a decision you would normally hide — the price you said no to, " +
      "the version you threw away, the number that was worse than you hoped. " +
      "Transparency only convinces when it costs you something to share.",
    watchOut:
      "Curation dressed as honesty is worse than plain polish. If every " +
      "behind-the-scenes is tidy, it is not behind the scenes.",
  },

  Trending: {
    summary:
      "Capitalising on what is current. A window that is open for a week: " +
      "good for reach, expensive to chase, and worth having one plan for.",
    makeItLand:
      "Only join a trend you have something specific to say about. Aim for " +
      "the third thought, not the first — everyone has the first, and the " +
      "second is already in the comments.",
    watchOut:
      "A trend that does not touch your subject brings the wrong people and " +
      "dilutes the account. Reach you cannot keep is a cost, not a win.",
  },

  "Social proof": {
    summary:
      "Other people saying the thing you cannot say about yourself. The type " +
      "that answers \"has this worked for anyone like me?\"",
    makeItLand:
      "Lead with the number, follow with one specific sentence about what " +
      "changed. A checkable result beats a paragraph of praise, and a small " +
      "real one beats a grand vague one.",
    watchOut:
      "Unverifiable claims read as decoration. Ask before you quote " +
      "somebody, and never round a number up until it stops being true.",
  },
}
