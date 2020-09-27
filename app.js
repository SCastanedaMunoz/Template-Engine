const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { constants } = require("buffer");

const teamMembers = [];

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

console.log("\x1b[36m","Starting Template Engine, Answer the Following Questions");
getTeamInfo()
.then(value => console.log(render(value)));

function getTeamInfo() {
    return new Promise(function (resolve, reject) {
        let role = "";

        const roleQuestion = {
            type: "list",
            message: "Choose the Team Member Role:",
            name: "role",
            choices: [
                { name: "Intern", value: "Intern"},
                { name: "Engineer", value: "Engineer"},
                { name: "Manager", value: "Manager"},
            ]
        };

        inquirer
        .prompt(roleQuestion)
        .then(response => {
            role = response.role;
            return inquirer.prompt(getRoleBasedQuestions(role));
        })
        .then(roleBasedResponse => {
            teamMembers.push(getTeamMember(role, roleBasedResponse));

            const addAnotherQuestion = {
                type: "list",
                message: "Would You Like to Add Another Team Member?",
                name: "addMore",
                choices: [
                    { name: "Yes", value: "Yes"},
                    { name: "No", value: "No"},
                ]
            }

            return inquirer.prompt(addAnotherQuestion);      
        })
        .then(response => {
            switch(response.addMore) {
                case "Yes":
                    return getTeamInfo().then(value => resolve(value));
                case "No":
                    return resolve(teamMembers);
            }
        });

        function getRoleBasedQuestions(role) {
            const idMessage = `Enter the ${role}'s ID`;
            const nameMessage = `Enter the ${role}'s Name`;
            const emailMessage = `Enter the ${role}'s Email Address`;

            const baseQuestions = [
                {
                    type: "input",
                    message: idMessage,
                    name: "id"
                },
                {
                    type: "input",
                    message: nameMessage,
                    name: "name"
                },
                {
                    type: "input",
                    message: emailMessage,
                    name: "email"
                },
            ];

            switch(role) {
                case "Intern":
                    return [
                        ...baseQuestions,
                        {
                            type: "input",
                            message: "Enter the Intern's School",
                            name: "school"
                        }
                    ];
                case "Engineer":
                    return [
                        ...baseQuestions, 
                        {
                            type: "input",
                            message: "Enter the Engineer's GitHub",
                            name: "github"
                        }
                    ];
                case "Manager":
                    return [
                        ...baseQuestions,
                        {
                            type: "input",
                            message: "Enter the Manager's Office Number",
                            name: "officeNumber"
                        }
                    ];
                default:
                    reject(Error(`Undefined Role: ${role} Selected, Please Send Stack Trace and Create Issue at: https://github.com/SCastanedaMunoz/Template-Engine/issues`));
            }
        }

        function getTeamMember(role, values) {
            switch(role) {
                case "Intern":
                    return new Intern(values.name, values.id, values.email, values.school);
                case "Engineer":
                    return new Engineer(values.name, values.id, values.email, values.github);
                case "Manager":
                    return new Manager(values.name, values.id, values.email, values.officeNumber);
                default:
                    reject(Error(`Undefined Role: ${role} Selected, With Response: ${JSON.stringify(values)} Please Send Stack Trace and Create Issue at: https://github.com/SCastanedaMunoz/Template-Engine/issues`));
            }
        }
    });
}