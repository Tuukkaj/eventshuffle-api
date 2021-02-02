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
        }
    }
}