export const courses = {
    // 1. ELECTRICAL
    "electrical": {
        id: "electrical",
        title: "Electrical Wiring Basics",
        description: "Master the fundamentals of residential electrical systems, safety, and wiring.",
        thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop",
        lessons: [
            { _id: "e1", title: "Installing a junction box and pulling wire", videoUrl: "https://www.youtube.com/watch?v=a-Irur6QkI4&list=PLfZcU0E-cRgAiN6udrWd2LvUnUX7zet0y&index=1", duration: "10:00", completed: false },
            { _id: "e2", title: "Cutting, Stripping and Connecting wire", videoUrl: "https://www.youtube.com/watch?v=62C1yf2XLy8&list=PLfZcU0E-cRgAiN6udrWd2LvUnUX7zet0y&index=2", duration: "15:00", completed: false },
            { _id: "e3", title: "Wire to Wire Splices", videoUrl: "https://www.youtube.com/watch?v=9eq9TlGZxD0&list=PLfZcU0E-cRgAiN6udrWd2LvUnUX7zet0y&index=3", duration: "12:00", completed: false },
            { _id: "e4", title: "Connecting Wire to a terminal Connection", videoUrl: "https://www.youtube.com/watch?v=eVptjWglOac&list=PLfZcU0E-cRgAiN6udrWd2LvUnUX7zet0y&index=4", duration: "08:00", completed: false },
            { _id: "e5", title: "How to Install an outlet at end of circuit", videoUrl: "https://www.youtube.com/watch?v=ExIvu5KN3X0&list=PLfZcU0E-cRgAiN6udrWd2LvUnUX7zet0y&index=5", duration: "14:00", completed: false }
        ],
        quiz: {
            _id: "quiz_electrical",
            title: "Electrical Safety Quiz",
            questions: [
                {
                    _id: "q1",
                    questionText: "What is the main purpose of residential electrical wiring in a house?",
                    options: [
                        { text: "To decorate the walls", isCorrect: false },
                        { text: "To distribute electrical power safely to outlets and appliances", isCorrect: true },
                        { text: "To keep the house warm", isCorrect: false },
                        { text: "To reduce electricity bills", isCorrect: false }
                    ]
                },
                {
                    _id: "q2",
                    questionText: "Which two wires normally carry current in a basic home circuit?",
                    options: [
                        { text: "Live (hot) and neutral", isCorrect: true },
                        { text: "Live (hot) and earth", isCorrect: false },
                        { text: "Neutral and earth", isCorrect: false },
                        { text: "Phase and shield", isCorrect: false }
                    ]
                },
                {
                    _id: "q3",
                    questionText: "Why is grounding (earthing) important in a residential electrical system?",
                    options: [
                        { text: "It makes lights brighter", isCorrect: false },
                        { text: "It reduces the electricity bill", isCorrect: false },
                        { text: "It provides a safe path for fault current and helps prevent electric shock", isCorrect: true },
                        { text: "It increases the voltage in the circuit", isCorrect: false }
                    ]
                },
                {
                    _id: "q4",
                    questionText: "What is the role of the main service panel (breaker box) in a home?",
                    options: [
                        { text: "To store extra wires", isCorrect: false },
                        { text: "To convert AC power to DC", isCorrect: false },
                        { text: "To distribute power to different circuits and protect them with breakers or fuses", isCorrect: true },
                        { text: "To measure electricity usage for billing", isCorrect: false }
                    ]
                },
                {
                    _id: "q5",
                    questionText: "Why should power always be turned off at the main breaker before doing any wiring work?",
                    options: [
                        { text: "To save time during work", isCorrect: false },
                        { text: "To keep tools from overheating", isCorrect: false },
                        { text: "To avoid electric shock and reduce the risk of fire while working on the circuit", isCorrect: true },
                        { text: "To make wires easier to see", isCorrect: false }
                    ]
                }
            ]
        }
    },

    // 2. PLUMBING
    "plumbing": {
        id: "plumbing",
        title: "Plumbing Essentials",
        description: "Learn to fix leaks, install pipes, and understand drainage systems.",
        thumbnail: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2670&auto=format&fit=crop",
        lessons: [
            { _id: "p1", title: "A lesson about some of the basic hand tools used in plumbing", videoUrl: "https://www.youtube.com/watch?v=V_SzExu2aV0&list=PLfZcU0E-cRgAbjixpnXDVfcC68WwLQoQB&index=2", duration: "08:00", completed: false },
            { _id: "p2", title: "Let's learn about a couple of plumbing power tools", videoUrl: "https://www.youtube.com/watch?v=RxorPsoJSUo&list=PLfZcU0E-cRgAbjixpnXDVfcC68WwLQoQB&index=3", duration: "10:00", completed: false },
            { _id: "p3", title: "A lesson about copper plumbing materials", videoUrl: "https://www.youtube.com/watch?v=0IzI8N7SkBY&list=PLfZcU0E-cRgAbjixpnXDVfcC68WwLQoQB&index=4", duration: "07:00", completed: false },
            { _id: "p4", title: "A lesson about plumbing with copper in a basic plumbing system", videoUrl: "https://www.youtube.com/watch?v=cfP8rCfc7qE", duration: "12:00", completed: false },
            { _id: "p5", title: "A lesson about iron pipe as a plumbing material", videoUrl: "https://www.youtube.com/watch?v=3uftD1t38iU", duration: "11:00", completed: false }
        ],
        quiz: {
            _id: "quiz_plumbing",
            title: "Plumbing Basics Quiz",
            questions: [
                {
                    _id: "q1",
                    questionText: "What is the main purpose of a plumbing system in a building?",
                    options: [
                        { text: "To cool the rooms", isCorrect: false },
                        { text: "To supply fresh water and remove wastewater safely", isCorrect: true },
                        { text: "To provide electricity", isCorrect: false },
                        { text: "To support the structure", isCorrect: false }
                    ]
                },
                {
                    _id: "q2",
                    questionText: "Which of the following is a main component of a residential plumbing system?",
                    options: [
                        { text: "Water supply system", isCorrect: true },
                        { text: "Lighting system", isCorrect: false },
                        { text: "Air conditioning unit", isCorrect: false },
                        { text: "Solar panel", isCorrect: false }
                    ]
                },
                {
                    _id: "q3",
                    questionText: "What is the function of a trap under a sink?",
                    options: [
                        { text: "To increase water pressure", isCorrect: false },
                        { text: "To store extra water", isCorrect: false },
                        { text: "To hold water and prevent sewer gases from entering the room", isCorrect: true },
                        { text: "To filter drinking water", isCorrect: false }
                    ]
                },
                {
                    _id: "q4",
                    questionText: "Why are vent pipes important in a plumbing system?",
                    options: [
                        { text: "They supply hot water", isCorrect: false },
                        { text: "They allow air into the system to maintain pressure and help drainage", isCorrect: true },
                        { text: "They store wastewater", isCorrect: false },
                        { text: "They cool the pipes", isCorrect: false }
                    ]
                },
                {
                    _id: "q5",
                    questionText: "Which of the following is commonly used as a piping material in water supply lines?",
                    options: [
                        { text: "Glass", isCorrect: false },
                        { text: "Wood", isCorrect: false },
                        { text: "Copper or PVC", isCorrect: true },
                        { text: "Rubber", isCorrect: false }
                    ]
                }
            ]
        }
    },

    // 3. ENGLISH LANGUAGE
    "english": {
        id: "english",
        title: "Professional English",
        description: "Improve your workplace communication and grammar skills.",
        thumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop",
        lessons: [
            { _id: "eng1_new", title: "Learn New Words With Proverbs and Idioms", videoUrl: "https://www.youtube.com/watch?v=cY-Ofcik_IE&list=PLVLoWQFkZbhW36eDQBQ_tiUtdUmhuElh0&index=2", duration: "10:00", completed: false },
            { _id: "eng2_new", title: "Sentence and Its Parts", videoUrl: "https://www.youtube.com/watch?v=VM7B93JdiA0&list=PLVLoWQFkZbhW36eDQBQ_tiUtdUmhuElh0&index=3", duration: "10:00", completed: false },
            { _id: "eng3_new", title: "Let's Talk - Conversation Practice", videoUrl: "https://www.youtube.com/watch?v=YOsnQB1oCA4&list=PLVLoWQFkZbhW36eDQBQ_tiUtdUmhuElh0&index=4", duration: "10:00", completed: false },
            { _id: "eng4_new", title: "Common Pronunciation Mistakes", videoUrl: "http://youtube.com/watch?v=Ke3GDe4WQo0&list=PLVLoWQFkZbhW36eDQBQ_tiUtdUmhuElh0&index=5", duration: "10:00", completed: false },
            { _id: "eng5_new", title: "Parts of Speech", videoUrl: "https://www.youtube.com/watch?v=6mdwDfaVl_M&list=PLVLoWQFkZbhW36eDQBQ_tiUtdUmhuElh0&index=8", duration: "10:00", completed: false }
        ],
        quiz: {
            _id: "quiz_english",
            title: "English Proficiency Quiz",
            questions: [
                {
                    _id: "q1",
                    questionText: "Which subject line is most appropriate for a formal business email?",
                    options: [
                        { text: "“Hi”", isCorrect: false },
                        { text: "“Important”", isCorrect: false },
                        { text: "“Regarding Tomorrow’s Client Meeting”", isCorrect: true },
                        { text: "“ASAP!!!”", isCorrect: false }
                    ]
                },
                {
                    _id: "q2",
                    questionText: "Which greeting is best for a professional email to a person you have not met?",
                    options: [
                        { text: "“Hey buddy,”", isCorrect: false },
                        { text: "“Dear Sir/Madam,”", isCorrect: true },
                        { text: "“Yo,”", isCorrect: false },
                        { text: "No greeting, start directly", isCorrect: false }
                    ]
                },
                {
                    _id: "q3",
                    questionText: "In a professional setting, which sentence is the most appropriate way to make a request?",
                    options: [
                        { text: "“Send me the report now.”", isCorrect: false },
                        { text: "“I want the report ASAP.”", isCorrect: false },
                        { text: "“Could you please send me the report by 5 p.m.?”", isCorrect: true },
                        { text: "“You didn’t send the report yet!”", isCorrect: false }
                    ]
                },
                {
                    _id: "q4",
                    questionText: "What is the main purpose of using a “CC” field in a professional email?",
                    options: [
                        { text: "To hide recipients", isCorrect: false },
                        { text: "To send a secret copy", isCorrect: false },
                        { text: "To keep other relevant people informed", isCorrect: true },
                        { text: "To make the email look important", isCorrect: false }
                    ]
                },
                {
                    _id: "q5",
                    questionText: "Which closing is most suitable for a formal email to your manager?",
                    options: [
                        { text: "“Cheers”", isCorrect: false },
                        { text: "“Later”", isCorrect: false },
                        { text: "“Yours faithfully”", isCorrect: true },
                        { text: "“See ya”", isCorrect: false }
                    ]
                }
            ]
        }
    },

    // 4. COMPUTER SKILLS
    "computer": {
        id: "computer",
        title: "Computer Literacy",
        description: "Basics of MS Office, Email, and Internet Browsing.",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop",
        lessons: [
            { _id: "comp1", title: "COMPUTER TRAINING FOR BEGINNERS", videoUrl: "https://www.youtube.com/watch?v=fRv5rfHpkO4&list=PLlbNVRepzl0xbASIpf1svqDtYx6_9fDIa&index=1", duration: "10:00", completed: false },
            { _id: "comp2", title: "COMPUTER PORTS", videoUrl: "https://www.youtube.com/watch?v=94X2jWA0-oI", duration: "08:00", completed: false },
            { _id: "comp3", title: "FUNCTIONS OF THE COMPUTER KEYBOARD KEYS", videoUrl: "https://www.youtube.com/watch?v=CIIQE1J-x3M", duration: "12:00", completed: false },
            { _id: "comp4", title: "BEST APPROACH TO ORGANIZE YOUR COMPUTER FILES", videoUrl: "https://www.youtube.com/watch?v=T5mm1trLw7Y", duration: "09:00", completed: false },
            { _id: "comp5", title: "POWERPOINT TRAINING FOR BEGINNERS", videoUrl: "https://www.youtube.com/watch?v=CNx0K5KyUEQ&list=PLlbNVRepzl0xbASIpf1svqDtYx6_9fDIa&index=6", duration: "15:00", completed: false }
        ],
        quiz: {
            _id: "quiz_computer",
            title: "Computer Skills Quiz",
            questions: [
                {
                    _id: "q1",
                    questionText: "Which software in MS Office is mainly used for creating text documents like letters and reports?",
                    options: [
                        { text: "MS PowerPoint", isCorrect: false },
                        { text: "MS Excel", isCorrect: false },
                        { text: "MS Word", isCorrect: true },
                        { text: "MS Access", isCorrect: false }
                    ]
                },
                {
                    _id: "q2",
                    questionText: "Which MS Office application is best suited for calculations and data analysis in tabular form?",
                    options: [
                        { text: "MS Word", isCorrect: false },
                        { text: "MS Excel", isCorrect: true },
                        { text: "MS PowerPoint", isCorrect: false },
                        { text: "MS Outlook", isCorrect: false }
                    ]
                },
                {
                    _id: "q3",
                    questionText: "What is the primary purpose of an email?",
                    options: [
                        { text: "To edit photos", isCorrect: false },
                        { text: "To exchange electronic messages over the internet", isCorrect: true },
                        { text: "To design websites", isCorrect: false },
                        { text: "To install software", isCorrect: false }
                    ]
                },
                {
                    _id: "q4",
                    questionText: "Which of the following is a web browser used for internet browsing?",
                    options: [
                        { text: "MS Word", isCorrect: false },
                        { text: "Google Chrome", isCorrect: true },
                        { text: "MS Excel", isCorrect: false },
                        { text: "PowerPoint", isCorrect: false }
                    ]
                },
                {
                    _id: "q5",
                    questionText: "In a web browser, where do you type a website address (URL)?",
                    options: [
                        { text: "Status bar", isCorrect: false },
                        { text: "Taskbar", isCorrect: false },
                        { text: "Address bar", isCorrect: true },
                        { text: "Title bar", isCorrect: false }
                    ]
                }
            ]
        }
    }
};
