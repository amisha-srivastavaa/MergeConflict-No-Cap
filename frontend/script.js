const API=`${import.meta.env.VITE_API_URL}/scan`;

async function scanSkill() {

    document.getElementById("loading").style.display = "block";
    document.getElementById("result").style.display = "none";

    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;

    try {

        const response = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                description,
                code
            })
        });

        if (!response.ok) {
            throw new Error("Backend returned an error.");
        }

        const data = await response.json();

        document.getElementById("loading").style.display = "none";
        document.getElementById("result").style.display = "block";

        document.getElementById("risk").innerHTML =
            `Risk Score : ${data.risk} (${data.status})`;

        fillList("claims", data.claims);
        fillList("behavior", data.behavior);
        fillList("hidden", data.hidden_behaviors);

        document.getElementById("explanation").innerHTML =
            data.explanation;

    } catch (err) {

        document.getElementById("loading").style.display = "none";
        document.getElementById("result").style.display = "block";

        document.getElementById("risk").innerHTML = "⚠ Error";
        document.getElementById("claims").innerHTML = "";
        document.getElementById("behavior").innerHTML = "";
        document.getElementById("hidden").innerHTML = "";

        document.getElementById("explanation").innerHTML =
            err.message;

    }
}

function fillList(id,list){

    const ul=document.getElementById(id);

    ul.innerHTML="";

    list.forEach(item=>{

        const li=document.createElement("li");

        li.innerHTML=item;

        ul.appendChild(li);

    });

}