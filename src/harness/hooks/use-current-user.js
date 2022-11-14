import {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"



export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState("");
  const [riskScore, setRiskScore] = useState("");
  useEffect(() => fcl.currentUser().subscribe(setCurrentUser), [])
  useEffect(()=>{
    if(currentUser){
      var myHeaders = new Headers();
      myHeaders.append("authority", "emzm4t9k9g.execute-api.eu-west-2.amazonaws.com");
      myHeaders.append("accept", "*/*");
      myHeaders.append("accept-language", "en-GB,en-US;q=0.9,en;q=0.8");
      myHeaders.append("content-type", "application/json;charset=UTF-8");
      myHeaders.append("origin", "null");
      myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"");
      myHeaders.append("sec-ch-ua-mobile", "?0");
      myHeaders.append("sec-ch-ua-platform", "\"Linux\"");
      myHeaders.append("sec-fetch-dest", "empty");
      myHeaders.append("sec-fetch-mode", "cors");
      myHeaders.append("sec-fetch-site", "cross-site");
      myHeaders.append("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36");

      var raw = "{\n    \"sc_address\": \"A.cb627aa14dd14160.BlockpartyNFT\",\n    \"domain\": \"inconfido.com\"\n}";
      //var raw = `{\n    \"sc_address\": \"A.${currentUser.addr}.BlockpartyNFT\",\n    \"domain\": \"${window.location.href}\"\n}`;

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      fetch("https://emzm4t9k9g.execute-api.eu-west-2.amazonaws.com/test/risk_scoring", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result)
          const tmpScore = JSON.parse(result).risk_score;
          const tmpCategory = JSON.parse(result).risk_category;
          setRiskScore(tmpCategory+"-"+tmpScore)         
        })
        .catch(error => console.log('error', error));
          }
  },[currentUser])
  return {currentUser,riskScore}
}
