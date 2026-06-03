import {useState} from "react";
import axios from "axios";


function box(){
    const [text, setText] = useState("");


    const handleClick = ()=>{
        console.log(text);
        const res = axios.get("http://localhost:4000/ask", { params: { text } });
        res.then((response) => {            console.log("Response from backend:", response.data);
        }).catch((error) => {            console.error("Error from backend:", error);
        });
    }



    return(
        <>
            <div> this is a box</div>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
                <div style={{backgroundColor: "lightgray", padding: "10px", width: "60vw", height: "50vh"}}></div>
                <div>
                    <input type="text" placeholder="enter text here" style={{padding: "10px"}} onChange={(e) => setText(e.target.value)}/>
                    <button style={{padding: "10px"}} onClick={handleClick}> submit </button>
                </div>
            </div>
        </>
)
}

export default box;