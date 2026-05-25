
const courses = {
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
    }
};

export default courses;
