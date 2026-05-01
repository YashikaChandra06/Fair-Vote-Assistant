const electionData = {
    "default": {
        "registrationDeadline": "Usually up to the last date of filing nominations",
        "nominationDeadline": "As notified by Election Commission of India (ECI)",
        "campaigningEnds": "48 hours before the end of polling",
        "pollingDay": "To be announced by ECI",
        "countingDay": "Usually a few weeks after the first phase of polling",
        "voterIdRequired": "EPIC (Voter ID) or 11 other specified photo identity documents",
        "steps": [
            "Check your name in the Electoral Roll online at NVSP or Voter Helpline App.",
            "If not registered, fill Form 6 to register as a new voter.",
            "Find your Polling Station and Booth details.",
            "Check candidate affidavits on the ECI KYC app.",
            "Carry your EPIC or other approved photo ID to the polling booth.",
            "Cast your vote via EVM and verify via VVPAT slip."
        ]
    },
    "Maharashtra": {
        "registrationDeadline": "Oct 19, 2024 (for the 2024 Assembly Elections)",
        "nominationDeadline": "Oct 29, 2024",
        "campaigningEnds": "Nov 18, 2024 (48 hours before polling)",
        "pollingDay": "November 20, 2024 (Single Phase)",
        "countingDay": "November 23, 2024",
        "voterIdRequired": "EPIC or approved alternative photo ID",
        "steps": [
            "Verify registration on Chief Electoral Officer (CEO) Maharashtra portal.",
            "Download your Voter Information Slip.",
            "Locate your polling booth using the Voter Helpline App.",
            "Bring your EPIC or approved ID (e.g., Aadhaar, PAN).",
            "Vote securely using EVM."
        ]
    },
    "Jharkhand": {
        "registrationDeadline": "Oct 18, 2024 (for the 2024 Assembly Elections)",
        "nominationDeadline": "Oct 25, 2024 (Phase 1) & Oct 29, 2024 (Phase 2)",
        "campaigningEnds": "48 hours before each polling phase",
        "pollingDay": "November 13 and November 20, 2024 (Two Phases)",
        "countingDay": "November 23, 2024",
        "voterIdRequired": "EPIC or approved alternative photo ID",
        "steps": [
            "Check your status on CEO Jharkhand website.",
            "Identify the phase in which your constituency votes.",
            "Ensure you have a valid photo ID.",
            "Reach your designated polling booth on your phase's polling day."
        ]
    },
    "Delhi": {
        "registrationDeadline": "Expected by Jan 2025 for upcoming Assembly Elections",
        "nominationDeadline": "Expected Jan 2025",
        "campaigningEnds": "48 hours before polling day",
        "pollingDay": "Expected Feb 2025 (Schedule to be announced by ECI)",
        "countingDay": "Expected Feb 2025",
        "voterIdRequired": "EPIC or approved alternative photo ID",
        "steps": [
            "Check registration on CEO Delhi portal.",
            "Locate your polling booth.",
            "Carry your EPIC or approved ID.",
            "Vote using the EVM."
        ]
    }
};

const statesList = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", 
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const faqs = [
    {
        question: "How do I register to vote in India?",
        answer: "You can register online through the Voter Helpline App or the Election Commission's NVSP portal by filling out Form 6. You can also submit it physically to the Electoral Registration Officer."
    },
    {
        question: "Where is my polling booth?",
        answer: "You can find your polling booth on the NVSP portal, the Voter Helpline App, or by checking your Voter Information Slip."
    },
    {
        question: "Can I vote if I don't have my Voter ID (EPIC)?",
        answer: "Yes, if your name is in the electoral roll, you can vote by showing an alternative photo ID approved by the ECI, such as Aadhaar Card, PAN Card, Driving License, or Passport."
    },
    {
        question: "What is an EVM and VVPAT?",
        answer: "EVM stands for Electronic Voting Machine, which is used to cast your vote. VVPAT is the Voter Verifiable Paper Audit Trail, a machine that prints a slip showing the candidate you voted for, allowing you to verify your vote."
    }
];
