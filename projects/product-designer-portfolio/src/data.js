// Swap these placeholders for your real details. Everything on the page reads
// from here, so editing this file is usually all you need.

export const profile = {
  name: 'Alex Morgan',
  role: 'Product Designer',
  // Hero headline, first screen. One paragraph read as an inline flow, with
  // `em` for italic spans and `chip` for the inline elements. Chips sit in a
  // word slot, so the line count is emergent: three lines at the spec's ~780px
  // measure. A part is either { text, em? } or { chip, ...props }.
  // Hero headline, first screen. One paragraph read as an inline flow, with
  // `em` for the emphasised spans and `chip` for the inline elements.
  //
  // Only the asterisk chip survives here. The photo and block chips were
  // decorative CSS-gradient capsules, and at a readable measure they pushed the
  // headline to four lines on a laptop and six on a phone. They remain
  // available in HeadlineChip.jsx if you want them back on a wider measure.
  headline: [
    { text: 'I design calm, ' },
    { text: 'useful interfaces ', em: true },
    { chip: 'icon' },
    { text: ' for ' },
    { text: 'complex products ', em: true },
    { text: 'that people actually enjoy using.' },
  ],
  // §3 statement band. Each line stays on one row and bleeds off an edge, so
  // the second half reads as an intentional crop rather than a wrap.
  statement: ['Structure first,', 'personality on top.'],
  tagline: 'I design calm, useful interfaces for complex products.',
  location: 'Berlin, Germany',
  email: 'hello@example.com',
  availability: 'Open to new projects, 2026',
  // No invented numbers. The previous first paragraph read "Placeholder bio. I
  // am a product designer with X years of experience", which is a literal
  // template artefact. Say what the work is, not how long you have done it.
  bio: [
    'I am a product designer. I turn ambiguous, half-specified problems into software people can pick up and use without a tutorial.',
    'I work end to end: research and framing, flows and wireframes, high-fidelity UI, then shipping alongside engineers and measuring what happens after launch.',
  ],
  // Footer links. The `Email` entry that used to be first here was removed: the
  // footer already renders the same address as a button directly above this
  // row, so it was a second control for one intent. Swap these three hrefs for
  // your real profiles, they currently point at bare domain roots.
  links: [
    { label: 'Dribbble', href: 'https://dribbble.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'GitHub', href: 'https://github.com' },
  ],
}

// Nav is the §5 pill/outline variant: three outlined pills on the right, a bare
// icon mark on the left with no wordmark. Not sticky, per the first-screen spec.
export const nav = [
  ['Projects', '/#work'],
  ['About', '/#about'],
  ['Contact', '/#contact'],
]

export const services = [
  {
    title: 'Product design',
    body: 'End-to-end design for web and mobile features, from problem framing to polished UI.',
  },
  {
    title: 'Design systems',
    body: 'Component libraries, tokens and documentation that keep design and engineering in sync.',
  },
  {
    title: 'Research and strategy',
    body: 'User interviews, usability testing and product direction grounded in evidence.',
  },
]

export const experience = [
  {
    company: 'Northwind Labs',
    role: 'Senior Product Designer',
    period: '2022 – Present',
    notes: 'Led design for the analytics platform used by 40k teams. Built the first shared design system.',
  },
  {
    company: 'Fieldnote',
    role: 'Product Designer',
    period: '2019 – 2022',
    notes: 'Designed mobile onboarding and the offline sync engine experience. Cut first-week churn by a third.',
  },
  {
    company: 'Studio Kern',
    role: 'UI Designer',
    period: '2017 – 2019',
    notes: 'Client work across fintech and healthcare. Learned to love constraints and typography.',
  },
]

// Each project has a `slug` that becomes its URL: /work/<slug>
// `summary`, `outcome` and `tags` are used on the work grid; the rest is the
// long-form case study shown on the project page.
export const projects = [
  {
    slug: 'arastelle',
    title: 'ARASTELLE',
    year: '2026',
    summary:
      'Communicating complex technology through a clear digital experience. A marketing site for tethered drone systems, designed in Figma and built in Webflow.',
    outcome: 'Designed and shipped: Figma to responsive Webflow',
    tags: ['Web design', 'Interaction design', 'Webflow', 'Brand site'],
    // First grid slot. Takes the 7-column span, so the next project has to be
    // narrow for the row to close. See the note on `size` in the array below.
    size: 'wide',
    ratio: 'landscape',
    drop: null,
    // A brand card rather than a photo: the site has no public imagery to show
    // yet, and a solid navy fill gives this row a different texture from the
    // hatched photo slot beside it.
    kind: 'brand',
    fill: 'navy',
    lockup: 'ARASTELLE',
    image: null,
    cover: null,
    coverAlt: 'The ARASTELLE website, hero section',
    coverLabel: 'The ARASTELLE website — hero section, designed and built in Webflow',
    meta: {
      role: 'Product / Web Designer — UX/UI, interaction design, Webflow development',
      timeline: 'Ongoing project',
      team: 'ARASTELLE, with a development partner',
      platform: 'Webflow, responsive web',
      status: 'Shipped / under NDA',
    },
    intro: [
      'ARASTELLE develops tethered drone systems designed to extend the capabilities of micro-UAS for professional and institutional users. The website needed to communicate a highly technical product in a way that felt clear, credible, and engaging.',
      'Because the project is under NDA, this case study focuses only on the publicly available product and the design work I can share.',
    ],
    sections: [
      {
        heading: 'The challenge',
        body: [
          'The product itself is technically complex, while the website needed to make its value understandable quickly. The experience had to communicate:',
          {
            list: [
              'what the technology does',
              'why tethered drones matter',
              'how the solution works',
              'where it can be used',
              'what makes the system different',
            ],
          },
          'At the same time, the brand needed to feel technical, reliable, and modern rather than like a traditional defense-industry website.',
          {
            note: 'Because the project is under NDA, this case study focuses only on the publicly available product and the design work I can share.',
          },
        ],
      },
      {
        heading: 'Turning complex technology into a clear story',
        body: [
          {
            image: {
              label: 'The site’s narrative structure — from what it is to how to learn more',
              alt: 'The ARASTELLE site structure, laid out as a progression',
            },
          },
          'I approached the website as a storytelling experience rather than simply a collection of product pages. The information was structured around a simple progression:',
          { note: 'What is it? → How does it work? → What makes it different? → Where can it be used? → How can I learn more?' },
          'This allowed visitors to gradually understand the technology without being overwhelmed by technical information.',
        ],
      },
      {
        heading: 'Designing the product experience',
        body: [
          {
            sub: {
              number: '01',
              heading: 'Product first',
              body: [
                {
                  image: {
                    label: 'The BASTION ISR hero — product visuals, value proposition, key specifications',
                    alt: 'The BASTION ISR hero section on the ARASTELLE website',
                  },
                },
                'The BASTION ISR solution is introduced early, with the core value proposition and key specifications immediately visible. Instead of hiding technical information deeper in the page, I combined product visuals, concise messaging, and specifications to create a quick understanding of the solution.',
                'The public site communicates key attributes such as unlimited flight time, 100 m operating height, 30-second deployment, and its compatibility with multiple micro-UAS platforms.',
              ],
            },
          },
          {
            sub: {
              number: '02',
              heading: 'Making multiple use cases easy to explore',
              body: [
                {
                  image: {
                    label: 'The use-case explorer — select a scenario to see how the technology applies',
                    alt: 'The use-case explorer on the ARASTELLE website',
                  },
                },
                'ARASTELLE’s technology can be applied across different scenarios, including defense, public safety, private security, event security, first response, crisis management, and critical infrastructure protection.',
                'Rather than presenting these as a long list, I designed the experience around use-case exploration. Visitors can select a scenario and discover how the technology applies to that specific context. This creates a more relevant experience for different audiences while keeping the overall page structure simple.',
              ],
            },
          },
          {
            sub: {
              number: '03',
              heading: 'Combining technical information with visual storytelling',
              body: [
                {
                  image: {
                    label: 'Product imagery, motion, and interactive sections',
                    alt: 'Visual storytelling sections on the ARASTELLE website',
                  },
                },
                'For a highly technical product, visuals are important for helping people understand the technology before they read every detail. I used:',
                {
                  list: [
                    'large-scale product imagery',
                    'motion and video',
                    'interactive sections',
                    '3D/visual representations',
                    'progressive disclosure of information',
                  ],
                },
                'The result is an experience that feels closer to a technology product presentation than a conventional corporate website.',
              ],
            },
          },
        ],
      },
      {
        heading: 'Interaction & visual direction',
        body: [
          {
            image: {
              label: 'The visual language — precision, technology, reliability, mission focus',
              alt: 'ARASTELLE visual direction across page sections',
            },
          },
          'The visual language was built around the characteristics of the product itself:',
          {
            sub: {
              heading: 'Precision',
              body: ['Structured layouts and strong typographic hierarchy.'],
            },
          },
          {
            sub: {
              heading: 'Technology',
              body: ['Dark visual environments, motion, product renders, and interactive elements.'],
            },
          },
          {
            sub: {
              heading: 'Reliability',
              body: ['Clear specifications, restrained UI, and direct communication.'],
            },
          },
          {
            sub: {
              heading: 'Mission focus',
              body: ['Large imagery and contextual use cases that demonstrate the technology in action.'],
            },
          },
          'The goal was to make the interface feel advanced without sacrificing clarity.',
        ],
      },
      {
        heading: 'From Figma to Webflow',
        body: [
          {
            image: {
              label: 'The responsive build in Webflow',
              alt: 'The ARASTELLE website built in Webflow',
            },
          },
          'I designed the experience in Figma and translated the final design into a responsive Webflow website. The implementation included:',
          {
            list: [
              'responsive layouts',
              'interactive sections',
              'animated transitions',
              'product showcases',
              'use-case interactions',
              'CMS/content structures where needed',
              'responsive behavior across screen sizes',
            ],
          },
          'The focus throughout development was keeping the visual experience from the design intact while making the interactions feel natural on the live website.',
        ],
      },
      {
        heading: 'The result',
        body: [
          'The final website gives ARASTELLE a digital experience that combines technical credibility with visual storytelling. It helps visitors understand the product, explore its applications, and move naturally toward learning more or requesting a demo.',
          'The public website now communicates the company’s core proposition — persistent aerial observation through tethered drone technology — while giving different audiences a way to explore relevant use cases.',
        ],
      },
      {
        heading: 'NDA',
        body: [
          'Some project details, including internal strategy, research, business requirements, and project discussions, cannot be shared publicly due to an NDA. This case study therefore focuses on the publicly available product and the design and development work I am permitted to show.',
        ],
      },
    ],
    pullquote:
      'The goal was to make the interface feel advanced without sacrificing clarity.',
    pullquoteBy: 'A guiding principle for this project',
  },
  {
    slug: 'groshi',
    title: 'Groshi',
    // TODO: the copy does not state when this work ran. Set the real year.
    year: '2025',
    summary:
      'Bringing clarity to complex personal finances. Product architecture, a scalable category system, budgeting from scratch, and a rebuilt onboarding — all shipped.',
    // The product is still ongoing, so there is no honest conversion number to
    // put here. This reads as a claim about the work, not a metric.
    outcome: 'Structure before scale: researched, tested, and implemented',
    tags: ['Product design', 'UX research', 'Information architecture', 'Fintech'],
    // Second grid slot. Narrow, so it pairs with ARASTELLE's 7-column card
    // above it and closes the row. Carries a drop so it hangs lower than
    // ARASTELLE, which is what makes the row read as staggered.
    size: 'narrow',
    ratio: 'square',
    drop: 'lg',
    // A product screenshot is the honest card for a shipped product. `image` is
    // null, so this renders a labelled slot until the real screen exists.
    kind: 'photo',
    fill: 'sky',
    lockup: null,
    image: null,
    imageAlt: 'Groshi personal finance app',
    imageLabel: 'Groshi — accounts overview in the shipped product',
    cover: null,
    coverAlt: 'Groshi personal finance app, accounts overview',
    coverLabel: 'Groshi — the shipped product, accounts and net worth overview',
    meta: {
      role: 'Product Designer — UX/UI, research, UX audit, information architecture, feature design, design system',
      timeline: 'Ongoing product',
      team: 'Client, Product Manager, technical team',
      platform: 'Web app, multi-account and multi-currency',
      status: 'Implemented / ongoing',
    },
    intro: [
      'Managing money becomes complicated when it is spread across multiple accounts, banks, currencies, and sources of income. Groshi was designed to bring everything into one place and help people understand, plan, and control their finances with more confidence.',
      'I joined the product while it was already in development. My challenge was not simply to design new screens, but to bring structure to an evolving product, improve existing experiences, and introduce new functionality without making the experience more complicated.',
    ],
    sections: [
      {
        heading: 'The challenge',
        body: [
          'Personal finances are becoming increasingly fragmented. People may have several bank accounts, credit cards, savings accounts, different currencies, and multiple sources of income. When all of this information lives in different places, it becomes difficult to understand the bigger picture.',
          'The research behind Groshi highlighted several recurring needs:',
          {
            list: [
              'seeing a complete financial picture',
              'understanding where money is going',
              'managing budgets and financial goals',
              'reducing the amount of manual tracking',
              'working with multiple accounts and currencies',
              'feeling confident that financial information is organized and understandable',
            ],
          },
          'The product needed to make this complexity feel manageable rather than overwhelming.',
        ],
      },
      {
        heading: 'I joined an existing product — but there was no architecture',
        body: [
          'When I joined Groshi, the product already had screens and design decisions, but it did not yet have a clear information architecture. This quickly became a problem.',
          'With multiple accounts, transactions, categories, reports, budgets, and other features, designing screens individually made it difficult to create coherent user flows. Before expanding the product, I needed to understand how all these pieces fit together.',
          'So I created the product architecture and used it as a foundation for subsequent UX decisions. The goal was to establish a structure that could scale as new features were introduced, while keeping the relationship between accounts, transactions, categories, analytics, and budgets clear.',
        ],
      },
      {
        heading: 'Research: understanding what users actually struggle with',
        body: [
          'Rather than relying only on assumptions about personal finance, I collected qualitative feedback from discussions and reviews of finance products. I organized the feedback by feature and sentiment to identify recurring patterns and areas where users were experiencing friction.',
          'Several themes emerged:',
          {
            sub: {
              number: '01',
              heading: 'The need for a complete picture',
              body: [
                'Users wanted to understand their overall financial situation rather than look at isolated transactions or accounts.',
              ],
            },
          },
          {
            sub: {
              number: '02',
              heading: 'Too much information can become overwhelming',
              body: [
                'Financial products often contain a lot of data. Simply adding more information does not necessarily make the experience more useful.',
              ],
            },
          },
          {
            sub: {
              number: '03',
              heading: 'Budgeting is valuable, but needs to feel approachable',
              body: [
                'Budgeting can help users plan their finances, but the experience needs to make the first step obvious.',
              ],
            },
          },
          {
            sub: {
              number: '04',
              heading: 'Onboarding matters',
              body: [
                'A complex financial product needs to explain itself. Users need guidance to understand what they can do and why the product is useful.',
              ],
            },
          },
          {
            sub: {
              number: '05',
              heading: 'Flexibility and consistency matter',
              body: [
                'With multiple accounts and currencies, users need flexibility without having to learn different rules in different parts of the product.',
              ],
            },
          },
          'These insights became the foundation for the product goals I proposed to the client.',
        ],
      },
      {
        heading: 'From research to product goals',
        body: [
          'Based on the research and the original product brief, I defined three core goals:',
          {
            list: [
              'Create a sense of control — help users understand what is happening with their money.',
              'Reduce financial stress — make complex financial information easier to understand and manage.',
              'Help users work toward financial goals — turn financial data into something users can act on through budgeting and planning.',
            ],
          },
          'These goals helped shift the design process from simply improving individual screens to thinking about the experience as a connected financial management system.',
        ],
      },
      {
        heading: 'Competitive research',
        body: [
          'I looked at both direct finance products and products with useful patterns that could inform the experience.',
          {
            table: {
              head: ['Product', 'What I looked at'],
              rows: [
                ['Revolut', 'UI quality and account organization'],
                ['Monarch Money', 'Similar feature set and user flows'],
                ['YNAB', 'Budgeting experience'],
                ['HomeMoney', 'Managing multiple user accounts'],
                ['Notion / Mint', 'Broader patterns and indirect inspiration'],
              ],
            },
          },
          'The goal was not to copy existing solutions. I used competitors to understand how established products solve similar problems, identify familiar interaction patterns, and find opportunities to make the Groshi experience clearer.',
        ],
      },
      {
        heading: 'Designing a scalable financial structure',
        body: [
          {
            image: {
              label: 'Groshi information architecture — accounts, transactions, categories, analytics, budgets',
              alt: 'Information architecture map for Groshi',
            },
          },
          'The architecture became the foundation for the rest of the product. I organized the experience around the major objects users need to manage:',
          { note: 'Accounts → Transactions → Categories → Analytics → Budgets' },
          'This made it possible to think about features as parts of one system rather than independent screens. It was particularly important because Groshi supports multiple accounts and currencies: a decision made in one part of the product could affect reports, transactions, categories, and budgets elsewhere.',
        ],
      },
      {
        heading: 'Making financial data easier to understand',
        body: [
          {
            image: {
              label: 'Redesigned financial chart — selecting a month reveals the exact figures',
              alt: 'The redesigned Groshi financial chart with contextual month detail',
            },
          },
          'One of the existing experiences I redesigned was the financial chart. The original chart communicated information primarily through visual elements — columns and a line — but users had limited contextual information when looking at a particular month.',
          'I redesigned the interaction so that selecting a month also revealed the relevant figures. Instead of asking users to estimate values from the visualization, the interaction provided the exact numbers alongside the visual trend.',
          { note: 'The principle: visual overview → contextual detail.' },
          'The chart could communicate the overall trend while still allowing users to investigate a specific point when they needed more precise information. I also refined the visual hierarchy and interaction patterns to make the analytics experience more consistent with the rest of the product.',
        ],
      },
      {
        heading: 'Building a category system that could scale',
        body: [
          {
            image: {
              label: 'Category management — creating, editing, and nesting categories',
              alt: 'The Groshi category management interface',
            },
          },
          'Categories initially looked like a relatively simple feature. But once I considered the product as a whole, the challenge became much bigger. Groshi needed categories to work consistently across:',
          {
            list: [
              'multiple accounts',
              'transactions',
              'reports',
              'budgets',
              'multiple currencies',
            ],
          },
          'The main UX challenge was hierarchy and nesting. If categories are structured differently depending on where the user encounters them, the product quickly becomes difficult to understand.',
          'I therefore designed a more complete category management experience, including creating, editing, and organizing categories while maintaining consistency throughout the product.',
          {
            note: 'A feature should not only work on its own. It needs to work as part of the entire product system.',
          },
        ],
      },
      {
        heading: 'Designing budgeting from scratch',
        body: [
          {
            image: {
              label: 'Budget creation flow — prototyping in Figma and Lovable',
              alt: 'The Groshi budget creation flow',
            },
          },
          'Budgeting was a completely new part of the product. Because Groshi was still developing its MVP, we had to balance research insights with business priorities and move quickly.',
          'Rather than trying to build an advanced budgeting system immediately, we focused on creating a basic experience that could validate the core concept. I explored the flows using Figma and Lovable, which allowed us to prototype and iterate quickly before moving toward implementation.',
          'The core flow allowed users to create budgets for their income and expenses.',
        ],
      },
      {
        heading: 'Testing the budgeting experience',
        body: [
          {
            image: {
              label: 'The first screen of the budgeting flow that two of three users found confusing',
              alt: 'The entry screen of the budgeting flow used in usability testing',
            },
          },
          'Before finalizing the flow, I tested it with 3 users. The task was simple:',
          { note: 'Create a budget category for expenses and income from the first screen.' },
          'All three users successfully completed the task. However, the test revealed an important usability issue — 2 out of 3 users were confused by the first screen.',
          'They were not immediately sure what they were supposed to do or where they should go next. It took them some time to understand the entry point into the budgeting flow.',
          'This was valuable because the test showed that task completion alone was not enough. The flow technically worked, but the starting point was not immediately discoverable. That finding informed the way I thought about entry points and guidance in the broader product experience.',
        ],
      },
      {
        heading: 'Rebuilding onboarding from scratch',
        body: [
          'Onboarding was another area where the product needed more structure. Instead of simply introducing users to the interface, I designed the onboarding experience from the ground up. The new experience had two important parts.',
          {
            sub: {
              number: '01',
              heading: 'Understand the user',
              body: [
                {
                  image: {
                    label: 'The opening onboarding form — who the user is and what they are looking for',
                    alt: 'The opening question form in Groshi onboarding',
                  },
                },
                'At the beginning, we introduced a short form to understand who the user was and what they were looking for. This gave the product an opportunity to make onboarding more relevant to the user’s needs instead of presenting everyone with the same generic introduction.',
              ],
            },
          },
          {
            sub: {
              number: '02',
              heading: 'Guide users through setup',
              body: [
                {
                  image: {
                    label: 'The step-by-step account setup flow',
                    alt: 'The step-by-step account setup flow in Groshi onboarding',
                  },
                },
                'I created a step-by-step account setup flow that broke the process into manageable stages. Rather than asking users to understand the whole product immediately, onboarding gradually introduced the information needed to get started.',
                'The result was a more guided entry into a product that could otherwise feel complex from the first interaction.',
              ],
            },
          },
        ],
      },
      {
        heading: 'Working within and extending the design system',
        body: [
          'I inherited an existing design system when I joined the project. Rather than replacing it, I worked within the established visual language and extended it as the product evolved. I added:',
          {
            list: [
              'new components',
              'forms',
              'interaction states',
              'patterns required for new features',
            ],
          },
          'This allowed new functionality — including budgeting, categories, and onboarding — to feel like part of the same product rather than separate additions. For a growing product, consistency was not only a visual concern: it also helped establish predictable interactions across different parts of the experience.',
        ],
      },
      {
        heading: 'From design to a real product',
        body: [
          'One important aspect of the project is that the work did not stop at prototypes. The features I designed were implemented. The product evolved to include improvements and new functionality across:',
          {
            list: [
              'onboarding',
              'accounts',
              'categories',
              'analytics and charts',
              'budgeting',
              'merchant tracking',
              'shared access',
              'multi-account and multi-currency experiences',
            ],
          },
          'The design system was also extended to support the growing product.',
          'Because the product is still ongoing, there are not reliable quantitative product metrics I can use to claim specific improvements in conversion, retention, or revenue. Instead, the most concrete evidence from the design process comes from the implemented product and the usability testing.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'The project moved from an evolving collection of screens toward a more structured product experience. My contribution helped establish:',
          {
            sub: {
              heading: 'A scalable product architecture',
              body: [
                'A clearer relationship between accounts, transactions, categories, analytics, and budgets.',
              ],
            },
          },
          {
            sub: {
              heading: 'A more understandable financial analytics experience',
              body: [
                'Charts became more informative by combining visual trends with contextual data.',
              ],
            },
          },
          {
            sub: {
              heading: 'A consistent category system',
              body: [
                'Categories could work across accounts, transactions, reports, and budgets.',
              ],
            },
          },
          {
            sub: {
              heading: 'A new budgeting experience',
              body: [
                'A previously nonexistent feature was researched, prototyped, tested, and implemented.',
              ],
            },
          },
          {
            sub: {
              heading: 'A new onboarding experience',
              body: [
                'A step-by-step setup flow and initial user discovery helped create a more guided entry into the product.',
              ],
            },
          },
          {
            sub: {
              heading: 'An evolving design system',
              body: [
                'New components, forms, and states were added without breaking the existing visual language.',
              ],
            },
          },
        ],
      },
      {
        heading: 'What I learned',
        body: [
          'Joining a product in the middle of development taught me that Product Design is not always about starting with a blank canvas. Sometimes the challenge is understanding what already exists, identifying what is missing, and making new decisions fit into an evolving system.',
          'The biggest lesson from Groshi was the importance of structure before scale. Without a clear architecture, adding more features only makes a product harder to navigate. Establishing the underlying structure first made it easier to design new experiences while keeping the product coherent.',
          'I also learned to treat usability testing as a way to discover unexpected problems, not simply to confirm that a design works. In the budgeting test, every participant completed the task — but two still struggled with the first step. That distinction helped me look beyond successful task completion and pay more attention to discoverability and confidence.',
          'If I were continuing the project, I would involve stakeholders earlier in defining the overall product structure, and map the complete user journey before expanding individual feature areas.',
          'For me, Groshi became less about designing a finance dashboard and more about learning how to bring structure, clarity, and consistency to a complex product as it grows.',
        ],
      },
    ],
    pullquote:
      'The biggest lesson from Groshi was the importance of structure before scale. Without a clear architecture, adding more features only makes a product harder to navigate.',
    pullquoteBy: 'What I learned',
  },
  {
    slug: 'noxs',
    title: 'NOXS',
    year: '2025',
    summary:
      'Turning a complex AI product into a clear B2B experience. A conversion-focused landing page for an AI delivery assistant, including an A/B test on the hero.',
    // The one project here with a measured result rather than a description of
    // the work, so it is worth leading with on the card.
    outcome: 'A/B test: the direct, benefit-led hero won',
    tags: ['Web design', 'UX', 'Conversion', 'A/B testing'],
    // Third grid slot. Wide, pairing with Groshi's 5-column card to close row
    // two, so the three cards tile 7+5 then 5+7.
    size: 'wide',
    ratio: 'landscape',
    drop: 'md',
    kind: 'photo',
    fill: 'sky',
    lockup: null,
    image: null,
    imageAlt: 'The NOXS landing page',
    imageLabel: 'NOXS — the landing page, direct hero variant',
    cover: null,
    coverAlt: 'The NOXS landing page, hero section',
    coverLabel: 'The NOXS landing page — hero section, variant B',
    meta: {
      role: 'UX/UI and Web Designer',
      timeline: '1 month',
      team: 'With product and marketing',
      platform: 'Webflow-ready design',
      status: 'Shipped',
    },
    intro: [
      'NOXS is an AI-powered virtual assistant for technical teams. It connects with tools such as Slack, Jira, Confluence, and Notion to help teams monitor delivery, detect blockers, automate routine tasks, and turn fragmented project data into actionable information.',
      'The challenge was to turn a technically complex B2B SaaS product into a website that visitors could understand quickly — and ultimately convince them to book a demo.',
    ],
    sections: [
      {
        heading: 'The challenge',
        body: [
          {
            image: {
              label: 'The tool stack NOXS sits on top of — Slack, Jira, Confluence, Git',
              alt: 'The existing tool stack that NOXS integrates with',
            },
          },
          'Technical teams already work across many tools: Slack for communication, Jira for tasks, Confluence for documentation, Git for development. NOXS was designed to connect these fragmented sources and provide an additional layer of intelligence without forcing teams to adopt another complicated interface.',
          'The website needed to answer three questions almost immediately:',
          { note: 'What is NOXS? How does it fit into my existing workflow? Why should I care?' },
          'The goal was to create a clear, persuasive landing page that could explain the product, build trust, and generate new leads.',
        ],
      },
      {
        heading: 'From a complex product to a simple story',
        body: [
          {
            image: {
              label: 'The page narrative — problem, product, how it works, features, use cases, outcomes, conversion',
              alt: 'The NOXS landing page narrative structure',
            },
          },
          'I started by understanding the product positioning and its audience: developers, project managers, and digital leads.',
          'The core challenge was translating a technical B2B SaaS concept into a visual story that could be understood without requiring visitors to understand the underlying technology first. I structured the experience around a progressive narrative:',
          { note: 'Problem → Product → How it works → Features → Use cases → Outcomes → Conversion' },
          'Instead of starting with technical details, the page first established the problem — delivery chaos, fragmented data, missed blockers, and inefficient processes — and then positioned NOXS as the solution.',
        ],
      },
      {
        heading: 'Making the value proposition obvious',
        body: [
          'The product offered a lot of functionality:',
          {
            list: [
              'blocker and technical debt detection',
              'sprint planning and efficiency insights',
              'real-time KPIs',
              'smart search across tools',
              'automated reporting',
              'historical delivery insights',
            ],
          },
          'The challenge was not to show everything at once. It was to create a hierarchy that allowed visitors to understand the value first and explore the functionality second. The design therefore combined concise messaging with visual demonstrations and progressive information disclosure.',
          {
            note: 'Don’t make users understand the technology before they understand the benefit.',
          },
        ],
      },
      {
        heading: 'Designing for conversion',
        body: [
          {
            image: {
              label: 'Primary and secondary CTA placement across the page',
              alt: 'CTA placement across the NOXS landing page',
            },
          },
          'Because NOXS is a B2B SaaS product, the website wasn’t just an informational experience. It was also part of the acquisition funnel.',
          'I designed the information flow to move visitors from problem awareness, through understanding, trust, and interest, to a demo booking. Primary and secondary CTAs were placed throughout the experience so that users could take action once they had enough context.',
          'The page also used concrete outcomes and use cases to make the product’s value more tangible.',
        ],
      },
      {
        heading: 'Testing the first impression',
        body: [
          {
            image: {
              label: 'Variant A (conceptual) against variant B (direct) — same page, two hero framings',
              alt: 'The two hero variants tested for the NOXS landing page',
            },
          },
          'The hero section was particularly important. For a lead-generation landing page, the first screen needs to communicate the product’s value quickly and give visitors a clear next step.',
          'Instead of relying only on intuition, I tested two different approaches:',
          {
            sub: {
              number: 'A',
              heading: 'Conceptual',
              body: [
                'Positioned NOXS as a strategic technology layer and introduced the product more conceptually.',
              ],
            },
          },
          {
            sub: {
              number: 'B',
              heading: 'Direct',
              body: [
                'Explained what NOXS does more explicitly and focused on the immediate benefit.',
              ],
            },
          },
          'Both variants used the same supporting paragraph, but differed in headline framing, CTA hierarchy, and supporting elements.',
        ],
      },
      {
        heading: 'What the data showed',
        body: [
          'I used Google Analytics to track conversion behavior and Hotjar to analyze scroll depth and interaction through heatmaps. The direct, benefit-oriented version performed better in overall engagement and conversion.',
          'The testing also revealed several useful patterns:',
          {
            list: [
              'a shorter, action-oriented headline improved clarity for new visitors',
              'users interacted more with the main section in the direct version',
              'adding a secondary CTA increased views',
              'communicating monetary benefits increased interest in booking a demo',
            ],
          },
          {
            note: 'For a complex B2B product, clarity can be more persuasive than sophistication.',
          },
        ],
      },
      {
        heading: 'Visual direction',
        body: [
          {
            image: {
              label: 'The NOXS visual system — clarity, technology, structure, trust',
              alt: 'The visual direction across the NOXS landing page',
            },
          },
          'The visual system was designed to communicate the same qualities the product promised:',
          {
            sub: {
              heading: 'Clarity',
              body: ['Clean hierarchy and concise information.'],
            },
          },
          {
            sub: {
              heading: 'Technology',
              body: ['Modern UI patterns and product-focused visuals.'],
            },
          },
          {
            sub: {
              heading: 'Structure',
              body: ['Organized layouts that make complex information easier to scan.'],
            },
          },
          {
            sub: {
              heading: 'Trust',
              body: [
                'Concrete capabilities, integrations, use cases, and outcomes rather than abstract AI messaging.',
              ],
            },
          },
          'The result was a landing page designed to feel sophisticated without becoming difficult to understand.',
        ],
      },
      {
        heading: 'Designed for implementation',
        body: [
          'The final layouts were prepared with responsive behavior and Webflow development in mind. The design system and page structure were built to support:',
          {
            list: [
              'responsive layouts',
              'reusable components',
              'interactive sections',
              'clear CTA patterns',
              'feature and use-case sections',
              'conversion-focused content hierarchy',
            ],
          },
          'This allowed the visual design to translate into a practical marketing website rather than remaining a static concept.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'The project resulted in a B2B SaaS landing page that combined product storytelling, visual design, and conversion experimentation.',
          'More importantly, the design decisions weren’t based entirely on subjective preference. The A/B test demonstrated that visitors responded better to a more direct explanation of the product and its benefits. This gave the team a clearer direction for future iterations of the website.',
        ],
      },
      {
        heading: 'What I learned',
        body: [
          {
            sub: {
              heading: 'Clarity beats complexity',
              body: [
                'When the product itself is technically complex, the website doesn’t need to be. The testing showed that first-time visitors responded better when the product’s value was communicated directly rather than conceptually.',
              ],
            },
          },
          {
            sub: {
              heading: 'Design decisions should be testable',
              body: [
                'The A/B test turned a subjective question — which hero feels better? — into a measurable product question.',
              ],
            },
          },
          {
            sub: {
              heading: 'Product and marketing need to work together',
              body: [
                'For B2B SaaS, the website sits between product understanding and business goals. Working closely with product and marketing helped balance technical accuracy with a clear commercial proposition.',
              ],
            },
          },
        ],
      },
    ],
    pullquote:
      'For a complex B2B product, clarity can be more persuasive than sophistication.',
    pullquoteBy: 'What the A/B test showed',
  },
]

export const testimonials = [
  {
    quote:
      'Alex turns vague problems into shipped product. Rare combination of craft and follow-through.',
    name: 'Priya Raman',
    title: 'VP Product, Northwind Labs',
  },
  {
    quote: 'The design system work paid for itself in the first quarter.',
    name: 'Jonas Weber',
    title: 'Engineering Lead',
  },
]

// §5/§6 "Random-things" collage for the About section. Card sub-types come
// from the design system (illustration, photo, quote, badge, stat) and no two
// adjacent cards should be the same type.
//
// `pos` is a percentage box, expressed as a share of the collage grid rather
// than of the page. Cards cluster near the edges and the middle band is left
// clear so the headline stays legible.
//
// This used to be free absolute positioning inside a hardcoded 900px-tall
// wrapper, which produced a large dead zone under the headline and a card that
// collided with the section above. It is now a real CSS grid: `pos` is resolved
// into grid placement, so the collage sizes itself to its content and the
// percentage boxes describe a proportion rather than a position on an
// arbitrarily sized canvas. Mobile ignores placement entirely and stacks the
// cards two-up in array order.
export const collage = [
  // Placement is explicit grid coordinates against a 12-column, 4-row grid.
  // The headline holds columns 1-6 across rows 1-2; the cards fill the rest.
  //
  // Every card declares `rowSpan: 1` even where a taller card would look better
  // spanning two rows. With `auto-rows-min` a two-row span reports its height
  // to neither row, so the row it shares collapses and the next row's cards
  // overlap it. Uneven card heights within a row are the intended texture.
  //
  // These used to describe Fieldnote, Kern and Pulse, which are no longer case
  // studies, so they now carry facts from the two that are. All of it is
  // placeholder — replace freely, nothing here is validated.
  {
    type: 'stat',
    figure: '2 of 3',
    label: 'users confused by the budgeting entry screen',
    fill: 'ink',
    at: { col: 8, row: 1, colSpan: 3 },
    rotate: -3,
  },
  {
    type: 'illustration',
    title: 'Doodle: architecture map',
    caption: 'Accounts → budgets',
    fill: 'surface',
    at: { col: 11, row: 1, colSpan: 2 },
    rotate: 2,
  },
  {
    type: 'badge',
    label: 'Shipped it',
    detail: 'Budgeting, from zero',
    fill: 'accent',
    at: { col: 8, row: 2, colSpan: 3 },
    rotate: 3,
  },
  {
    type: 'photo',
    title: 'Workshop wall',
    caption: 'Journey map, week 2',
    fill: 'sky',
    image: null,
    // No real photograph yet, so this renders a labelled slot. Drop a file in
    // public/ and set the path here and it becomes a real image.
    photoLabel: 'Photo of the research workshop wall',
    at: { col: 11, row: 2, colSpan: 2 },
    rotate: -2,
  },
  // Full-width band.
  {
    type: 'quote',
    quote: 'Persistent aerial observation.',
    name: 'ARASTELLE, in one line',
    fill: 'sand',
    at: { col: 1, row: 3, colSpan: 4 },
    rotate: -2,
  },
  {
    type: 'stat',
    figure: '100 m',
    label: 'BASTION ISR operating height',
    fill: 'terracotta',
    at: { col: 5, row: 3, colSpan: 2 },
    rotate: 2,
  },
  {
    type: 'badge',
    label: 'Under NDA',
    detail: 'Some details withheld',
    fill: 'sand',
    at: { col: 7, row: 3, colSpan: 2 },
    rotate: 3,
  },
  {
    type: 'photo',
    title: 'BASTION ISR',
    caption: 'Tethered ISR system',
    fill: 'sky',
    image: null,
    photoLabel: 'Product photo of the BASTION ISR tethered drone system',
    at: { col: 9, row: 3, colSpan: 4 },
    rotate: -3,
  },
  {
    type: 'illustration',
    title: 'Doodle: use-case map',
    caption: 'Defense → first response',
    fill: 'surface',
    at: { col: 1, row: 4, colSpan: 4 },
    rotate: 2,
  },
  {
    type: 'quote',
    quote: 'The task worked. The entry point did not.',
    name: 'Groshi, usability test',
    fill: 'ink',
    at: { col: 5, row: 4, colSpan: 8 },
    rotate: -2,
  },
]

export function getProject(slug) {
  return projects.find((p) => p.slug === slug)
}

export function getAdjacentProjects(slug) {
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: projects[(i - 1 + projects.length) % projects.length] ?? null,
    next: projects[(i + 1) % projects.length] ?? null,
  }
}
