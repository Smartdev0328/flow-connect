import {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"



export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState("");
  const [riskScore, setRiskScore] = useState("");
  useEffect(() => fcl.currentUser().subscribe(setCurrentUser), [])
  useEffect(()=>{
    if(currentUser){
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");

      var raw = "{\r\n  \"sc_address\": \"0x57f5347d90df81a2\",\r\n  \"domain\": \"inconfido.com\"\r\n}";
      //var raw = `{\r\n  \"sc_address\": \${currentUser.addr},\r\n  \"domain\": \${window.location.href}\r\n}`;

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      fetch("/api", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result)
          const tmpScore = JSON.parse(result).risk_score;
          const tmpCategory = JSON.parse(result).risk_category.split(".")[1];
          setRiskScore(tmpScore+tmpCategory)         
        })
        .catch(error => console.log('error', error));
          }
  },[currentUser])
  return {currentUser,riskScore}
}
