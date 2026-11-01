export const syllabus = {
    elementary1: {
        title: "Elementary 1-1",
        range: "Lessons 1–12",
        lessons: [
            {
                id: 1,
                japanese: "第1課",
                title: "Introducing Yourself",
                conversation: "初めまして",
                patterns: [
                    "わたしはマイク・ミラーです。",
                    "サントスさんは学生じゃありません。",
                    "ミラーさんは会社員ですか。",
                    "サントスさんも、会社員です。"
                ],
                grammar: [
                    "は",
                    "です",
                    "じゃありません",
                    "か",
                    "も",
                    "Basic sentence structure",
                    "Introducing yourself"
                ],
                objectives: [
                    "Introduce yourself in Japanese.",
                    "Identify people and occupations.",
                    "Ask and answer simple questions."
                ],
                vocabulary: [
                    ["わたし", "watashi", "I"],
                    ["あなた", "anata", "You"],
                    ["学生", "gakusei", "Student"],
                    ["先生", "sensei", "Teacher"],
                    ["会社員", "kaishain", "Company employee"],
                    ["医者", "isha", "Doctor"],
                    ["日本人", "nihonjin", "Japanese person"],
                    ["名前", "namae", "Name"],
                    ["はい", "hai", "Yes"],
                    ["いいえ", "iie", "No"]
                ],
                quiz: [
                    {
                        q: "Which particle marks the topic?",
                        options: ["を", "は", "に", "で"],
                        answer: 1,
                        explanation: "は marks the topic of a sentence."
                    },
                    {
                        q: "What does 学生 mean?",
                        options: ["Teacher", "Doctor", "Student", "Company"],
                        answer: 2,
                        explanation: "学生 (gakusei) means student."
                    },
                    {
                        q: "Choose the correct meaning of です.",
                        options: ["Is/am/are", "Not", "Where", "What"],
                        answer: 0,
                        explanation: "です is a polite copula."
                    },
                    {
                        q: "Which expression means 'No'?",
                        options: ["はい", "いいえ", "そう", "です"],
                        answer: 1,
                        explanation: "いいえ means no."
                    },
                    {
                        q: "What does じゃありません express?",
                        options: ["Past", "Negative", "Question", "Possession"],
                        answer: 1,
                        explanation: "じゃありません is the polite negative form."
                    }
                ]
            },

            {
                id: 2,
                japanese: "第2課",
                title: "This, That and Possession",
                conversation: "これからお世話になります",
                patterns: [
                    "これは、辞書です。",
                    "それはわたしの本です。",
                    "この本はわたしのです。"
                ],
                grammar: [
                    "これ",
                    "それ",
                    "あれ",
                    "この",
                    "その",
                    "あの",
                    "の",
                    "Demonstratives",
                    "Possession"
                ],
                objectives: [
                    "Identify objects.",
                    "Use demonstratives.",
                    "Express possession."
                ],
                vocabulary: [
                    ["本", "hon", "Book"],
                    ["辞書", "jisho", "Dictionary"],
                    ["雑誌", "zasshi", "Magazine"],
                    ["新聞", "shinbun", "Newspaper"],
                    ["ノート", "nooto", "Notebook"],
                    ["鉛筆", "enpitsu", "Pencil"],
                    ["時計", "tokei", "Clock / Watch"],
                    ["かばん", "kaban", "Bag"],
                    ["鍵", "kagi", "Key"],
                    ["名刺", "meishi", "Business card"]
                ],
                quiz: [
                    {
                        q: "Which means 'this'?",
                        options: ["これ", "それ", "あれ", "どれ"],
                        answer: 0,
                        explanation: "これ refers to something near the speaker."
                    },
                    {
                        q: "What does 本 mean?",
                        options: ["Pen", "Book", "Clock", "Bag"],
                        answer: 1,
                        explanation: "本 (hon) means book."
                    },
                    {
                        q: "Which particle indicates possession?",
                        options: ["は", "を", "の", "で"],
                        answer: 2,
                        explanation: "の connects nouns and can express possession."
                    },
                    {
                        q: "Which means 'that' near the listener?",
                        options: ["これ", "それ", "あれ", "ここ"],
                        answer: 1,
                        explanation: "それ refers to something near the listener."
                    },
                    {
                        q: "Which word is used before a noun?",
                        options: ["これ", "それ", "この", "あれ"],
                        answer: 2,
                        explanation: "この must be followed by a noun."
                    }
                ]
            },

            {
                id: 3,
                japanese: "第3課",
                title: "Places and Locations",
                conversation: "これをください。",
                patterns: [
                    "ここは食堂です。",
                    "エレベーターはあそこです。"
                ],
                grammar: [
                    "ここ",
                    "そこ",
                    "あそこ",
                    "どこ",
                    "こちら",
                    "そちら",
                    "Location expressions"
                ],
                objectives: [
                    "Identify locations.",
                    "Ask where something is.",
                    "Ask for items politely."
                ],
                vocabulary: [
                    ["ここ", "koko", "Here"],
                    ["そこ", "soko", "There"],
                    ["あそこ", "asoko", "Over there"],
                    ["どこ", "doko", "Where"],
                    ["食堂", "shokudou", "Dining hall"],
                    ["教室", "kyoushitsu", "Classroom"],
                    ["会社", "kaisha", "Company"],
                    ["学校", "gakkou", "School"]
                ]
            },

            {
                id: 4,
                japanese: "第4課",
                title: "Time and Daily Routine",
                conversation: "そちらは何時までですか。",
                patterns: [
                    "4時5分です。",
                    "わたしは毎朝6時に起きます。"
                ],
                grammar: [
                    "Time expressions",
                    "Hours and minutes",
                    "に for time",
                    "ます",
                    "ません",
                    "Daily routine"
                ]
            },

            {
                id: 5,
                japanese: "第5課",
                title: "Going Places",
                conversation: "この電車は甲子園へ行きますか。",
                patterns: [
                    "わたしは京都へ行きます。",
                    "わたしはタクシーでうちへ帰ります。",
                    "わたしは家族と日本へ来ました。"
                ],
                grammar: [
                    "へ",
                    "で",
                    "と",
                    "行きます",
                    "来ます",
                    "帰ります",
                    "Transportation",
                    "Destinations"
                ]
            },

            {
                id: 6,
                japanese: "第6課",
                title: "Everyday Activities",
                conversation: "いっしょに行きませんか。",
                patterns: [
                    "わたしは本を読みます。",
                    "わたしは駅で新聞を買います。",
                    "いっしょに神戸へ行きませんか。",
                    "ちょっと休みましょう。"
                ],
                grammar: [
                    "を",
                    "Action verbs",
                    "ませんか",
                    "ましょう",
                    "Invitations",
                    "Daily activities"
                ]
            },

            {
                id: 7,
                japanese: "第7課",
                title: "Giving and Receiving",
                conversation: "いらっしゃい。",
                patterns: [
                    "わたしは、パソコンで映画を見ます。",
                    "わたしは木村さんに花をあげます。",
                    "わたしはカリナさんにチョコレートをもらいました。",
                    "わたしはもうメールを送りました。"
                ],
                grammar: [
                    "で as a means",
                    "に as a recipient",
                    "あげます",
                    "もらいます",
                    "Past polite verbs",
                    "もう"
                ]
            },

            {
                id: 8,
                japanese: "第8課",
                title: "Describing Things",
                conversation: "そろそろ失礼します。",
                patterns: [
                    "桜はきれいです。",
                    "富士山は高いです。",
                    "桜はきれいな花です。",
                    "富士山は高い山です。"
                ],
                grammar: [
                    "い-adjectives",
                    "な-adjectives",
                    "Adjective modification",
                    "Describing objects and places"
                ]
            },

            {
                id: 9,
                japanese: "第9課",
                title: "Likes and Preferences",
                conversation: "残念ですが。",
                patterns: [
                    "わたしはイタリア料理が好きです。",
                    "わたしは日本語が少しわかります。",
                    "きょうは子どもの誕生日ですから、早く帰ります。"
                ],
                grammar: [
                    "好きです",
                    "嫌いです",
                    "わかります",
                    "から",
                    "Preferences",
                    "Reasons"
                ]
            },

            {
                id: 10,
                japanese: "第10課",
                title: "Existence and Locations",
                conversation: "ナンプラー、ありますか。",
                patterns: [
                    "あそこにコンビニがあります。",
                    "ロビーに佐藤さんがいます。",
                    "東京ディズニーランドは千葉県にあります。",
                    "家族はニューヨークにいます。"
                ],
                grammar: [
                    "あります",
                    "います",
                    "に",
                    "が",
                    "Locations",
                    "Existence"
                ]
            },

            {
                id: 11,
                japanese: "第11課",
                title: "Counters and Frequency",
                conversation: "これ、お願いします。",
                patterns: [
                    "会議室にテーブルが1つあります。",
                    "わたしは月に2回映画を見ます。"
                ],
                grammar: [
                    "Japanese counters",
                    "つ",
                    "Frequency expressions",
                    "回",
                    "Quantities"
                ]
            },

            {
                id: 12,
                japanese: "第12課",
                title: "Past Tense and Comparisons",
                conversation: "祇園祭はどうでしたか。",
                patterns: [
                    "きのうは雨でした。",
                    "きのうは寒かったです。",
                    "北海道は九州より大きいです。",
                    "わたしは1年で夏がいちばん好きです。"
                ],
                grammar: [
                    "Past tense of です",
                    "Past adjective forms",
                    "Comparisons",
                    "より",
                    "いちばん",
                    "Weather and seasons"
                ]
            }
        ],
        reviews: ["復習A", "復習B", "復習C"]
    },

    elementary2: {
        title: "Elementary 1-2",
        range: "Lessons 13–25",
        lessons: [
            {
                id: 13,
                japanese: "第13課",
                title: "Expressing Desires",
                conversation: "別々にお願いします。",
                patterns: [
                    "わたしは肉が食べたいです。",
                    "わたしはすしを食べたいです。",
                    "わたしはフランスへ料理を習いに行きます。"
                ],
                grammar: ["たいです", "に行きます", "Expressing desires", "Purpose of movement"]
            },
            {
                id: 14,
                japanese: "第14課",
                title: "Requests and Te-form",
                conversation: "みどり町までお願いします。",
                patterns: [
                    "ちょっと待ってください。",
                    "荷物を持ちましょうか。",
                    "ミラーさんは電話をかけています。"
                ],
                grammar: ["て-form", "てください", "ています", "ましょうか"]
            },
            {
                id: 15,
                japanese: "第15課",
                title: "Permission and Possession",
                conversation: "ご家族は?",
                patterns: [
                    "写真を撮ってもいいですか。",
                    "サントスさんは電子辞書を持っています。"
                ],
                grammar: ["てもいいですか", "Asking permission", "持っています"]
            },
            {
                id: 16,
                japanese: "第16課",
                title: "Connecting Sentences",
                conversation: "使い方を教えてください。",
                patterns: [
                    "部屋を掃除して、シャワーを浴びて、それから出かけます。",
                    "大阪は食べ物がおいしいです。",
                    "この部屋は広くて、明るいです。"
                ],
                grammar: ["Te-form connections", "Adjective connections", "それから"]
            },
            {
                id: 17,
                japanese: "第17課",
                title: "Rules and Obligations",
                conversation: "どうしましたか。",
                patterns: [
                    "薬を飲まないでください。",
                    "パスポートを見せなければなりません。",
                    "日曜日は早く起きなくてもいいです。"
                ],
                grammar: ["ないでください", "なければなりません", "なくてもいいです"]
            },
            {
                id: 18,
                japanese: "第18課",
                title: "Abilities and Hobbies",
                conversation: "趣味は何ですか。",
                patterns: [
                    "ミラーさんはテニスをすることができます。",
                    "わたしの趣味は映画を見ることです。",
                    "寝るまえに、日記を書きます。"
                ],
                grammar: ["Dictionary form", "ことができます", "ことです", "まえに"]
            },
            {
                id: 19,
                japanese: "第19課",
                title: "Experiences and Changes",
                conversation: "ダイエットはあしたから。",
                patterns: [
                    "相撲を見たことがあります。",
                    "休みの日はテニスをしたり、散歩に行ったりします。",
                    "これからだんだん暖かくなります。"
                ],
                grammar: ["たことがあります", "たり", "なります"]
            },
            {
                id: 20,
                japanese: "第20課",
                title: "Casual Japanese",
                conversation: "いっしょに行かない?",
                patterns: [
                    "サントスさんはパーティーに来なかった。",
                    "東京は人が多い。",
                    "沖縄の海はきれいだった。",
                    "きょうはミラーさんの誕生日だ。"
                ],
                grammar: ["Plain forms", "Casual negative", "Casual past", "Casual invitations"]
            },
            {
                id: 21,
                japanese: "第21課",
                title: "Opinions and Quotations",
                conversation: "わたしもそう思います。",
                patterns: [
                    "わたしはあした雨が降ると思います。",
                    "わたしは父に留学したいと言いました。",
                    "疲れたでしょう?"
                ],
                grammar: ["と思います", "と言います", "でしょう"]
            },
            {
                id: 22,
                japanese: "第22課",
                title: "Describing Nouns",
                conversation: "どんな部屋をお探しですか。",
                patterns: [
                    "これはミラーさんが作ったケーキです。",
                    "あそこにいる人はミラーさんです。",
                    "買い物に行く時間がありません。"
                ],
                grammar: ["Relative clauses", "Verb modification", "Noun modification"]
            },
            {
                id: 23,
                japanese: "第23課",
                title: "Conditions and Directions",
                conversation: "どうやって行きますか。",
                patterns: [
                    "図書館で本を借りるとき、カードが要ります。",
                    "このボタンを押すと、お釣りが出ます。"
                ],
                grammar: ["とき", "Conditional と", "Instructions", "Directions"]
            },
            {
                id: 24,
                japanese: "第24課",
                title: "Giving and Receiving Actions",
                conversation: "手伝いに行きましょうか。",
                patterns: [
                    "佐藤さんはわたしにチョコレートをくれました。",
                    "わたしは山田さんにレポートを直してもらいました。",
                    "母はわたしにセーターを送ってくれました。",
                    "わたしは、木村さんに傘を貸してあげました。"
                ],
                grammar: ["くれます", "てもらいます", "てくれます", "てあげます"]
            },
            {
                id: 25,
                japanese: "第25課",
                title: "Conditional Expressions",
                conversation: "いろいろお世話になりました。",
                patterns: [
                    "雨が降ったら、出かけません。",
                    "雨が降っても、出かけます。"
                ],
                grammar: ["たら", "ても", "Conditional sentences", "Expressing contrast"]
            }
        ],
        reviews: ["復習D", "復習E", "復習F", "総復習", "復習G"]
    }
};

