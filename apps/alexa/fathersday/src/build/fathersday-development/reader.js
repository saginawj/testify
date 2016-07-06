var paginationSize = 1;

var issues = {};
issues.index = paginationSize;
var json = JSON.parse(raya);
var count = json.length;
console.log("**EVENT COUNT** ", count);

for(i=0; i<count; i++) {
    issues[i] = json[i].body;
}


var raya = {
    "0": "Raya fact 1.",
    "1": "Created and extended a tax credit worth $10,000 over four years that helps 9 million families cover the cost of college.",
    "2": "Expanded Pell Grants to reach an additional 3 million students and raised the current maximum award to $5,550, up from $4,730 in 2008.",
    "3": "Capped monthly student loan payments for responsible borrowers who make their payments on time so they aren't held back by debt as they start their careers.",
    "4": "Created a model financial aid disclosure form that makes the costs and responsibilities of student loans clear before students enroll in college.",
    "5": "Supported partnerships between community colleges and businesses to train workers with skills local employers need",
    "6": "Launched a College Scorecard to help students and families compare costs, the amount students borrow in loans, and graduation rates among schools and make informed decisions about which college to attend.",
    "7": "Ensure the wealthiest Americans do their fair share by paying at least the same tax rate as middle class families so we can reduce the deficit in a balanced way while preserving investments in education, clean energy, manufacturing, and small businesses.",
    "index": 1
  }