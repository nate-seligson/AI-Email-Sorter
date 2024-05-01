import { GoogleGenerativeAI } from "@google/generative-ai";
fetch("api-key.txt")
  .then((res) => res.text())
  .then((text) => {
    const API_KEY = text;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const info = document.getElementById("info")
    var xhr = new XMLHttpRequest();
    let emails = []
    let emailLength = ""
    xhr.onreadystatechange = function() {
      if(xhr.responseText.length > 5 && emails.length == 0){
        emails = xhr.responseText.split("~||~");
        emailLength = emails.length.toString()
        if(emails.length > 20){
          emailLength = "20+"
          emails = emails.slice(0,19)
        }
        info.innerHTML = ("gotten " + emailLength + " new emails...")
        run(emails)
      }
    };
    xhr.open("GET", "./cgi-bin/index.cgi", true);
    xhr.send()
    let taskslist = []
    let taskEmailDict = {}
    async function run(emails) {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro", temperature: 0.9});
        for(var i = 0; i<emails.length; i++){
          const prompt = "Take an input of an email and rate it on a scale of 0-100 on how urgent it is to respond to, and summarize it including the sender in 10 words or less Format it like this: Input: Read new york times and get 20% off your next subscription! Output: [0, \"Spam from New York Times\"] Input: Congratiolations on your acceptace to our school Output: [99, \"College acceptance letter\"], Input: Hello, just RSVPing to remind you that this internship expires in two days. Output: [91, \"Internship offer that expires in two days\"], Input: Hi, can we schedule a meeting this week? I want to talk to you about xyz. Output: [86, \"Meeting schediling for this week\"] Input: English teacher posted a new assignment due in 5 weeks. Output: [31, \"English Assignment due in 5 weeks\"], Input: Please read the signup sheet to signup for Math AP Meetings. Output: [57, \"AP Meeting Signup from Math Teacher\"], but make it clearly based on the input email. Emphasize things that are sent by real humans, scheduling things etc, and reponses, and vitally important info, and de-emphasize spam. Here is the email you have to summarize:" + emails[i]
        
          const result = await model.generateContent(prompt);
          const response = await result.response;
          let text = ""
          try{text = response.text();}
          catch{continue}
          try{
          taskslist.push(JSON.parse(text))
          taskEmailDict[JSON.parse(text)] = emails[i]
          }
          catch{console.log(text)}
          info.innerHTML = ("gotten " + emailLength + " new emails--") + "\n Loading..." + (i/emails.length) * 100 + "%"
        }
        info.style.display = "none"
        taskslist.sort((a,b) => b[0]-a[0]);
        taskslist.forEach(function(task){
          const txt = document.createElement("h1")
          txt.innerHTML = task[1]
          txt.style.backgroundColor = lerpColor(task[0] / 100)
          txt.className = "task"
          let body = document.createElement("p")
          body.className = "innertext"
          body.innerHTML = taskEmailDict[task]
          txt.appendChild(body)
          document.getElementById("stuff").appendChild(txt);
          txt.addEventListener("click", function(){
            if(txt.className == "task open"){
              txt.className = "task close"
            }
            else{
              txt.className = "task open"
            }
          })
        })
      }
    //taken from https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
    function lerpColor(amount) { 
        const a = "#fca874"
        const b = "#3d1c12"
        var ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);

        return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
    }
})