export const allLessons = [
    ...syllabus.elementary1.lessons,
    ...syllabus.elementary2.lessons
];

export const introductorySections = [
    {
        id: "pronunciation",
        japanese: "日本語の発音",
        title: "Japanese Pronunciation",
        description: "Learn Japanese vowels, sounds and pronunciation."
    },
    {
        id: "classroom",
        japanese: "教室のことば",
        title: "Classroom Expressions",
        description: "Essential expressions used in Japanese classrooms."
    },
    {
        id: "greetings",
        japanese: "毎日のあいさつと会話表現",
        title: "Everyday Greetings",
        description: "Learn everyday Japanese greetings and expressions."
    },
    {
        id: "numbers",
        japanese: "数字",
        title: "Japanese Numbers",
        description: "Learn Japanese numbers and counting."
    }
];

export const studyPlan = [
    { day: 1, target: "Japanese writing systems", lessons: [], task: "Introduction to Hiragana and Katakana" },
    { day: 2, target: "Japanese pronunciation", lessons: [], task: "Learn vowels and pronunciation" },
    { day: 3, target: "Classroom expressions and greetings", lessons: [], task: "Practice introductory expressions" },
    ...Array.from({ length: 25 }, (_, i) => ({
        day: i + 4,
        target: `Study Lesson ${i + 1}`,
        lessons: [i + 1],
        task: `Learn Lesson ${i + 1} grammar and vocabulary`
    })),
    { day: 29, target: "Review A–G", lessons: [], task: "Revise grammar and vocabulary" },
    { day: 30, target: "Final revision", lessons: [], task: "Complete a THALIR mock examination" }
];
