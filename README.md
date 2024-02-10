# 🧠💬 Grammar Training App (WIP)

<!-- Welcome to GrammarGenius 🧠💬 -->

> Master the intricacies of English syntax as you build up sentences, word by whimsical word. 🌟📚

🚧 **Note:** This is an ongoing project which I am actively working on. This README provides an insight into how I might typically approach such a greenfield project.

## ℹ️ About <_future_professional_app_name_> 😅

### 🤔 The Problem

- I noticed from (informally) teaching English in Japan that learners have difficulty constructing longer sentences, skip articles like "the", and confuse word order frequently. This is often because their native language does not have similar constructs or may have a more fluid sentence structure than English.

### 💡 The Solution

- A focused grammar training app with a clean UI and a single purpose.

- Users are presented with buttons representing the parts of speech (noun, pronoun, adjective, etc) that are dynamically enabled/disabled depending on whether they can grammatically follow the current word. Once they choose a button, a random word of that type will continue the sentence in the UI.

- Using a random word (or constrained by theme/tense) adds a fun, surprising element to the process which (I hope) will keep users engaged and building more sentences.

- The idea originates from a game me and my partner play on long hikes to pass the time where we take it in turns to say the next word in a sentence. I noticed how she began using longer, more complex sentences after this as if she had internalized some common syntax and general patterns.

### 💰 The Value

- This app aims to help build confidence in constructing longer, syntactically complex sentences, and begin to internalize which types of words typically follow others.

- Increases user's vocabulary.

- It can also serve as entertainment since users may simply enjoy the humorous sentences that are created.

### 👥 The Target

- Primarily non-native English speakers - it will be particularly beneficial for those whose native language has few similarities to English like Japanese, Korean, and Arabic.

- Can also be used for fun by anybody.

## 🌟 Features

- 🏗️ **Word-by-Word Construction:** Build sentences by clicking on labeled buttons for nouns, pronouns, verbs, and other parts of speech.
- 🎲 **Random Words:** Increase your vocabulary as each button produces a random word of that type (definitions on hover).
- ⚙️ **Customizable Syntax:** Tailor the learning experience with options for different tenses, themes, and sentence length.
- 💾 **Save The Best:** Build a history of your most amusing - and syntactically correct - sentences.

## 📐 Wireframes

- These sketches represent the views and functionalities of the app.
- I focused on keeping the UI simple which facilitates a smooth transition from mobile to desktop.
- I will decide on a final theme by playing around with the RadixUI playground feature.
- I didn't use Figma as I find it quicker to iterate on ideas with pen and paper.
- Photos were taken on a kitchen counter. Do with this information what you will. 😅

|                        About and History pages                        |                        Root page and modals                        |
| :-------------------------------------------------------------------: | :----------------------------------------------------------------: |
| ![Wireframe of About and History pages](/docs/images/wireframe0.jpeg) | ![Wireframe of root page and modals](/docs/images/wireframe1.jpeg) |

## 🛠️ Toolkit

- Next.js, Redux, Tailwind, RadixUI, Jest, Cypress
- TypeScript, Nest.js, PostgreSQL, Prisma
- Nx monorepo
- OAuth (Google & GitHub)
- Natural Language Processing library
- Internationalization (users will be non-native speakers so copy should be offered in their native language)
- WordsAPI (vocab definitions)
- REST API
- Docker (deployment)
- Mobile first, responsive web app

I considered using another programming language such as Python but there are still many JavaScript tools I want to learn/show proficiency in, so I decided to stay within that ecosystem.

## 📅 Project Roadmap

1. Craft database schema, design API
2. Scaffold Nx project with Nest.js, Next.js, etc
3. Implement backend first, API testing with Postman, Supertest/Jest
4. Develop a CI pipeline to check code quality and run tests
5. Implement frontend, component tests with Jest
6. Add E2E tests with Cypress
7. Deploy with CD pipeline

## 🧗 Anticipated Challenges

- Writing the complex logic required when determining which parts of speech can follow the current word. I will need an NLP library combined with custom logic.

- Maintaining a consistent project structure to manage complexity if I scale it in the future (adding more features, etc) - this is why I will use a dedicated monorepo tool and opinionated frameworks like Nest.js and Next.js. This will require learning lots of new tools/concepts.

## 🔄 Improvements I Wish To Make From [My Last Project](https://github.com/Thomas-J-A/diet-accountability-app)

- Responsiveness - offer a more polished desktop experience

- Reusable code - components, configs, types, utils, etc (monorepo shared libs)
<!-- form fields, buttons, modals, icons -->

- Keeping designs/code/docs as concise as possible (cleaner approach overall)

- Accessibility - complete keyboard tabbing, accurate screen reading of groups in select dropdown, accessible asterisk marks and footnotes

- Session handling - refresh token flow on expiry, automatic authentication if returning user has a valid token

## 🙏 What I Aim To Learn

- Maintaining a repo which is extensible and which other developers can navigate

- Internationalization and the experience of the web for non-native English speakers (and users with disabilities through accessibility)

- Many modern tools/frameworks (helpful abstractions built upon my foundational knowledge of Node, React, CSS, etc)

<!-- Want to contact me? -->

## 🌈 Some Irreverent Fun

_Absolutely zero context here._

![Zebra aggressively pursuing a big cat](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3BsZzZnejNsZ2E5dmZwOTBwM3o1bjhkdGthdXE4d3p0MzBzdm5hMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yOZ5hsdLjAp8Y/giphy.gif)
