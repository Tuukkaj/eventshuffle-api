module.exports = {
    // Successful event creation without problems
    successfulUseCase: {
        event: {
            name: "Red wedding",
            dates: ["2020-1-1", "2021-1-1", "2022-1-1", "2023-1-1", "2024-1-1"]
        },
        voters: [
            {
                name: "Robb Stark",
                dates: ["2020-1-1", "2021-1-1", "2024-1-1"]
            },
            { 
                name: "Tywin Lannister",
                dates: ["2020-1-1", "2021-1-1"]
            }, 
            { 
                name: "Catelyn Stark",
                dates: ["2020-1-1", "2021-1-1", "2022-1-1"]
            }, 
            { 
                name: "Walder Frey",
                dates: ["2020-1-1", "2021-1-1"]
            }, 
            { 
                name: "Roose Bolton",
                dates: ["2023-1-1", "2020-1-1", "2021-1-1"]
            }
        ],
        suitableDates: ["2020-1-1", "2021-1-1"] // Change these if voter dates or event dates are changed!
    },
    create: {
        success: {
            name: "Coronation of King Robert Baratheon",
            dates: ["2020-1-1", "2021-1-1"]
        },
        noName: {
            dates: ["2020-2-2", "2021-2-2"]
        },
        emptyName: {
            name: "",
            dates: ["2020-2-2", "2021-2-2"]
        },
        noDates: {
            name: "Coronation of King Robert Baratheon",
        },
        emptyDates: {
            name: "Coronation of King Robert Baratheon",
            dates: []
        },
        wrongDateType: {
            name: "Coronation of King Robert Baratheon",
            dates: true
        },
        twoSameDates: {
            name: "Coronation of King Robert Baratheon",
            dates: ["2020-1-1", "2020-1-1"]
        },
        differentDateFormat: {
            name: "Coronation of King Robert Baratheon",
            dates: ["2-2-2020"]
        },
        badDate: {
            name: "Coronation of King Robert Baratheon",
            dates: ["2020-66-66"]
        }
    },
    show: {
        initialItem: {
            name: "Battle of the Blackwater",
            dates: ["2020-12-12", "2020-12-13", "2020-12-14"],
            votes: [
                {
                    "date": "2020-12-12",
                    "people": [
                      "Ghost of Renly Baratheon",
                      "Stannis Baratheon",
                      "Tywin Lannister",
                      "Tyrion Lannister"
                    ]
                },
                {
                    "date": "2020-12-13",
                    "people": [
                        "Joffrey Baratheon",
                        "Hound",
                    ]
                },
                {
                    "date": "2020-12-13",
                    "people": [
                        "Sansa Stark",
                        "Dontos Hollard",
                    ]
                }
            ]
        }
    },
    vote: {
        initialItem: {
            name: "Siege of Riverrun",
            dates: ["2020-12-12", "2020-12-13", "2020-12-14"]
        },
        successVote: {
            name: "Jaime Lannister",
            dates: ["2020-12-12", "2020-12-13", "2020-12-14"]
        },
        voteTwiceName: {
            name: "Edmure Tully",
            dates: ["2020-12-12"]
        },
        voteDateNotInEvent: {
            name: "Blackfish",
            dates: ["1999-12-12"]
        },
        noName: {
            dates: ["2020-12-12"]
        },
        noDate: {
            name: "Ryman Frey"
        },
        twoSameDates: {
            name: "Daven Lannister",
            dates: ["2020-12-12","2020-12-12"]
        }
    },
    result: {
        success: {
            name: "Battle In the Whispering Woods",
            dates: ["2020-1-1", "2021-1-1", "2022-1-1", "2023-1-1", "2024-1-1"],
            votes: [
                {
                    date: "2020-1-1",
                    people: [
                        "Jaime Lannister",
                        "Rob Stark",
                        "Great Jon", 
                        "Brynden Tully"
                    ]
                },
                {
                    date: "2021-1-1",
                    people: [
                        "Jaime Lannister",
                        "Rob Stark",
                        "Great Jon", 
                        "Brynden Tully"
                    ]
                },
                {
                    date: "2024-1-1",
                    people: [
                        "Great Jon", 
                        "Brynden Tully"
                    ]
                }
            ]
        },
        successSuitableDates: ["2020-1-1", "2021-1-1"],
        noVotes: {
            name: "Kingsmoot",
            dates: ["2020-1-1", "2024-1-1"],
        }
    }
}